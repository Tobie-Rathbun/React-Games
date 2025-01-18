const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.COCKROACHDB_URL, // your connection string
});

exports.handler = async (event) => {
  // Handling POST requests to create a new character
  if (event.httpMethod === "POST") {
    try {
      const {
        name,
        stats,
        height,
        weight,
        characterPoints,
        fatType,
        traits,
        attributes,
        statuses,
        disadvantages,
        skills,
      } = JSON.parse(event.body);

      // Log the received data
      console.log("Received data:", { name, stats, height, weight, characterPoints, fatType, traits, attributes, statuses, disadvantages, skills });

      // Validate the received data
      if (!name || !stats || !height || !weight) {
        console.log("Validation failed: Missing required fields");
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Name, stats, height, and weight are required" }),
        };
      }

      // Check if the character already exists in the database
      const checkQuery = "SELECT id FROM characters WHERE name = $1";
      const checkResult = await pool.query(checkQuery, [name]);

      if (checkResult.rows.length > 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Character with this name already exists" }),
        };
      }

      const query = `
        INSERT INTO characters (name, stats, height, weight, character_points, fat_type, traits, attributes, statuses, disadvantages, skills)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `;

      const values = [
        name,
        JSON.stringify(stats),
        height,
        weight,
        characterPoints,
        fatType,
        JSON.stringify(traits),
        JSON.stringify(attributes),
        JSON.stringify(statuses),
        JSON.stringify(disadvantages),
        JSON.stringify(skills),
      ];

      const result = await pool.query(query, values);

      return {
        statusCode: 201,
        body: JSON.stringify({ message: "Character created", id: result.rows[0].id }),
      };
    } catch (error) {
      console.error("Error occurred while inserting into the database:", error);
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
