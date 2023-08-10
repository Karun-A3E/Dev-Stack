const model = require('../configurations/template');

const Charts = {
  getLinesUserData: async (timeSpan, userType) => {
    let query = "SELECT ";

    if (timeSpan === "weeks") {
      query += "WEEK(created_at) AS time_unit, ";
    } else if (timeSpan === "months") {
      query += "MONTH(created_at) AS time_unit, ";
    } else if (timeSpan === "years") {
      query += "YEAR(created_at) AS time_unit, ";
    }

    query += "COUNT(*) AS user_count FROM user_profiles_view";

    let whereClause = [];
    let params = [];

    if (userType !== "all" && ['admin', 'customer'].includes(userType)) {
      whereClause.push("type = ?");
      params.push(userType);
    }

    if (whereClause.length > 0) {
      query += " WHERE " + whereClause.join(" AND ");
    }

    if (timeSpan === "weeks") {
      query += " GROUP BY WEEK(created_at) ORDER BY WEEK(created_at);";
    } else if (timeSpan === "months") {
      query += " GROUP BY MONTH(created_at) ORDER BY MONTH(created_at);";
    } else if (timeSpan === "years") {
      query += " GROUP BY YEAR(created_at) ORDER BY YEAR(created_at);";
    }
    
    return model.async_template(query, params);
  },
  getBarChartData: async () => {
    const query = `
      SELECT catname, usage_count
      FROM used_category limit 10;
    `;

    try {
      const results =  model.async_template(query);
      return results;
    } catch (error) {
      console.error("Error executing SQL query:", error);
      throw error;
    }
  }
};


module.exports = Charts