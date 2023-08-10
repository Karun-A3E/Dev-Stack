const XLSX = require('xlsx');
const fs = require('fs');
if(fs.existsSync('sql_seed.sql')){
  fs.unlink('sql_seed.sql', (err) => {
    if (err) {
      console.error('Error while deleting the file:', err);
    } else {
      console.log('File creating in progess...');
    }
  });
}
// Read the Excel file
const workbook = XLSX.readFile('./SQL_data.xlsx');

const value_return_func = (sheetname,lettername)=>{
  const sheet = workbook.Sheets[sheetname];
  const letter = lettername;
  const values = XLSX.utils.sheet_to_json(sheet,{header : 1})
    .slice(1)
    .map(row => row[XLSX.utils.decode_col(letter)])
    .map(row => `(${row})`);
  return values
}

const usersInsertStatement = `INSERT INTO users (username, email, password, profile_pic_url,type) VALUES ${(value_return_func('Users',"I")).join(',\n')};\n`;
const platformsInsertStatement = `\nINSERT INTO platform (platform_name, platform_description) VALUES ${(value_return_func('Platforms','D')).join(',\n')};\n`;
const categoryInsertStatement = `\n INSERT INTO category (catname, cat_description) VALUES ${(value_return_func('Category','D')).join(',\n')};\n`;
const reviewInsertStatement = `\nINSERT INTO reviews (user_id, game_id,rating,review) VALUES ${(value_return_func('Review','F')).join(',\n')};\n`;
const gameInsert = `\nINSERT INTO games (title,description,released_year,status) VALUES ${(value_return_func('Games','G')).join(',\n')};\n`;
const gamesCategory = `\nINSERT INTO games_category (gameid,category_id) VALUES ${(value_return_func('Games_category','D')).join(',\n')};\n`;
const gamesPlatform = `\nINSERT INTO games_platform (gameid,platform_id,price) VALUES ${(value_return_func('Games_platform','E')).join(',\n')};\n`;
const games_bookmarks = `\nINSERT INTO games_bookmarks (gameid,user_id) VALUES ${(value_return_func('Games_bookmarks','D')).join(',\n')};\n`;
const Orders = `\nINSERT INTO orders (userID,orderStatus) VALUES ${(value_return_func('Orders','D')).join(',\n')};\n`;
const order_information = `\nINSERT INTO order_details (orderID,ProductID,amount_of_items,Platformid) VALUES ${(value_return_func('Order_information','F')).join(',\n')};\n`;
const PaymentInfo = `\nINSERT INTO paymentInformation (userID,paymentType,LastDigits) VALUES ${(value_return_func('Payment Information','F')).join(',\n')};\n`;




// Append the SQL insert statements to the SQL file
fs.appendFileSync('sql_seed.sql', usersInsertStatement);
fs.appendFileSync('sql_seed.sql', platformsInsertStatement);
fs.appendFileSync('sql_seed.sql', categoryInsertStatement);
fs.appendFileSync('sql_seed.sql',gameInsert)
fs.appendFileSync('sql_seed.sql', reviewInsertStatement);
fs.appendFileSync('sql_seed.sql', gamesCategory);
fs.appendFileSync('sql_seed.sql', gamesPlatform);
// fs.appendFileSync('sql_seed.sql', games_views);
fs.appendFileSync('sql_seed.sql', games_bookmarks);
// fs.appendFileSync('sql_seed.sql', products);
fs.appendFileSync('sql_seed.sql', Orders);
fs.appendFileSync('sql_seed.sql', order_information);
fs.appendFileSync('sql_seed.sql', PaymentInfo);


console.log('SQL_seed.sql has been made...')