const apiRouter = require('express').Router();
const db = require('../db');
const Day = db.Day;
const Month = db.Month;

apiRouter.get('/',(req,res,next)=>{
    Month.findAll({
       include:[{model:Day}]
    })
    .then((result)=>{
        res.send(result)
    })
    .catch(next)
})

module.exports = apiRouter;