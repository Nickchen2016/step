const apiRouter = require('express').Router();
const db = require('../db');
const Day = db.Day;
const Week = db.Week;

apiRouter.get('/',(req,res,next)=>{
    Week.findAll({
       include:[{model:Day}]
    })
    .then((result)=>{
        res.send(result)
    })
    .catch(next)
})

module.exports = apiRouter;