"use client";

import React, { useState, useEffect, useCallback } from "react";

interface HeightSelectorProps {
  ST: number; // Strength value from the selected stats
  onHeightChange: (height: string, weight: string) => void;
  onFatOptionChange: (fatType: string | null, points: number) => void; // Callback to update fat type and points
  fatType: string | null; // Track selected fat type
}

const heightWeightMap = [
  { ST: 5, height: "5’2” or less", weight: 120 },
  { ST: 5, height: "5’3”", weight: 130 },
  { ST: 6, height: "5’4”", weight: 130 },
  { ST: 7, height: "5’5”", weight: 135 },
  { ST: 8, height: "5’6”", weight: 135 },
  { ST: 9, height: "5’7”", weight: 140 },
  { ST: 10, height: "5’8”", weight: 145 },
  { ST: 11, height: "5’9”", weight: 150 },
  { ST: 12, height: "5’10”", weight: 155 },
  { ST: 13, height: "5’11”", weight: 160 },
  { ST: 14, height: "6’", weight: 165 },
  { ST: 15, height: "6’1”", weight: 170 },
  { ST: 16, height: "6’2”", weight: 180 },
  { ST: 17, height: "6’3” or more", weight: 190 },
];

const fatOptions = [
  { label: "Skinny (5 points)", points: -5, weightModifier: 0.9 }, // 10% reduction
  { label: "Average (0 points)", points: 0, weightModifier: 1 }, // No change
  { label: "Overweight (-5 points)", points: 5, weightModifier: 1.1 }, // 10% increase
  { label: "Fat (-10 points)", points: 10, weightModifier: 1.2 }, // 20% increase
  { label: "Extremely Fat (-20 points)", points: 20, weightModifier: 1.5 }, // 50% increase
];

const HeightSelector: React.FC<HeightSelectorProps> = ({
  ST,
  onHeightChange,
  onFatOptionChange,
  fatType,
}) => {
  const [selectedHeight, setSelectedHeight] = useState<string | null>(null);
  const [baseWeight, setBaseWeight] = useState<number | null>(null);
  const [calculatedWeight, setCalculatedWeight] = useState<string | null>(null);

  // Track the previous fat type for point reversal
  const [previousFatType, setPreviousFatType] = useState<string | null>(null);

  // Filter available heights based on ST
  const availableOptions = heightWeightMap.filter((entry) => entry.ST <= ST);

  const handleSelectHeight = useCallback((height: string, weight: number) => {
    setSelectedHeight(height);
    setBaseWeight(weight); // Store base weight
    setCalculatedWeight(`${weight} lbs.`); // Default calculated weight
    onHeightChange(height, `${weight} lbs.`); // Pass base weight to parent
  }, [onHeightChange]);

  const handleSelectFat = (fatLabel: string, points: number) => {
    if (fatType === fatLabel) {
      // Deselect if the same fat type is selected again
      const previousPoints = fatOptions.find((option) => option.label === previousFatType)?.points || 0;
      onFatOptionChange(null, -previousPoints); // Reverse the points for the previous fat type
      setPreviousFatType(null); // Reset previous fat type
    } else {
      // Reverse the points for the previous fat type first
      if (previousFatType) {
        const previousPoints = fatOptions.find((option) => option.label === previousFatType)?.points || 0;
        onFatOptionChange(null, -previousPoints); // Reverse the points for the previous selection
      }
      // Select a new fat type and apply its points
      onFatOptionChange(fatLabel, points);
      setPreviousFatType(fatLabel); // Store the new fat type
    }
  };

  useEffect(() => {
    if (baseWeight !== null) {
      const selectedFatOption = fatOptions.find((option) => option.label === fatType);
      const weightModifier = selectedFatOption ? selectedFatOption.weightModifier : 1;
      const newWeight = Math.round(baseWeight * weightModifier);
      const newWeightString = `${newWeight} lbs.`;
      setCalculatedWeight(newWeightString);

      // Only call onHeightChange if the height and weight are valid
      if (selectedHeight && newWeightString !== calculatedWeight) {
        onHeightChange(selectedHeight, newWeightString);
      }
    }
  }, [baseWeight, fatType, selectedHeight]); // Recalculate weight based on fat type

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
            <strong>Calculated Weight:</strong>{" "}
            {calculatedWeight !== null ? calculatedWeight : "—"}
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
