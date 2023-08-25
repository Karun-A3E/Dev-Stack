const mongoose = require('mongoose');
const configurationSettings = require('./confg')
const dbURL = configurationSettings.databaseURL
process.env.
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

module.exports = mongoose.connection; // Export the connection instance