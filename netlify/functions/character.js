const { Pool } = require("pg");

// Use the shared connection string from .env
const pool = new Pool({
  connectionString: process.env.COCKROACHDB_URL,
});

exports.handler = async (event, context) => {
  console.log("Received body:", event.body);
  if (event.httpMethod === "POST") {
    try {
      // Parse the request body
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

      // Construct the query to insert character data into the database
      const query = `
        INSERT INTO characters (name, stats, height, weight, character_points, fat_type, traits, attributes, statuses, disadvantages, skills)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `;
      
      // Values to insert into the database
      const values = [
        name,
        JSON.stringify(stats), // Store stats as JSON
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

      // Log the query and values before executing
      console.log("Executing query:", query);
      console.log("With values:", values);

      // Execute the query to insert the data into the database
      const result = await pool.query(query, values);

      // Log the result of the query
      console.log("Query result:", result.rows[0].id);

      // Return a success response
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

  // If the method is not POST, return Method Not Allowed
  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
