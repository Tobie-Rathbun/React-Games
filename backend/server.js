const cors = require("cors");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

const db = new sqlite3.Database("./rsvp.db");

// Create RSVP table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS rsvp (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);
});

// Get current RSVPs
app.get("/rsvp", (req, res) => {
  db.all("SELECT name FROM rsvp", (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch RSVPs" });
    } else {
      res.json({ spotsLeft: 3 - rows.length, rsvpList: rows.map((row) => row.name) });
    }
  });
});

// Add a new RSVP
app.post("/rsvp", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  db.all("SELECT COUNT(*) as count FROM rsvp", (err, rows) => {
    const spotsLeft = 3 - rows[0].count;
    if (spotsLeft <= 0) {
      res.status(400).json({ error: "No spots left" });
    } else {
      db.run("INSERT INTO rsvp (name) VALUES (?)", [name], (err) => {
        if (err) {
          res.status(500).json({ error: "Failed to RSVP" });
        } else {
          res.json({ message: "RSVP successful" });
        }
      });
    }
  });
});

// Clear all RSVPs
app.delete("/rsvp", (req, res) => {
  db.run("DELETE FROM rsvp", (err) => {
    if (err) {
      console.error("Failed to clear RSVPs:", err);
      return res.status(500).json({ error: "Failed to clear RSVPs" });
    }
    console.log("RSVP list cleared");
    res.json({ message: "RSVP list cleared" });
  });
});

// Start the server
app.listen(4242, () => console.log("Server running on http://localhost:4242"));
