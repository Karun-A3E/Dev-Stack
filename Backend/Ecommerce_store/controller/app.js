var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json()); // Parse application/json data
app.use(urlencodedParser);

// -----------
const store = require('../models/store')
// ----------

app.get('/users', (req, res) => {
  store.findAll((error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})
app.post('/users', (req, res) => {
  const data = req.body;
  store.insert([data.username,data.email,data.password], (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(201).send(result);
  });
})

app.get('/products', (req, res) => {
  store.products_findall((error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})

app.post('/products', (req, res) => {
  const data = req.body;
  store.product_insert([data.name,data.price,data.description], (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(201).send(result);
  });
})

app.get('/order/details', (req, res) => {
  store.find_orders((error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})

module.exports = app