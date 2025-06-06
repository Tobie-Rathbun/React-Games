"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import "./styles.css";

interface FetchRSVPResponse {
  spotsLeft: number;
  rsvpList: string[];
}

interface APIErrorResponse {
  error?: string;
}

const RSVPButton = ({
  rsvpList,
  setRsvpList,
}: {
  rsvpList: string[];
  setRsvpList: (list: string[]) => void;
}) => {
  const [spotsLeft, setSpotsLeft] = useState(3);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRSVPs = async () => {
      try {
        const response = await axios.get<FetchRSVPResponse>(`${process.env.NEXT_PUBLIC_API_URL}`);
        setSpotsLeft(response.data.spotsLeft);
        setRsvpList(response.data.rsvpList);
      } catch (err: unknown) {
        const axiosError = err as AxiosError<APIErrorResponse>;
        console.error("Error fetching RSVPs:", axiosError.message);
        setError("Failed to load RSVP data.");
      }
    };

    fetchRSVPs();
  }, [setRsvpList]);

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
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, { name });
      setSpotsLeft(spotsLeft - 1);
      setRsvpList([...rsvpList, name.trim()]);
      setName("");
      setError("");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<APIErrorResponse>;
      console.error("Error RSVPing:", axiosError.message);
      setError(axiosError.response?.data?.error || "Failed to RSVP.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRSVP();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--highlight-color-dark)",
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
            color: "var(--secondary-text-color)",
            backgroundColor: "var(--dark-background)",
          }}
        />
        <button
          onClick={handleRSVP}
          style={{
            padding: "0.5em 1em",
            backgroundColor: "var(--dark-background)",
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
