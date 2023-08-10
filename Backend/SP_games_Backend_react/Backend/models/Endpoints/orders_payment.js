const model = require('../configurations/template');

const order_paymentInfo = {
  getOrderInformation : async (userid,limiation) =>{
    try {
      let query = 'SELECT * from consolidated_order_info where userID='+userid
      if(limiation==true){
        query+=' limit 4'
      }else{query}
      return model.async_template(query)
    } catch (error) {
    }
  },
  getPaymentInformation : async (userid) =>{
    try {
      return model.async_template('SELECT * from paymentinformation where userID=?',userid)
    } catch (error) {
      throw error
    }
  },
  getPaymentPaged: async (page, pageSize, search, columns) => {
    try {
      const offset = (page - 1) * pageSize;
      let query = 'SELECT * FROM consolidated_order_info';
      const values = [];
      let whereClauses = []; // Initialize an empty array to store WHERE clauses
  
      // Check for filtering conditions and build the WHERE clauses and values array
      if (search && columns && columns.length > 0) {
        // Build separate LIKE conditions for each column and enclose them in parentheses
        const searchClauses = columns.map(column => ` ${column} LIKE ?`);
        whereClauses.push(`(${searchClauses.join(' OR ')})`);
        columns.forEach(() => values.push(`%${search}%`));
      }
  
      // Combine all the WHERE clauses using the AND operator
      if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
      }
  
      // Add the pagination limit and offset to the main query
      query += ' LIMIT ?, ?';
      values.push(offset, parseInt(pageSize));
  
      // Get the filtered results
      const results = await model.async_template(query, values);
  
      // Create a new query for counting the total results with the same filters
      const countQuery = 'SELECT COUNT(*) FROM consolidated_order_info' + (whereClauses.length > 0 ? ' WHERE ' + whereClauses.join(' AND ') : '');
  
      // Get the total count based on the filtered query
      const totalCountResults = await model.async_template(countQuery, values);
  
      const total_count = parseInt(totalCountResults[0]['COUNT(*)']);
      const maxPages = Math.ceil(total_count / pageSize);
  
      return page > maxPages
        ? { 'maxPages': maxPages }
        : {
            'maxPages': maxPages,
            "Page Index": `Page ${page}/${maxPages}`,
            "results": results
          };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateOrderStatus: async (stats, orderID) => {
    try {
      return model.async_template('UPDATE orders SET orderStatus = ? WHERE orderID = ?', [stats, parseInt(orderID)]);
    } catch (error) {
      // Handle the error appropriately
    }
  },
  addNewOrder : async (userid) =>{
    try {
      return model.async_template('Insert into orders (userID,orderStatus) values (?,"Processing")',[userid])
    } catch (error) {
      
    }
  },
  addNewOrderDetail : async (orderId, game_id, platform_id, quantity) =>{
    try {
      return model.async_template("INSERT INTO order_details (orderID, ProductID, Platformid, amount_of_items) VALUES (?, ?, ?, ?)",[orderId, game_id, platform_id, quantity])
    } catch (error) {
      
    }
  },  addNewPaymentCard: async (userid, paymentType, lastDigits) => {
    try {
      // Insert the new payment card into the paymentInformation table
      return model.async_template(
        'INSERT INTO paymentInformation (userID, paymentType, LastDigits) VALUES (?, ?, ?)',
        [userid, paymentType, lastDigits]
      );
    } catch (error) {
      // Handle the error appropriately
      throw error;
    }
  },
}

module.exports = order_paymentInfo