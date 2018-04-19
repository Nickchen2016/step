const express = require('express');
const path = require('path');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

const models = require('./db');
const Day = models.Day;
const Month = models.Month;

app.use(volleyball);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./api'));

app.get('/', (req, res) => {
  res.send('Hello From Express' );
});

// app.use(express.static(path.join(__dirname, '..', 'public')));
 Day.sync({ force: false })
  .then(function(){
    return Month.sync({ force: false });
  })
  .then(function(){
    app.listen(port, () => console.log(`Listening on port ${port}`));
  })
