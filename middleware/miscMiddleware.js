
const setNotificationHandler = (notificationObj) => {

    return (req, res, next) => {
        req.app.notification = notificationObj;
        console.log(req.app);
        next();
    };
}

module.exports = setNotificationHandler;