const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "data", "rsvp.db");
const db = new sqlite3.Database(dbPath);

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    // Preflight request handling for CORS
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins or specify your domain
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  if (event.httpMethod === "GET") {
    return new Promise((resolve) => {
      db.all("SELECT name FROM rsvp", (err, rows) => {
        if (err) {
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

  if (event.httpMethod === "POST") {
    const { name } = JSON.parse(event.body);

    return new Promise((resolve) => {
      db.all("SELECT COUNT(*) as count FROM rsvp", (err, rows) => {
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

  return {
    statusCode: 405,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: "Method Not Allowed",
  };
};
