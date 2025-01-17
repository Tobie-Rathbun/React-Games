"use client";

import React, { useState } from "react";
import "../app/globals.css";

interface GurpsLevelSelectorProps {
  initialPoints?: number;
}

const GurpsLevelSelector: React.FC<GurpsLevelSelectorProps> = ({ initialPoints = 100 }) => {
  const initialLevels = {
    ST: 10,
    DX: 10,
    IQ: 10,
    HT: 10,
  };

  const [levels, setLevels] = useState(initialLevels);
  const [remainingPoints, setRemainingPoints] = useState(initialPoints);

  const calculateCost = (level: number) => {
    if (level <= 9) return (level - 10) * 10;
    if (level >= 11 && level <= 18) return (level - 10) * 10;
    if (level > 18) return 125 + (level - 18) * 25;
    return 0;
  };

  const handleLevelChange = (stat: keyof typeof initialLevels, direction: 'increase' | 'decrease') => {
    const currentLevel = levels[stat];
    const newLevel = direction === 'increase' ? currentLevel + 1 : currentLevel - 1;

    if (newLevel < 1 || newLevel > 20) return;

    const currentCost = calculateCost(currentLevel);
    const newCost = calculateCost(newLevel);
    const costDifference = newCost - currentCost;

    if (remainingPoints - costDifference >= 0) {
      setLevels((prev) => ({ ...prev, [stat]: newLevel }));
      setRemainingPoints((prev) => prev - costDifference);
    }
  };

  return (
    <div className="level-selector">
      <h1
        style={{
          color: remainingPoints === 0 ? "var(--accent-color)" : "var(--highlight-color)",
        }}
      >Remaining Points: {remainingPoints}</h1>
      <div className="stat-container">
        {Object.keys(levels).map((stat) => (
          <div key={stat} className="stat">
            <button
              className="arrow left"
              onClick={() => handleLevelChange(stat as keyof typeof initialLevels, 'decrease')}
            >
              &#8592;
            </button>
            <div className="stat-info">
              <h2>{stat}</h2>
              <p>{levels[stat as keyof typeof initialLevels]}</p>
            </div>
            <button
              className="arrow right"
              onClick={() => handleLevelChange(stat as keyof typeof initialLevels, 'increase')}
            >
              &#8594;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GurpsLevelSelector;
