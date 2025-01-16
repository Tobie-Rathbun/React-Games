"use client";
import React, { useState } from "react";
import axios from "axios";

const RSVPClear = ({
  setRsvpList,
}: {
  setRsvpList: (list: string[]) => void;
}) => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleClear = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/rsvp`);
      setRsvpList([]); // Clear the RSVP list in the parent state
      setMessage("All RSVPs have been cleared.");
      setError("");
    } catch (err) {
      console.error("Error clearing RSVP list:", err);
      setError("Failed to clear RSVP list.");
      setMessage("");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "1em",
      }}
    >
      <button
        onClick={handleClear}
        style={{
          padding: "0.5em 1em",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Clear
      </button>
      {message && <p style={{ color: "green", marginTop: "0.5em" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "0.5em" }}>{error}</p>}
    </div>
  );
};

export default RSVPClear;
