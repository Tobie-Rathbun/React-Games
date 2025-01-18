const { Pool } = require("pg");

// Create a pool connection to your database using the connection string
const pool = new Pool({
  connectionString: process.env.COCKROACHDB_URL, // Your connection string from .env
});

exports.handler = async (event) => {
  // Handling GET requests to fetch all characters (no path parameters)
  if (event.httpMethod === "GET" && !event.pathParameters) {
    try {
      const query = "SELECT * FROM characters"; // Fetch all columns from the characters table
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
        body: JSON.stringify({ characters: result.rows }), // Return the list of characters
      };
    } catch (error) {
      console.error("Error fetching characters:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch characters" }),
      };
    }
  }

  // Handling GET requests to fetch a specific character by ID (with path parameters)
  if (event.httpMethod === "GET" && event.pathParameters && event.pathParameters.id) {
    try {
      const { id } = event.pathParameters; // Extract the character ID from the URL
      const query = "SELECT * FROM characters WHERE id = $1"; // Fetch character by ID
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Character not found" }),
        };
      }

      // Return the full character details as a JSON object
      return {
        statusCode: 200,
        body: JSON.stringify({ character: result.rows[0] }),
      };
    } catch (error) {
      console.error("Error fetching character details:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch character details" }),
      };
    }
  }

  // Handling POST requests to insert a new character
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

      // Insert character data into the database
      const query = `
        INSERT INTO characters (name, stats, height, weight, character_points, fat_type, traits, attributes, statuses, disadvantages, skills)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `;

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

      // Execute the query to insert the data into the database
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

  // If the method is not GET or POST, return Method Not Allowed
  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
