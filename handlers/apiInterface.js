
class ApiInterface {

    async fetchData() {
        throw new Error('fetchData() method must be implemented');
    }
}

module.exports = ApiInterface;