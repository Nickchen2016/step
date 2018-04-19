const express = require('express');
const apiRouter = express.Router();
const db = require('../db');
const Day = db.Day;
const Month = db.Month;

apiRouter.use('/day',require('./day'));
apiRouter.use('/month',require('./month'));

module.exports = apiRouter;