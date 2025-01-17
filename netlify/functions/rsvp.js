const db = require("./db");

exports.handler = async (event) => {
  console.log("Event received:", event.httpMethod);

  // Handle CORS preflight requests
  if (event.httpMethod === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  if (event.httpMethod === "GET") {
    try {
      console.log("Fetching RSVP list from database");
      const { rows } = await db.query("SELECT name FROM rsvp");
      const spotsLeft = Math.max(0, 3 - rows.length);

      console.log("RSVP list fetched successfully:", rows);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          rsvpList: rows.map((row) => row.name),
          spotsLeft,
        }),
      };
    } catch (error) {
      console.error("Error fetching RSVPs:", error.message, error.stack);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Failed to fetch RSVPs" }),
      };
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const { name } = JSON.parse(event.body);
      console.log("Adding RSVP:", name);

      // Validate name input
      if (!name || typeof name !== "string" || name.trim() === "") {
        console.error("Invalid name provided:", name);
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ error: "Invalid name provided" }),
        };
      }

      const { rows } = await db.query("SELECT COUNT(*) AS count FROM rsvp");
      const spotsLeft = 3 - parseInt(rows[0].count, 10);

      console.log("Spots left:", spotsLeft);
      if (spotsLeft <= 0) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ error: "No spots left" }),
        };
      }

      await db.query("INSERT INTO rsvp (name) VALUES ($1)", [name.trim()]);
      console.log("RSVP added successfully:", name);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "RSVP successful" }),
      };
    } catch (error) {
      console.error("Error adding RSVP:", error.message, error.stack);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Failed to RSVP" }),
      };
    }
  }

  if (event.httpMethod === "DELETE") {
    try {
      console.log("Clearing all RSVPs");
      await db.query("DELETE FROM rsvp");
      console.log("RSVP list cleared successfully");

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "RSVP list cleared" }),
      };
    } catch (error) {
      console.error("Error clearing RSVPs:", error.message, error.stack);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Failed to clear RSVPs" }),
      };
    }
  }

  console.error("Unsupported HTTP method:", event.httpMethod);
  return {
    statusCode: 405,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: "Method Not Allowed",
  };
};
