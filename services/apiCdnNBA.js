const ApiInterface = require('./apiInterface');
const axios = require('axios');

class ApiCdnNba extends ApiInterface {
    constructor() {
        super();
    }

    async fetchData() {
        const response = await axios.get('https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json')
        return ({games:response.data["scoreboard"]["games"], boxscoreDate:response.data["scoreboard"]["gameDate"]})
    }
}

module.exports = ApiCdnNba;