const apiRouter = require('express').Router();
const db = require('../db');
const Day = db.Day;
const Week = db.Week;

apiRouter.get('/',(req,res,next)=>{
    Day.findAll({
       include:[{model:Week}]
    })
    .then((result)=>{
        res.send(result)
    })
    .catch(next)
})


module.exports = apiRouter;