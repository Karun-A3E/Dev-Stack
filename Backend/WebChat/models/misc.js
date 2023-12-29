const fs = require('fs');
const path = require('path');


const miscFunctions = {
  readJsonFile: function (fileName) {
    try {
      const filePath = path.join(__dirname, fileName);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading JSON file:', error.message);
      return null;
    }
  }
};

module.exports = miscFunctions