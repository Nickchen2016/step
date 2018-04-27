const apiRouter = require('express').Router();
const db = require('../db');
const Day = db.Day;
const Week = db.Week;


apiRouter.post('/', (req,res,next)=>{
    Week.create(req.body)
    .then((result)=>{
        res.send(result)
    })
    .catch(next)
})

apiRouter.get('/',(req,res,next)=>{ 
    Week.findAll({
        include:[{ model:Day }]
    }).then(result=>{
        res.send(result);
    }).catch(next)
})

apiRouter.param('id',(req,res,next,id)=>{
    Week.findById(id)
    .then(week=>{
        if(week){
            req.week = week;
            next();
        }else{
            const error = new Error('Campus does not exist');
			error.status = 404;
			throw error;
        }
    })
    .catch(next);
});

apiRouter.put('/:id',(req,res,next)=>{
    req.week.update(req.body)
    .then((result)=>{
        res.send(result)
    })
    .catch(next)
})

// apiRouter.get('/:id',(req,res,next)=>{ 
//         res.send(req.week);
// })

apiRouter.delete('/:id',(req,res,next)=>{
    req.week.destroy()
    .then(()=> res.sendStatus(204))
    .catch(next)
})

module.exports = apiRouter;