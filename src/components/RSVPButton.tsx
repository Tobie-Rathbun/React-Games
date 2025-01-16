"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const RSVPButton = () => {
  const [spotsLeft, setSpotsLeft] = useState(3);
  const [rsvpList, setRsvpList] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Fetch current RSVPs
  useEffect(() => {
    const fetchRSVPs = async () => {
      try {
        const response = await axios.get("http://localhost:4242/rsvp");
        setSpotsLeft(response.data.spotsLeft);
        setRsvpList(response.data.rsvpList);
      } catch (err) {
        console.error("Error fetching RSVPs:", err);
        setError("Failed to load RSVP data.");
      }
    };

    fetchRSVPs();
  }, []);

  const handleRSVP = async () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (spotsLeft <= 0) {
      setError("No spots left!");
      return;
    }

    try {
      await axios.post("http://localhost:4242/rsvp", { name });
      setSpotsLeft(spotsLeft - 1);
      setRsvpList([...rsvpList, name.trim()]);
      setName("");
      setError("");
    } catch (err: any) {
      console.error("Error RSVPing:", err);
      setError(err.response?.data?.error || "Failed to RSVP.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "1em",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1em",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5em",
          width: "100%",
        }}
      >
        <p style={{ margin: 0, whiteSpace: "nowrap", fontSize: "1rem" }}>
          🪑 {spotsLeft}
        </p>
        <input
          type="text"
          value={name}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          style={{
            flex: 1,
            padding: "0.5em",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleRSVP}
          style={{
            padding: "0.5em 1em",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
      {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
    </div>
  );
};

export default RSVPButton;
