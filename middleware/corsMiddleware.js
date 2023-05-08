const cors = require('cors')

const CorsPermission = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-access-token');
    next();
}

const CorsConfig = (req, res, next) => {
    const corsOptions = {
        credentials: true,
        exposedHeaders: ['SET-COOKIE'],
        origin: 'http://localhost:3000',
    }
    cors(corsOptions);
    next();
}

module.exports = {
    CorsPermission,
    CorsConfig
};