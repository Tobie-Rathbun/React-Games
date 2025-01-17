"use client";

import React, { useState } from "react";

interface HeightSelectorProps {
  ST: number; // Strength value from the selected stats
  onHeightChange: (height: string, weight: string) => void;
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

const HeightSelector: React.FC<HeightSelectorProps> = ({ ST, onHeightChange }) => {
  const [selectedHeight, setSelectedHeight] = useState<string | null>(null);
  const [calculatedWeight, setCalculatedWeight] = useState<string | null>(null);

  // Filter available heights based on ST
  const availableOptions = heightWeightMap.filter((entry) => entry.ST <= ST);

  const handleSelect = (height: string, weight: string) => {
    setSelectedHeight(height);
    setCalculatedWeight(weight);
    onHeightChange(height, weight);
  };

  return (
    <div className="height-selector">
      <h2>Choose your height</h2>
      <ul>
        {availableOptions.map((option, index) => (
          <li key={index}>
            <button
              onClick={() => handleSelect(option.height, option.weight)}
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
    </div>
  );
};

export default HeightSelector;
