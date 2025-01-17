"use client";

import React from "react";
import StatSelector from "@components/StatSelector";

const StatPage: React.FC = () => {
  return (
    <div className="page-container">
      <h1>Choose your stats</h1>
      <p>Use the arrows to adjust the levels for ST, DX, IQ, and HT. Manage your points wisely!</p>
      <StatSelector initialPoints={100} />
    </div>
  );
};

export default StatPage;
