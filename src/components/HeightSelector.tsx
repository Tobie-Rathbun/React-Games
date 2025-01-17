"use client";

import React, { useState } from "react";

interface HeightSelectorProps {
  ST: number; // Strength value from the selected stats
  onHeightChange: (height: string, weight: string) => void;
  onFatOptionChange: (fatType: string | null, points: number) => void; // Callback to update fat type and points
  fatType: string | null; // Track selected fat type
}

const heightWeightMap = [
  { ST: 5, height: "5’2” or less", weight: "120 lbs." },
  { ST: 5, height: "5’3”", weight: "130 lbs." },
  { ST: 6, height: "5’4”", weight: "130 lbs." },
  { ST: 7, height: "5’5”", weight: "135 lbs." },
  { ST: 8, height: "5’6”", weight: "135 lbs." },
  { ST: 9, height: "5’7”", weight: "140 lbs." },
  { ST: 10, height: "5’8”", weight: "145 lbs." },
  { ST: 11, height: "5’9”", weight: "150 lbs." },
  { ST: 12, height: "5’10”", weight: "155 lbs." },
  { ST: 13, height: "5’11”", weight: "160 lbs." },
  { ST: 14, height: "6’", weight: "165 lbs." },
  { ST: 15, height: "6’1”", weight: "170 lbs." },
  { ST: 16, height: "6’2”", weight: "180 lbs." },
  { ST: 17, height: "6’3” or more", weight: "190 lbs." },
];

const fatOptions = [
  { label: "Overweight (-5 points)", points: -5 },
  { label: "Fat (-10 points)", points: -10 },
  { label: "Extremely Fat (-20 points)", points: -20 },
];

const HeightSelector: React.FC<HeightSelectorProps> = ({
  ST,
  onHeightChange,
  onFatOptionChange,
  fatType,
}) => {
  const [selectedHeight, setSelectedHeight] = useState<string | null>(null);
  const [calculatedWeight, setCalculatedWeight] = useState<string | null>(null);

  // Filter available heights based on ST
  const availableOptions = heightWeightMap.filter((entry) => entry.ST <= ST);

  const handleSelectHeight = (height: string, weight: string) => {
    setSelectedHeight(height);
    setCalculatedWeight(weight);
    onHeightChange(height, weight);
  };

  const handleSelectFat = (fatLabel: string, points: number) => {
    const absolutePoints = Math.abs(points); // Convert points to absolute value
    if (fatType === fatLabel) {
      // Deselect if the same fat type is selected again (reverse the operation)
      onFatOptionChange(null, -absolutePoints); // Subtract the previously added points
    } else {
      // Select a new fat type, add the absolute points
      onFatOptionChange(fatLabel, absolutePoints); // Add points for the new fat type
    }
  };

  return (
    <div className="height-selector">
      <h2>Choose your height</h2>
      <ul>
        {availableOptions.map((option, index) => (
          <li key={index}>
            <button
              onClick={() => handleSelectHeight(option.height, option.weight)}
              className={selectedHeight === option.height ? "selected" : ""}
            >
              {option.height}
            </button>
          </li>
        ))}
      </ul>
      {selectedHeight && (
        <div>
          <p>
            <strong>Selected Height:</strong> {selectedHeight}
          </p>
          <p>
            <strong>Calculated Weight:</strong> {calculatedWeight}
          </p>
        </div>
      )}

      <h2>Choose your body type</h2>
      <ul>
        {fatOptions.map((option, index) => (
          <li key={index}>
            <button
              onClick={() => handleSelectFat(option.label, option.points)}
              className={fatType === option.label ? "selected" : ""}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeightSelector;
