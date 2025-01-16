const faunadb = require("faunadb");

// Initialize FaunaDB client
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET, // Use environment variable for security
});

exports.handler = async (event) => {
  // Resolve the database path, ensuring compatibility with Netlify Functions
  const dbPath = path.join(process.env.LAMBDA_TASK_ROOT || __dirname, "data", "rsvp.db");
  console.log("Resolved database path:", dbPath);

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Failed to open database:", err);
    } else {
      console.log("Database connected successfully.");
    }
  });

  const closeDb = () => {
    db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err);
      } else {
        console.log("Database connection closed successfully.");
      }
    });
  };

  if (event.httpMethod === "OPTIONS") {
    // Handle CORS preflight request
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  // GET handler: Fetch RSVP list
  if (event.httpMethod === "GET") {
    return new Promise((resolve) => {
      db.all("SELECT name FROM rsvp", (err, rows) => {
        closeDb(); // Close the database connection
        if (err) {
          console.error("Error fetching RSVPs:", err);
          resolve({
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Failed to fetch RSVPs" }),
          });
        } else {
          resolve({
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
              spotsLeft: 3 - rows.length,
              rsvpList: rows.map((row) => row.name),
            }),
          });
        }
      });
    });
  }

  if (event.httpMethod === "POST") {
    const { name } = JSON.parse(event.body);

    return new Promise((resolve) => {
      db.all("SELECT COUNT(*) as count FROM rsvp", (err, rows) => {
        if (err) {
          console.error("Error counting RSVPs:", err);
          closeDb(); // Close the database connection
          resolve({
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Failed to RSVP" }),
          });
          return;
        }

        const spotsLeft = 3 - rows[0].count;
        if (spotsLeft <= 0) {
          closeDb(); // Close the database connection
          resolve({
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "No spots left" }),
          });
        } else {
          db.run("INSERT INTO rsvp (name) VALUES (?)", [name], (err) => {
            closeDb(); // Close the database connection
            if (err) {
              console.error("Error inserting RSVP:", err);
              resolve({
                statusCode: 500,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "Failed to RSVP" }),
              });
            } else {
              resolve({
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "RSVP successful" }),
              });
            }
          });
        }
      });
    });
  }

  if (event.httpMethod === "DELETE") {
    return new Promise((resolve) => {
      db.run("DELETE FROM rsvp", (err) => {
        closeDb(); // Close the database connection
        if (err) {
          console.error("Error clearing RSVP list:", err);
          resolve({
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Failed to clear RSVPs" }),
          });
        } else {
          resolve({
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "RSVP list cleared" }),
          });
        }
      });
    });
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: "Method Not Allowed",
  };
};
