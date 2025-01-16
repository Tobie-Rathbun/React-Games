"use client";
import React, { useState } from "react";

const RSVPButton = () => {
  const [spotsLeft, setSpotsLeft] = useState(3); // Default max spots
  const [rsvpList, setRsvpList] = useState<string[]>([]); // List of RSVP'd names
  const [name, setName] = useState(""); // Current input name
  const [error, setError] = useState(""); // Error message

  const handleRSVP = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (spotsLeft <= 0) {
      setError("No spots left!");
      return;
    }

    setRsvpList([...rsvpList, name.trim()]);
    setSpotsLeft(spotsLeft - 1);
    setName(""); // Clear input field
    setError(""); // Clear error
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRSVP();
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
          onKeyPress={handleKeyPress}
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
