const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./rsvp.db");

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    return new Promise((resolve) => {
      db.all("SELECT name FROM rsvp", (err, rows) => {
        if (err) {
          resolve({
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch RSVPs" }),
          });
        } else {
          resolve({
            statusCode: 200,
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
            body: JSON.stringify({ error: "No spots left" }),
          });
        } else {
          db.run("INSERT INTO rsvp (name) VALUES (?)", [name], (err) => {
            if (err) {
              resolve({
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to RSVP" }),
              });
            } else {
              resolve({
                statusCode: 200,
                body: JSON.stringify({ message: "RSVP successful" }),
              });
            }
          });
        }
      });
    });
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
