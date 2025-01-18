"use client";

import React from "react";

interface TraitSelectorProps {
  traits: Record<string, string>; // Current selected traits
  onTraitChange: (trait: string, option: string | null, points: number) => void; // Callback for trait changes
}

const traitOptions: Record<string, { label: string; points: number }[]> = {
  Handedness: [
    { label: "Left Hand", points: 0 },
    { label: "Right Hand", points: 0 },
    { label: "Left Hand, No Right Hand", points: 20 },
    { label: "Right Hand, No Left Hand", points: 20 },
    { label: "Ambidextrous", points: -10 },
  ],
  Voice: [
    { label: "Meek", points: -5 },
    { label: "Quiet", points: 0 },
    { label: "Responsive", points: 5 },
    { label: "Well-spoken", points: -10 },
  ],
  Hygiene: [
    { label: "Clean", points: -5 },
    { label: "Average", points: 0 },
    { label: "Smelly", points: 5 },
    { label: "Dirty", points: 10 },
    { label: "Disgusting", points: 15 },
  ],
  Literacy: [
    { label: "Illiterate", points: 5 },
    { label: "Semi-literate", points: -5 },
    { label: "Literate", points: -10 },
    { label: "Well-read", points: -20 },
  ],
  Resistance: [
    { label: "Poison", points: -5 },
    { label: "Disease", points: -5 },
  ],
};

const TraitSelector: React.FC<TraitSelectorProps> = ({ traits, onTraitChange }) => {
  const handleSelectTrait = (trait: string, option: { label: string; points: number }) => {
    if (traits[trait] === option.label) {
      // Deselect the currently selected option
      onTraitChange(trait, null, -option.points); // Reverse the points
    } else {
      // Update the selected option for the group
      const previousSelection = traits[trait];
      if (previousSelection) {
        const previousOption = traitOptions[trait].find(
          (opt) => opt.label === previousSelection
        );
        if (previousOption) {
          onTraitChange(trait, null, -previousOption.points); // Reverse points for the previous selection
        }
      }
      onTraitChange(trait, option.label, option.points); // Add points for the new selection
    }
  };

  return (
    <div className="trait-selector">
      <h2>Choose your traits</h2>
      {Object.entries(traitOptions).map(([trait, options]) => (
        <div key={trait} className="trait-group">
          <h3>{trait}</h3>
          <ul>
            {options.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSelectTrait(trait, option)}
                  className={traits[trait] === option.label ? "selected" : ""}
                >
                  {option.label} (
                    {option.points === 0
                      ? "0 pts" // No negative or positive sign for 0 points
                      : option.points < 0
                      ? `${Math.abs(option.points)} pts` 
                      : `-${Math.abs(option.points)} pts`} 
                  )
                </button>
              </li>
            ))}
          </ul>
          {traits[trait] && (
            <p className="trait-text">
              <strong>Selected {trait}:</strong> {traits[trait]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default TraitSelector;
