const model = require("../configurations/template");

const validation = {
  getLength: async (table, columnName, columnValue) => {
    try {
      return model.async_template(`SELECT count(*) FROM ${table} where ${columnName} = ?`,columnValue)
    } catch (error) { throw error }
  }
}


module.exports  = validation