const Alert = require('../models/alert');
const GameAlerts = require('../models/gameAlerts');
const {convertToGameTime} = require('../util/util');

// POST /alert/addAlert
exports.postAlert = async (req, res, next) => {
    const gameId = req.body.gameId;
    const userId = req.userId;
    const alert = new Alert({
        gameClock: convertToGameTime(req.body.period, req.body.minutes, req.body.seconds),
        scoreDiff: req.body.scoreDiff,
        gameId: gameId,
        userId: userId
      });
    try {
        await alert.save();
        const game = await GameAlerts.findById(gameId);
        if(!game) {
            const error = new Error('Invalid gameId!');
            error.statusCode = 401;
            throw error;
        }
        game.alerts.push(alert);
        await game.save();
        req.app.notification.subscribe(alert._id);
        res.status(201).json({
            message: 'Alert created successfully!',
            alert: alert,
            game: game
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}