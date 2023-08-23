var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json()); // Parse application/json data
app.use(urlencodedParser);

// 
const games = require('../models/games')
// 

app.get('/platform', (req, res) => {
  games.getAllPlatforms((error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})

app.get('/games', (req, res) => {
  games.getAllGames((error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})

app.get('/games/:platformid', (req, res) => {
  const id = req.params.platformid;
  games.findById(id, (error, result) => {
    return error ?( res.status(500).send('Internal Server Error'),console.log(error)) : res.status(200).send(result);
  });
})
module.exports = app