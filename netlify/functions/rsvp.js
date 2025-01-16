const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Resolve the database path
const dbPath = path.resolve(__dirname, "data", "rsvp.db");
console.log("Resolved database path:", dbPath);

// Initialize the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to open database:", err);
  } else {
    console.log("Database connected successfully.");
  }
});

exports.handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  // GET handler
  if (event.httpMethod === "GET") {
    return new Promise((resolve) => {
      db.all("SELECT name FROM rsvp", (err, rows) => {
        if (err) {
          console.error("Error fetching RSVPs:", err);
          resolve({
            statusCode: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: "Failed to fetch RSVPs" }),
          });
        } else {
          resolve({
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              spotsLeft: 3 - rows.length,
              rsvpList: rows.map((row) => row.name),
            }),
          });
        }
      });
    });
  }

  // POST handler
  if (event.httpMethod === "POST") {
    const { name } = JSON.parse(event.body);

    return new Promise((resolve) => {
      db.all("SELECT COUNT(*) as count FROM rsvp", (err, rows) => {
        if (err) {
          console.error("Error counting RSVPs:", err);
          resolve({
            statusCode: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: "Failed to RSVP" }),
          });
          return;
        }

        const spotsLeft = 3 - rows[0].count;
        if (spotsLeft <= 0) {
          resolve({
            statusCode: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: "No spots left" }),
          });
        } else {
          db.run("INSERT INTO rsvp (name) VALUES (?)", [name], (err) => {
            if (err) {
              console.error("Error inserting RSVP:", err);
              resolve({
                statusCode: 500,
                headers: {
                  "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ error: "Failed to RSVP" }),
              });
            } else {
              resolve({
                statusCode: 200,
                headers: {
                  "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "RSVP successful" }),
              });
            }
          });
        }
      });
    });
  }

  // DELETE handler
  if (event.httpMethod === "DELETE") {
    return new Promise((resolve) => {
      console.log("Received DELETE request to clear RSVP list.");

      db.serialize(() => {
        db.run("DELETE FROM rsvp", (err) => {
          if (err) {
            console.error("Error clearing RSVP list:", err);
            resolve({
              statusCode: 500,
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({ error: "Failed to clear RSVPs" }),
            });
          } else {
            console.log("Successfully cleared RSVP list.");
            resolve({
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({ message: "RSVP list cleared" }),
            });
          }
        });
      });

      // Close the database connection after processing
      db.close((err) => {
        if (err) {
          console.error("Error closing the database after DELETE:", err);
        } else {
          console.log("Database connection closed successfully.");
        }
      });
    });
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: "Method Not Allowed",
  };
};
