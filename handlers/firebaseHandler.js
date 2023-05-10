const admin = require('firebase-admin');
const serviceAccount = require('../util/serviceAccountKey.json');

class FirebaseHandler {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  sendNotification(clientFirebaseToken, gameInfo) {
    const message = {
      notification: {
        title: `Notification from ${gameInfo.gameId}`,
        body: `Game time: ${gameInfo.gameTime}, Home team score: ${gameInfo.homeTeamScore}, Away team score: ${gameInfo.awayTeamScore}`
      },
      token:clientFirebaseToken
    };

    admin.messaging().send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
      }
}

module.exports = FirebaseHandler;