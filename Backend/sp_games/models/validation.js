const model = require('./template')
var validation = { 
  getlen : function(table,parameter,looking_for,callback) {
    model.template(`SELECT COUNT(*) AS count FROM ${table} WHERE ${parameter} = ${looking_for}`,callback)
  }
}

module.exports = validation