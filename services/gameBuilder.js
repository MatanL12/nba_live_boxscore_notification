const Game = require('./game');

class GameBuilder {
    constructor(gameId) {
        this.gameId = gameId;
    }

    withHomeTeam(homeTeam) {
        this.homeTeam = homeTeam;
        return this;
    }
    
    withHomeTeamScore(homeTeamScore) {
        this.homeTeamScore = homeTeamScore;
        return this;
    }

    withAwayTeam(awayTeam) {
        this.awayTeam = awayTeam;
        return this;
    }

    withAwayTeamScore(awayTeamScore) {
        this.awayTeamScore = awayTeamScore;
        return this;
    }

    withGameStatus(gameStatus) {
        this.gameStatus = gameStatus;
        return this;
    }

    withGameStatusText(gameStatusText) {
        this.gameStatusText = gameStatusText;
        return this;
    }

    build() {
        return new Game(
            this.gameId,
            this.homeTeam,
            this.homeTeamScore,
            this.awayTeam,
            this.awayTeamScore,
            this.gameStatus,
            this.gameStatusText,
        );
    }
}

module.exports = GameBuilder;