const { Pool } = require("pg");

// Use the shared connection string from .env
const pool = new Pool({
  connectionString: process.env.COCKROACHDB_URL, // your connection string
});

exports.handler = async (event) => {
  // Handling DELETE requests to delete a character by ID
  if (event.httpMethod === "DELETE" && event.pathParameters && event.pathParameters.id) {
    try {
      const { id } = event.pathParameters; // Extract the character ID from the path parameters

      // Delete the character from the database by its ID
      const query = "DELETE FROM characters WHERE id = $1 RETURNING id";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Character not found" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Character deleted", id: result.rows[0].id }),
      };
    } catch (error) {
      console.error("Error deleting character:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to delete character" }),
      };
    }
  }

  // If the method is not DELETE, return Method Not Allowed
  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
