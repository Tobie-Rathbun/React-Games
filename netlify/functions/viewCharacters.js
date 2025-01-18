const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.COCKROACHDB_URL,
});

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    try {
      const query = "SELECT * FROM characters"; 
      const result = await pool.query(query);

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "No characters found" }),
        };
      }

      // Return all characters as a JSON object
      return {
        statusCode: 200,
        body: JSON.stringify({ characters: result.rows }),
      };
    } catch (error) {
      console.error("Error fetching characters:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch characters" }),
      };
    }
  }

  
  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
