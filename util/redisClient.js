const { resolve } = require('path');
const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.zaddAsync = promisify(this.client.zAdd).bind(this.client);
    this.saddAsync = promisify(this.client.sAdd).bind(this.client);
    this.sremAsync = promisify(this.client.sRem).bind(this.client);
    this.smemberAsync = promisify(this.client.sMembers).bind(this.client);
  }

  async connect () {
    await this.client.connect();
  }

  async addGame(game) {
    // console.log("addGames Redis");
    try {
        // console.log(JSON.stringify(game));
        if(typeof game !== 'undefined') {
            await this.zaddAsync('games', JSON.stringify(game));
            console.log("Added succefully");
        }
    }
    catch (err) {
        console.err(err);
    }
    // console.log(this.client.zCard('games'));
  }

  async updateGame(game) {

  }

  async getGames () {
    console.log("getGames Redis");
    try {
        const games = await this.smemberAsync('games')
        const parsedGames = games.map((game) => JSON.parse(game));
        return parsedGames;
    }
    catch (err) {
        console.err(err);
    }
  }

  async addCondition(gameId, condition) {
    await this.saddAsync(`game:${gameId}:conditions`, JSON.stringify(condition));
  }
}

module.exports = RedisClient;