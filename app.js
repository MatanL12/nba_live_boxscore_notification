require('dotenv').config();
const express = require('express');
const {CorsPermission, CorsConfig}  = require("./middleware/corsMiddleware");
const setNotificationHandler = require("./middleware/miscMiddleware");
const ErrorHandler = require('./middleware/errorMiddleware');
const http = require('http');
const bodyParser = require('body-parser');
const connectToDatabase = require('./util/db.js');

const IoSocket = require('./services/ioSocket');
const NotificationHandler = require('./services/notificationHandler');
const FirebaseHandler = require('./services/firebaseHandler');
const BoxScore = require('./services/boxscore');
const ApiCdnNba = require('./services/apiCdnNBA');


const app = express();
const firebaseHandler = new FirebaseHandler();
const notificationHandler = new NotificationHandler(firebaseHandler);
const apiHandler = new ApiCdnNba();

// ---------  Middlewares  ---------
app.use(CorsConfig);
app.use(CorsPermission);
app.use(bodyParser.json());
app.use(setNotificationHandler(notificationHandler));

// ---------  Routers  ---------
const authRoutes = require('./routes/auth');
const alertRoutes = require('./routes/alert');

app.use('/auth', authRoutes);
app.use('/alert', alertRoutes);

app.use(ErrorHandler);

const port = process.env.PORT || 8080;

(async () => {
  try {
    await connectToDatabase();
    
    const server = http.createServer(app);
    const io = new IoSocket(server);
    server.listen(port);
    io.listen();

    notificationHandler.init();
    const boxScore = new BoxScore(io, notificationHandler, apiHandler);
    boxScore.run();

  } catch (error) {
    console.log(error);
  }
})();






