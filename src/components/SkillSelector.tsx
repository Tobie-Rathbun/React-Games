"use client";

import React, { useState } from "react";

interface SkillSelectorProps {
  initialPoints: number;
  onSave: (skills: Record<string, string>, remainingPoints: number) => void;
}

const skills = {
  Alchemy: [
    { label: "Potion Specialist", points: 5, iqRequired: 8 },
    { label: "Potion Maker", points: 15, iqRequired: 12 },
    { label: "Alchemist", points: 50, iqRequired: 16 },
  ],
  AnimalHandling: [
    { label: "Animal Friend", points: 15, iqRequired: 6 },
    { label: "Animal Trainer", points: 40, iqRequired: 10 },
    { label: "Animal Master", points: 75, iqRequired: 14 },
  ],
  // Add more skills here...
};

const SkillSelector: React.FC<SkillSelectorProps> = ({ initialPoints, onSave }) => {
  const [skillsData, setSkillsData] = useState<Record<string, string>>({});
  const [remainingPoints, setRemainingPoints] = useState<number>(initialPoints);

  // Handle the skill selection
  const handleSkillSelection = (skillCategory: string, skillLabel: string, points: number) => {
    let updatedSkills;
    let updatedPoints = remainingPoints;

    if (skillsData[skillCategory] === skillLabel) {
      // Deselect if the same skill is selected again
      updatedSkills = { ...skillsData, [skillCategory]: "" };
      updatedPoints = updatedPoints + points; // Add points back
    } else {
      // Select the new skill
      updatedSkills = { ...skillsData, [skillCategory]: skillLabel };
      updatedPoints = updatedPoints - points; // Subtract points
    }

    setSkillsData(updatedSkills);
    onSave(updatedSkills, updatedPoints); // Save the selected skill data and points
  };

  return (
    <div className="skill-selector">
      <h2>Select Skills</h2>
      {Object.entries(skills).map(([category, skillOptions]) => (
        <div key={category} className="skill-category">
          <h3>{category}</h3>
          <ul>
            {skillOptions.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSkillSelection(category, option.label, option.points)}
                  className={skillsData[category] === option.label ? "selected" : ""}
                >
                  {`${option.label} (${option.points} pts, IQ >= ${option.iqRequired})`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SkillSelector;
