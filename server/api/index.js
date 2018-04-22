const express = require('express');
const apiRouter = express.Router();
const db = require('../db');
const Day = db.Day;
const Week = db.Week;

apiRouter.use('/day',require('./day'));
apiRouter.use('/week',require('./week'));

module.exports = apiRouter;