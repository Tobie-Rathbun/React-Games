"use client";

import React, { useState, useEffect } from "react";
import "./styles.css";

interface StatusSelectorProps {
  statuses: Record<string, number>; // Receive current status values from parent
  initialPoints?: number;
  onSave: (statuses: Record<string, number>, remainingPoints: number) => void; // Callback to save updated data
}

const statusCosts: Record<string, number> = {
  MilitaryStatus: 5,
  SocialStatus: 5,
  Wealth: 5,
};

const statusRanges: Record<string, { min: number; max: number }> = {
  MilitaryStatus: { min: 0, max: 5 },
  SocialStatus: { min: -5, max: 10 },
  Wealth: { min: -5, max: 10 },
};

const StatusSelector: React.FC<StatusSelectorProps> = ({ statuses, initialPoints = 100, onSave }) => {
  const [remainingPoints, setRemainingPoints] = useState<number>(initialPoints);
  const [localStatuses, setLocalStatuses] = useState<Record<string, number>>(statuses);

  // Calculate cost based on level for each status
  const calculateCost = (status: keyof typeof statusCosts, level: number) => {
    return level * statusCosts[status];
  };

  // Handle level changes for each status
  const handleLevelChange = (status: keyof typeof statusRanges, direction: "increase" | "decrease") => {
    const currentLevel = localStatuses[status];
    const newLevel = direction === "increase" ? currentLevel + 1 : currentLevel - 1;

    const { min, max } = statusRanges[status];
    if (newLevel < min || newLevel > max) return;

    const currentCost = calculateCost(status, currentLevel);
    const newCost = calculateCost(status, newLevel);
    const costDifference = newCost - currentCost;

    if (remainingPoints - costDifference >= 0) {
      setLocalStatuses((prev) => ({ ...prev, [status]: newLevel }));
      setRemainingPoints((prev) => prev - costDifference);
      onSave({ ...localStatuses, [status]: newLevel }, remainingPoints - costDifference); // Save immediately
    }
  };

  // Sync with parent when statuses change
  useEffect(() => {
    setLocalStatuses(statuses); // Ensure local state reflects the parent state
  }, [statuses]);

  return (
    <div className="level-selector">
      <div className="stat-container">
        {Object.keys(localStatuses).map((status) => (
          <div key={status} className="stat">
            <button
              className="arrow left"
              onClick={() => handleLevelChange(status as keyof typeof statusRanges, "decrease")}
            >
              &#8592;
            </button>
            <div className="stat-info">
              <h2>{status}</h2>
              <p>{localStatuses[status as keyof typeof localStatuses]}</p>
            </div>
            <button
              className="arrow right"
              onClick={() => handleLevelChange(status as keyof typeof statusRanges, "increase")}
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
