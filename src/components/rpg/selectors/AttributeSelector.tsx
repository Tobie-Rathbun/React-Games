"use client";

import React, { useState, useEffect } from "react";
import "./styles.css";

interface AttributeSelectorProps {
  attributes: Record<string, number>; // Pass current attributes as prop
  initialPoints?: number;
  onSave: (attributes: Record<string, number>, remainingPoints: number) => void; // Callback to save updated data
}

const attributeCosts: Record<string, number> = {
  Alertness: 5,
  Charisma: 5,
  Climbing: 5,
  Navigation: 5,
  Willpower: 5,
};

const attributeRanges: Record<string, { min: number; max: number }> = {
  Alertness: { min: 0, max: 5 },
  Charisma: { min: 0, max: 20 },
  Climbing: { min: 0, max: 10 },
  Navigation: { min: 0, max: 5 },
  Willpower: { min: -5, max: 10 },
};

const AttributeSelector: React.FC<AttributeSelectorProps> = ({ attributes, initialPoints = 100, onSave }) => {
  const [remainingPoints, setRemainingPoints] = useState<number>(initialPoints);
  const [localAttributes, setLocalAttributes] = useState(attributes);

  const calculateCost = (attribute: keyof typeof attributeCosts, level: number) => {
    return level * attributeCosts[attribute];
  };

  const handleLevelChange = (attribute: keyof typeof localAttributes, direction: "increase" | "decrease") => {
    const currentLevel = localAttributes[attribute];
    const newLevel = direction === "increase" ? currentLevel + 1 : currentLevel - 1;

    const { min, max } = attributeRanges[attribute];
    if (newLevel < min || newLevel > max) return;

    const currentCost = calculateCost(attribute, currentLevel);
    const newCost = calculateCost(attribute, newLevel);
    const costDifference = newCost - currentCost;

    if (remainingPoints - costDifference >= 0) {
      setLocalAttributes((prev) => ({ ...prev, [attribute]: newLevel }));
      setRemainingPoints((prev) => prev - costDifference);
      onSave({ ...localAttributes, [attribute]: newLevel }, remainingPoints - costDifference); // Save immediately
    }
  };

  // Ensure attributes stay up to date when they change in the parent
  useEffect(() => {
    setLocalAttributes(attributes); // Update local state whenever attributes prop changes
  }, [attributes]);

  return (
    <div className="level-selector">
      <div className="stat-container">
        {Object.keys(localAttributes).map((attribute) => (
          <div key={attribute} className="stat">
            <button
              className="arrow left"
              onClick={() => handleLevelChange(attribute as keyof typeof localAttributes, "decrease")}
            >
              &#8592;
            </button>
            <div className="stat-info">
              <h2>{attribute}</h2>
              <p>{localAttributes[attribute as keyof typeof localAttributes]}</p>
            </div>
            <button
              className="arrow right"
              onClick={() => handleLevelChange(attribute as keyof typeof localAttributes, "increase")}
            >
              &#8594;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeSelector;
