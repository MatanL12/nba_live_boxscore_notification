const EventEmitter = require("events");
const {compareTwoGameClocks, ComparisionResults, convertGameStatusTextToGameClock} = require('../util/util');

class Game extends EventEmitter {
    constructor(gameId, homeTeam, homeTeamScore, awayTeam, awayTeamScore, gameStatus, gameStatusText) {
        super();
        this.gameId = gameId;
        this.homeTeam = homeTeam;
        this.homeTeamScore = homeTeamScore;
        this.awayTeam = awayTeam;
        this.awayTeamScore = awayTeamScore;
        this.gameStatus = gameStatus;
        this.gameClock = convertGameStatusTextToGameClock(gameStatusText);
        
    }

    updateGame(updatedGame) {
        const newGameClock = convertGameStatusTextToGameClock(updatedGame.gameStatusText);
        if(this.#isGameScoreChanged(updatedGame) ||
            compareTwoGameClocks(this.gameClock, newGameClock) !== ComparisionResults.Equal) {
                this.homeTeamScore = updatedGame.homeTeam.score;
                this.awayTeamScore = updatedGame.awayTeam.score;
                this.gameClock = newGameClock;
                console.log(`Game ${updatedGame.gameId} was updated`);
                return true;
            }
        return false;
    }

    getGameId() {
        return this.gameId;
    }

    getGameClock() {
        return this.gameClock;
    }

    getHomeTeamScore() {
        return this.homeTeamScore;
    }

    getAwayTeamScore() {
        return this.awayTeamScore;
    }

    #isGameScoreChanged(updatedGame) {
        return this.homeTeamScore !== updatedGame.homeTeam.score || this.awayTeamScore !== updatedGame.awayTeam.score;
    }

}

module.exports = Game;