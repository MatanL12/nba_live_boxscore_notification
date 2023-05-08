const admin = require('firebase-admin');
const serviceAccount = require('../util/serviceAccountKey.json');
// const {initializeApp} = require("firebase/app");
// const {getMessaging, getToken } = require("firebase/messaging");

class FirebaseService {
  constructor(config) {
    // this.app = initializeApp(config);
    // this.messaging = getMessaging(this.app);
    // getToken(this.messaging, BIro8pI2OmE2N0qkUhuCjqMGQJLWAMn-ZDf4Z8DmZ4OZ4Ad8_YCLoOPElyNIkNN4J7-PFROv_l9wuPW0YtFajVA);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  sendNotification(clientFirebaseToken) {
    const message = {
      notification: {
        title: 'New Message',
        body: 'You have a new message!'
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

module.exports = FirebaseService;