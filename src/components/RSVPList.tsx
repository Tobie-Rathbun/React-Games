"use client";
import React from "react";

const RSVPList = ({ rsvpList }: { rsvpList: string[] }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--highlight-color-dark)",
        padding: "1em",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h3 style={{ margin: "0 0 1em", fontSize: "1.25rem", color: "#fff" }}>RSVP List</h3>
      {rsvpList.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            fontSize: "1rem",
            color: "var(--secondary-text-color)",
          }}
        >
          {rsvpList.map((name, index) => (
            <li
              key={index}
              style={{
                padding: "0.5em 0",
                borderBottom: index !== rsvpList.length - 1 ? "1px solid #fff" : "none",
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: "0.9rem", color: "#555" }}>No RSVPs yet.</p>
      )}
    </div>
  );
};

export default RSVPList;
