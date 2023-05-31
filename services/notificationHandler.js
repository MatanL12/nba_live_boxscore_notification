const Alert = require('../models/alert');
const GameAlerts = require('../models/gameAlerts');
const User = require('../models/user');
const {isGameClockPassed} = require('../util/util');

class NotificationHandler {
    constructor (firebaseHandler) {
        this.futureAlertsObj = {};
        this.passedAlertsObj = {};
        this.firebaseHandler = firebaseHandler;
        this.notify = this.notify.bind(this);
    }

    async init () {
        await this.#loadAlertsFromDB();
    }
    
    async subscribe(alertId) {
        try {
            const alert = await Alert.findById(alertId);
            this.#addAlertToFutureAlertsObj(alert.gameId, alert);
        }
        catch (err) {
            console.log(err);
        }
    }

    notify (updatedGame) {
        this.#moveAlertsFromFutureToPassed(updatedGame);
        this.#sendNotificationIfCriteriaMet(updatedGame);
    }

    #moveAlertsFromFutureToPassed(updatedGame) {
        const gameId = updatedGame.getGameId();

        for(let i = 0; i < this.futureAlertsObj[gameId].length; i++) {
            const alert = this.futureAlertsObj[gameId][i];
            if(isGameClockPassed(alert.gameClock, updatedGame.getGameClock())) {
                this.passedAlertsObj[gameId].push(alert);
                this.futureAlertsObj[gameId].splice(i, 1);
                i--;
            }
        }
    }

    #sendNotificationIfCriteriaMet(updatedGame) {
        const gameId = updatedGame.getGameId();
        for(let i = 0; i < this.passedAlertsObj[gameId].length; i++) {
            const alert = this.passedAlertsObj[gameId][i];
            const scoreDiff = Math.abs(updatedGame.getHomeTeamScore() - updatedGame.getAwayTeamScore());
            if(scoreDiff <= alert.scoreDiff){
                const gameInfo = {
                    gameId: gameId,
                    gameTime: updatedGame.getGameClock(),
                    homeTeamScore: updatedGame.getHomeTeamScore(),
                    awayTeamScore: updatedGame.getAwayTeamScore()
                }
                this.firebaseHandler.sendNotification(alert.firebaseToken, gameInfo);
                // console.log(`Alert sent to alertId - ${alert._id}`);
                this.passedAlertsObj[gameId].splice(i, 1);
            }
        }
    }

    async #loadAlertsFromDB () {
        const allGames = await GameAlerts.find();
        for(let game of allGames) {
            const allAlertsPerGame = game.alerts;
            const gameId = game._id;
            this.futureAlertsObj[gameId] = [];
            this.passedAlertsObj[gameId] = [];
            for(let alert of allAlertsPerGame) {
                const alertObj = await Alert.findById(alert._id);
                this.#addAlertToFutureAlertsObj(gameId, alertObj);
            }
        }
    }

    async #addAlertToFutureAlertsObj(gameId, alertObj) {
        alertObj.firebaseToken = await this.#extractUserFirebaseToken(alertObj.userId);
        this.futureAlertsObj[gameId].push(alertObj);
    }

    async #extractUserFirebaseToken(userId) {
        try {
            const user = await User.findById(userId);
            if(user) {
                return user.firebaseRegistrationToken;
            }
            else {
                return "";
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}

module.exports = NotificationHandler;
