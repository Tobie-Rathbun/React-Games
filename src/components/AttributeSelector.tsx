"use client";

import React, { useState } from "react";

interface AttributeSelectorProps {
  initialPoints?: number;
  onSave: (attributes: Record<string, number>, remainingPoints: number) => void;
}

const initialAttributes = {
  Alertness: 0,
  Charisma: 0,
  Climbing: 0,
  Navigation: 0,
  Willpower: 0,
};

const AttributeSelector: React.FC<AttributeSelectorProps> = ({ initialPoints = 100, onSave }) => {
  const [attributes, setAttributes] = useState<Record<string, number>>(initialAttributes);
  const [remainingPoints, setRemainingPoints] = useState<number>(initialPoints);

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

  const calculateCost = (attribute: keyof typeof initialAttributes, level: number) => {
    return level * attributeCosts[attribute];
  };

  const handleLevelChange = (attribute: keyof typeof initialAttributes, direction: "increase" | "decrease") => {
    const currentLevel = attributes[attribute];
    const newLevel = direction === "increase" ? currentLevel + 1 : currentLevel - 1;

    const { min, max } = attributeRanges[attribute];
    if (newLevel < min || newLevel > max) return;

    const currentCost = calculateCost(attribute, currentLevel);
    const newCost = calculateCost(attribute, newLevel);
    const costDifference = newCost - currentCost;

    if (remainingPoints - costDifference >= 0) {
      setAttributes((prev) => ({ ...prev, [attribute]: newLevel }));
      setRemainingPoints((prev) => prev - costDifference);
      onSave({ ...attributes, [attribute]: newLevel }, remainingPoints - costDifference); // Save immediately
    }
  };

  return (
    <div className="level-selector">
      <div className="stat-container">
        {Object.keys(attributes).map((attribute) => (
          <div key={attribute} className="stat">
            <button
              className="arrow left"
              onClick={() => handleLevelChange(attribute as keyof typeof initialAttributes, "decrease")}
            >
              &#8592;
            </button>
            <div className="stat-info">
              <h2>{attribute}</h2>
              <p>{attributes[attribute]}</p>
            </div>
            <button
              className="arrow right"
              onClick={() => handleLevelChange(attribute as keyof typeof initialAttributes, "increase")}
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
