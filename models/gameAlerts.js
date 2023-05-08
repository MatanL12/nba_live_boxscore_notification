const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameAlertsSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    }, 
    alerts: [
      { 
        type: Schema.Types.ObjectId,
        ref: 'Alert' 
      }
    ],
  },
);

module.exports = mongoose.model('GameAlerts', gameAlertsSchema);