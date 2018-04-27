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

apiRouter.post('/', (req,res,next)=>{
    Day.create(req.body)
    .then((result)=>{
        res.send(result)
    })
    .catch(next)
})

// apiRouter.delete('/:id',(req,res,next)=>{
//     Day.findById(req.params.id)
//     .then(result=>result.destroy())
//     .then(()=> res.sendStatus(204))
//     .catch(next)
// })

module.exports = apiRouter;