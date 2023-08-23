var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json()); // Parse application/json data
app.use(urlencodedParser);

// --
const bloggingplatform = require('../models/blogging_platform')
// --

app.get('/posts/users', (req, res) => {
  bloggingplatform.getUserCred_category_post_all((error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})

app.get('/posts/:id/comments', (req, res) => {
  const id = req.params.id;
  bloggingplatform.findById(id, (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(result);
  });
})

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  bloggingplatform.getPostbyID(id, (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(result);
  });
})

app.get('/posts/category/:id', (req, res) => {
  const id = req.params.id;
  bloggingplatform.categoryid_find(id, (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(result);
  });
})










module.exports = app