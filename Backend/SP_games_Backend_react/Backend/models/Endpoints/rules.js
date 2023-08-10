const fs = require("fs");

function readAdminRulesConfig(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at: ${filePath}`);
    }

    const data = fs.readFileSync(filePath, "utf8");
    const configData = JSON.parse(data);

    if (!Array.isArray(configData.rules)) {
      throw new Error("Invalid admin_rules.config: 'rules' is not an array.");
    }

    // Initialize an empty object to store the filter rules
    const filterRules = {};

    // Loop through each rule and process the filter rules
    configData.rules.forEach((rule) => {
      if (!rule.filter_rules || !Array.isArray(rule.filter_rules)) {
        throw new Error("Invalid admin_rules.config: 'filter_rules' is missing or not an array.");
      }

      // Initialize an object to store the commands for each table
      const tableCommands = {};

      // Loop through each filter rule
      rule.filter_rules.forEach((filterRule) => {
        if (!filterRule.table || !filterRule.columns || !Array.isArray(filterRule.columns)) {
          throw new Error("Invalid admin_rules.config: 'table' or 'columns' is missing or not an array.");
        }

        // Initialize an array to store the column names and rules
        const columnsData = [];

        // Loop through each column in the filter rule
        filterRule.columns.forEach((column) => {
          if (!column["column Name"] || !column.rule) {
            throw new Error("Invalid admin_rules.config: 'column Name' or 'rule' is missing.");
          }

          let sqlCommand;
          if (!column["Custom SQL"]) {
            switch (column.rule) {
              case "*":
                sqlCommand = `SELECT ${column["column Name"]} FROM ${filterRule.table}`;
                break;
              case "distinct":
                sqlCommand = `SELECT DISTINCT(${column["column Name"]}) FROM ${filterRule.table};`;
                break;
              case "range":
                // Handle custom SQL queries for "range" rule if needed
                sqlCommand = `SELECT max(${column["column Name"]}) as maximum, min(${column["column Name"]}) as minimum FROM ${filterRule.table};`;
                break;
              // Add more cases for other rules if required
              // case "your_custom_rule":
              //   sqlCommand = `Your custom SQL query here`;
              //   break;
              default:
                throw new Error(`Invalid rule: unsupported 'rule' value '${column.rule}'.`);
            }
          } else {
            sqlCommand = column["Custom SQL"];
          }

          columnsData.push({ "column Name": column["column Name"], sqlCommand,"Status" : column["Status"],Pagination : column["Pagination"],rule : column["rule"],table :filterRule['table']});
        });

        // Add the column data to the tableCommands object
        tableCommands[filterRule.table] = columnsData;
      });

      // Add the tableCommands object to the filter rules object under the rule name
      filterRules[rule.name] = tableCommands;
    });

    return filterRules;
  } catch (error) {
    console.error(`Error reading admin_rules.config: ${error.message}`);
    return null;
  }
}


// console.log(readAdminRulesConfig('./rules.json'))
// Usage example
const sqlRules = readAdminRulesConfig('./models/configurations/rules.json');
const filterRules = sqlRules["Filter"];
const model = require('../configurations/template');
const filter = {
  allInAll: async (tableNames, page, itemsPerPage = 20) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage - 1; // Corrected calculation for endIndex
    const promisesWithTable = [];

    Object.keys(filterRules).forEach((key) => {
      if (key in tableNames) {
        filterRules[key].forEach((x) => {
          // Skip processing the rule if it has "Status" set to "Disabled"
          if (x.Status && x.Status.toLowerCase() === "disabled") {
            return; // Skip to the next iteration
          }

          const columnName = x["column Name"]; // Extract the first 4 characters
          if (x.Pagination && x.Pagination.toLowerCase() === "true") {
            let sqlCommand = x['sqlCommand'] + ` limit ${startIndex}, ${itemsPerPage};`; // Use itemsPerPage instead of endIndex
            promisesWithTable.push({ column: columnName  , promise: model.async_template(sqlCommand), Pagination: true, rule: x.rule , table:x['table']});
          } else {
            promisesWithTable.push({ column: columnName, promise: model.async_template(x['sqlCommand']), Pagination: false, rule: x.rule,table:x['table']});
          }
        });
      }
    });

    try {
      const results = await Promise.all(promisesWithTable.map(({ promise }) => promise));
      const resultant = promisesWithTable.map((item, index) => ({
        columnName: item['column'], // Include the tableName in the resultant array
         // Include the columnsData (with column names and rules) in the resultant array
         tableName : item['table'],  
        result: results[index],
        Pagination: item.Pagination,
        rule: item.rule,
      }));
    
      const lengths = await filter.getLength(tableNames);
      // Append the lengths to the resultant array
      const resultantWithLength = resultant.map((item) => ({
        ...item,
        length: lengths[item.tableName],
      }));
      return resultantWithLength;
      
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  getLength : async (tableName) =>{
    try {
      let table_names = []
      Object.keys(tableName).forEach((key)=>{table_names.push(key)})
      let table_name_with_length = {};
      for (const tableName of table_names) {
        const query = `SELECT count(*) as length FROM ${tableName};`;
        const result = await model.async_template(query);
        table_name_with_length[tableName] = result[0].length;
      }
      return table_name_with_length
    } catch (error) {
      throw error
    }
  }
};

module.exports = filter;



