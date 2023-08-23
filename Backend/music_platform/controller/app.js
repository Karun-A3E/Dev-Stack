var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json()); // Parse application/json data
app.use(urlencodedParser);
// 
const music = require('../models/music_log')
// 

app.get('/songs', (req, res) => {
  music.findAll((error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})

app.get('/albums', (req, res) => {
  music.find_all_ablums((error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})



app.get('/songs?genre={genre}', (req, res) => {
  music.getGenre(req.query.genre,(error, results) => {
    console.log('somthing')
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})


app.get('/artists', (req, res) => {
  music.getAllArtistSongs((error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})



module.exports = app