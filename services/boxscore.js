const GameBuilder = require('./gameBuilder');
const GameAlerts = require('../models/gameAlerts');

class BoxScore {
    constructor (socket, notificationHandler, apiHandler) {
        this.socket = socket;
        this.boxscoreDate = '';
        this.liveGames = [];
        this.notificationHandler = notificationHandler;
        this.apiHandler = apiHandler;
    }

    async run () { 
        setInterval(async () => {
            try {
                let results = await this.apiHandler.fetchData();
                this.#updateDbGames(results.games, results.boxscoreDate);
                this.#updateCacheGames(results.games, results.boxscoreDate);
                this.boxscoreDate = results.boxscoreDate;
                
            }
            catch (err) {
                console.log("An error occured: " + err);
            }
        }, 3000);
    }

    #updateCacheGames (fetchedGames, updatedBoxscoreDate) {
        if(this.boxscoreDate !== updatedBoxscoreDate) {
            this.liveGames = [];
        }
        fetchedGames.forEach(fetchedGame => {
            const existGame = this.liveGames.find( (game) => {return game.getGameId() === fetchedGame.gameId });
            if(typeof existGame === 'undefined') {
                const newGame = new GameBuilder(fetchedGame.gameId)
                    .withHomeTeam(fetchedGame.homeTeam)
                    .withHomeTeamScore(fetchedGame.homeTeam.score)
                    .withAwayTeam(fetchedGame.awayTeam)
                    .withAwayTeamScore(fetchedGame.awayTeam.score)
                    .withGameStatus(fetchedGame.gameStatus)
                    .withGameStatusText(fetchedGame.gameStatusText)
                    .build();

                this.liveGames.push(newGame);
                this.socket.emitGameUpdate(fetchedGame);
                newGame.on(`updateGame${fetchedGame.gameId}`, this.notificationHandler.notify);
            }
            else if (existGame.updateGame(fetchedGame)) {
                this.socket.emitGameUpdate(fetchedGame);
                existGame.emit(`updateGame${fetchedGame.gameId}`, existGame);
            }
        });
    }
    

    async #updateDbGames (fetchedGames, updatedBoxscoreDate) {
        if(this.boxscoreDate !== updatedBoxscoreDate) {
            try {
                fetchedGames.forEach(async (game) => {
                    let newGame = await GameAlerts.findById(game.gameId);
                    if(!newGame) {
                        newGame = new GameAlerts({
                            _id: game["gameId"],
                            alerts: []
                        })
                        await newGame.save();
                    }	
                })
            }
            catch (err) {
                console.log("Unable to save games");
                console.log(err);
            }
        }
    }
}

module.exports = BoxScore;
