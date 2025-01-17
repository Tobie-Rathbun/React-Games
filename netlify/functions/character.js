const { Pool } = require("pg");

// Use the shared connection string from .env
const pool = new Pool({
  connectionString: process.env.COCKROACHDB_URL,
});

exports.handler = async (event, context) => {
  if (event.httpMethod === "POST") {
    try {
      const { name, stats } = JSON.parse(event.body);

      if (!name || !stats) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Name and stats are required" }),
        };
      }

      const query = `
        INSERT INTO characters (name, stats)
        VALUES ($1, $2)
        RETURNING id
      `;
      const values = [name, JSON.stringify(stats)];

      const result = await pool.query(query, values);

      return {
        statusCode: 201,
        body: JSON.stringify({ message: "Character created", id: result.rows[0].id }),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
