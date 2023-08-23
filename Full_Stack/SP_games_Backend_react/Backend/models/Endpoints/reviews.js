const model = require("../configurations/template");

const reviews = {
  getReviewByGameid : async (gameid) =>{
    try {
      return model.async_template("Select * from game_reviews_view where game_id=?",[gameid])
    } catch (error) {
      throw error
    }
  },
  getRecentReviewMadeByUser : async(userID,limitation) =>{
    try {
      let query = 'Select * from game_reviews_view where user_id = ?'
      if(limitation==true){
        query+=' limit 2'
      }else{query}
      return model.async_template(query,[userID])
    } catch (error) {
      throw error
    }
  },
  createReview : async (review) => {
    try {
      const query = 'INSERT INTO reviews (user_id, game_id, review, rating) VALUES (?,?,?,?)';
      return model.async_template(query,review)
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }
}

module.exports = reviews