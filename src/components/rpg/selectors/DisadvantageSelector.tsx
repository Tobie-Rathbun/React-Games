"use client";

import React from "react";

interface DisadvantageSelectorProps {
  disadvantages: string[]; // Array of selected disadvantages
  onDisadvantageChange: (disadvantages: string[], remainingPoints: number) => void; // Callback for updating disadvantages
  characterPoints: number; // Remaining points
}

const disadvantageOptions = [
  { label: "Greed", points: -20 },
  { label: "Gluttony", points: -10 },
  { label: "Honesty", points: -25 },
  { label: "Laziness", points: -10 },
  { label: "One Eyed", points: -15 },
  { label: "Overconfidence", points: -10 },
  { label: "Pyromania", points: -5 },
  { label: "Short Temper", points: -10 },
  { label: "Stubbornness", points: -5 },
];

const DisadvantageSelector: React.FC<DisadvantageSelectorProps> = ({
  disadvantages,
  onDisadvantageChange,
  characterPoints,
}) => {
  const handleDisadvantageSelection = (disadvantage: string, points: number) => {
    let updatedDisadvantages;
    let updatedPoints = characterPoints;

    if (disadvantages.includes(disadvantage)) {
      // Deselect if the same disadvantage is selected again
      updatedDisadvantages = disadvantages.filter((d) => d !== disadvantage);
      updatedPoints = updatedPoints + points; // Add points back
    } else {
      // Select the new disadvantage
      updatedDisadvantages = [...disadvantages, disadvantage];
      updatedPoints = updatedPoints - points; // Subtract points
    }

    onDisadvantageChange(updatedDisadvantages, updatedPoints); // Save the updated disadvantages and points
  };

  return (
    <div className="disadvantage-selector">
      <h2>Select Disadvantages</h2>
      <ul>
        {disadvantageOptions.map((option, index) => (
          <li key={index}>
            <button
              onClick={() => handleDisadvantageSelection(option.label, option.points)}
              className={disadvantages.includes(option.label) ? "selected" : ""}
            >
              {option.label} ({option.points} pts)
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisadvantageSelector;
