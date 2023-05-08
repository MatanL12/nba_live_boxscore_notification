const express = require('express');
const alertController = require('../controllers/alert');
const isAuth = require('../middleware/isAuthMiddleware');
const router = express.Router();

router.post('/addAlert',isAuth, alertController.postAlert);

module.exports = router;