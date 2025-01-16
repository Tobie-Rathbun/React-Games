const faunadb = require("faunadb");

// Initialize FaunaDB client
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET, // Use environment variable for security
});

exports.handler = async (event) => {
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
    try {
      const response = await client.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("RSVP"))),
          q.Lambda("ref", q.Get(q.Var("ref")))
        )
      );

      const rsvpList = response.data.map((doc) => doc.data.name);
      const spotsLeft = Math.max(0, 3 - rsvpList.length);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ rsvpList, spotsLeft }),
      };
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Failed to fetch RSVPs" }),
      };
    }
  }

  // POST handler: Add a new RSVP
  if (event.httpMethod === "POST") {
    const { name } = JSON.parse(event.body);

    try {
      const response = await client.query(q.Count(q.Documents(q.Collection("RSVP"))));
      const spotsLeft = 3 - response;

      if (spotsLeft <= 0) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ error: "No spots left" }),
        };
      }

      await client.query(
        q.Create(q.Collection("RSVP"), {
          data: { name },
        })
      );

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "RSVP successful" }),
      };
    } catch (error) {
      console.error("Error adding RSVP:", error);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Failed to RSVP" }),
      };
    }
  }

  // DELETE handler: Clear all RSVPs
  if (event.httpMethod === "DELETE") {
    try {
      const response = await client.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("RSVP"))),
          q.Lambda("ref", q.Delete(q.Var("ref")))
        )
      );

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "RSVP list cleared" }),
      };
    } catch (error) {
      console.error("Error clearing RSVPs:", error);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Failed to clear RSVPs" }),
      };
    }
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
