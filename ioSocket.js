const IO = require("socket.io");

class IoSocket {
    constructor (server) {
        this.io = IO(server, {
            cors: {
                origin: "*"
            }
        });
    }

    listen() {
        this.io.on('connection', (socket) => {
            console.log("Client connected");
            console.log(socket.id);
        })
    }

    emitGameUpdate (updatedGame) {
        this.io.emit('games', {action: 'updateGames', game: updatedGame});
    }
}

module.exports = IoSocket;