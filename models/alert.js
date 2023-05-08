const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const alertSchema = new Schema({
  // period: {
  //   type: Number,
  //   required: true
  // },
  // minutesPassed: {
  //   type: Number,
  //   required: true
  // },
  // secondsPassed: {
  //   type: Number,
  //   required: true
  // },
  gameClock: {
    type: Number,
    required: true
  }, 
  scoreDiff: {
    type: String,
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }, 
  gameId: {
    type: String,
    reg: 'GameAlerts',
    required: true 
  }
});

module.exports = mongoose.model('Alert', alertSchema);