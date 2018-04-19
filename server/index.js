const express = require('express');
const path = require('path');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(volleyball);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello From Express' );
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(port, () => console.log(`Listening on port ${port}`));

