const { Pool } = require("pg");
require("dotenv").config();

// Initialize a new pool for PostgreSQL connections
const pool = new Pool({
  connectionString: process.env.COCKROACHDB_URL,
  ssl: {
    rejectUnauthorized: false, // Ensures compatibility with self-signed certificates
  },
});

// Function to execute database queries with improved error handling
module.exports = {
  query: async (text, params) => {
    try {
      console.log(`Executing query: ${text}, with params: ${params}`);
      const result = await pool.query(text, params);
      console.log(`Query result: ${JSON.stringify(result.rows)}`);
      return result;
    } catch (error) {
      console.error(`Error executing query: ${text}`, error.message, error.stack);
      throw error; // Ensure errors are propagated to the calling code
    }
  },
};
