"use client";

import React, { useState } from "react";

interface StatusSelectorProps {
  initialPoints?: number;
  onSave: (statuses: Record<string, number>, remainingPoints: number) => void;
}

const initialStatuses = {
  MilitaryStatus: 0,
  SocialStatus: 0,
  Wealth: 0,
};

const StatusSelector: React.FC<StatusSelectorProps> = ({ initialPoints = 100, onSave }) => {
  const [statuses, setStatuses] = useState<Record<string, number>>(initialStatuses);
  const [remainingPoints, setRemainingPoints] = useState<number>(initialPoints);

  // Define the cost per level for each status
  const statusCosts: Record<string, number> = {
    MilitaryStatus: 5,
    SocialStatus: 5,
    Wealth: 5,
  };

  // Define the valid ranges for each status
  const statusRanges: Record<string, { min: number; max: number }> = {
    MilitaryStatus: { min: 0, max: 5 },
    SocialStatus: { min: -5, max: 10 },
    Wealth: { min: -5, max: 10 },
  };

  // Calculate cost based on level for each status
  const calculateCost = (status: keyof typeof initialStatuses, level: number) => {
    return level * statusCosts[status];
  };

  // Handle level changes for each status
  const handleLevelChange = (status: keyof typeof initialStatuses, direction: "increase" | "decrease") => {
    const currentLevel = statuses[status];
    const newLevel = direction === "increase" ? currentLevel + 1 : currentLevel - 1;

    const { min, max } = statusRanges[status];
    if (newLevel < min || newLevel > max) return;

    const currentCost = calculateCost(status, currentLevel);
    const newCost = calculateCost(status, newLevel);
    const costDifference = newCost - currentCost;

    if (remainingPoints - costDifference >= 0) {
      setStatuses((prev) => ({ ...prev, [status]: newLevel }));
      setRemainingPoints((prev) => prev - costDifference);
      onSave({ ...statuses, [status]: newLevel }, remainingPoints - costDifference); // Save immediately
    }
  };

  return (
    <div className="level-selector">
      <div className="stat-container">
        {Object.keys(statuses).map((status) => (
          <div key={status} className="stat">
            <button
              className="arrow left"
              onClick={() => handleLevelChange(status as keyof typeof initialStatuses, "decrease")}
            >
              &#8592;
            </button>
            <div className="stat-info">
              <h2>{status}</h2>
              <p>{statuses[status as keyof typeof initialStatuses]}</p>
            </div>
            <button
              className="arrow right"
              onClick={() => handleLevelChange(status as keyof typeof initialStatuses, "increase")}
            >
              &#8594;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusSelector;
