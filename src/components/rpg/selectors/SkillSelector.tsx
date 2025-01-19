"use client";

import React, { useState } from "react";

// Define the types for the skills data
interface Skill {
  label: string;
  points: number;
  iqRequired: number;
  stRequired: number;
  dxRequired: number;
  htRequired: number;
}

interface SkillCategory {
  [key: string]: Skill[]; // This allows us to index into `skills` by category name, e.g., 'Alchemy'
}

interface SkillSelectorProps {
  initialPoints: number;
  onSave: (skills: Record<string, string>, remainingPoints: number) => void;
  stats: { ST: number; DX: number; IQ: number; HT: number }; // Passing stats to the component
}

// Define the skills object with proper typing
const skills: SkillCategory = {
  Alchemy: [
    { label: "Potion Specialist", points: 5, iqRequired: 8, stRequired: 0, dxRequired: 0, htRequired: 0 },
    { label: "Potion Maker", points: 15, iqRequired: 12, stRequired: 0, dxRequired: 0, htRequired: 0 },
    { label: "Alchemist", points: 50, iqRequired: 16, stRequired: 0, dxRequired: 0, htRequired: 0 },
  ],
  AnimalHandling: [
    { label: "Animal Friend", points: 15, iqRequired: 6, stRequired: 0, dxRequired: 0, htRequired: 0 },
    { label: "Animal Trainer", points: 40, iqRequired: 10, stRequired: 0, dxRequired: 0, htRequired: 0 },
    { label: "Animal Master", points: 75, iqRequired: 14, stRequired: 0, dxRequired: 0, htRequired: 0 },
  ],
  // Add more skills here...
};

const SkillSelector: React.FC<SkillSelectorProps> = ({ initialPoints, onSave, stats }) => {
  const [skillsData, setSkillsData] = useState<Record<string, string>>({});
  const [remainingPoints, setRemainingPoints] = useState<number>(initialPoints);

  // Handle the skill selection
  const handleSkillSelection = (skillCategory: string, skillLabel: string, points: number) => {
    let updatedSkills;
    let updatedPoints = remainingPoints;

    console.log(`Handling skill selection for: ${skillLabel}`);
    console.log(`Current selected skill for ${skillCategory}: ${skillsData[skillCategory]}`);
    
    if (skillsData[skillCategory] === skillLabel) {
      // Deselect if the same skill is selected again
      updatedSkills = { ...skillsData, [skillCategory]: "" };
      updatedPoints = updatedPoints + points; // Add points back

      console.log(`Deselecting skill: ${skillLabel}`);
      console.log(`Adding points back: +${points}`);
      console.log(`New remaining points: ${updatedPoints}`);
    } else {
      // Deselect the previous skill first and revert its points
      if (skillsData[skillCategory]) {
        const previousSkill = skills[skillCategory].find(skill => skill.label === skillsData[skillCategory]);
        if (previousSkill) {
          updatedPoints += previousSkill.points; // Add the points back of the previously selected skill
          console.log(`Deselecting previous skill: ${skillsData[skillCategory]}`);
          console.log(`Adding points back: +${previousSkill.points}`);
        }
      }

      // Select the new skill and subtract its points
      updatedSkills = { ...skillsData, [skillCategory]: skillLabel };
      updatedPoints = updatedPoints - points; // Subtract points
      console.log(`Selecting new skill: ${skillLabel}`);
      console.log(`Subtracting points: -${points}`);
      console.log(`New remaining points: ${updatedPoints}`);
    }

    // Update the state with the new skills and remaining points
    setSkillsData(updatedSkills);
    setRemainingPoints(updatedPoints); // Update remaining points after selection

    // Save the updated data
    onSave(updatedSkills, updatedPoints); // Save the skills and points
    console.log(`Updated skills data: ${JSON.stringify(updatedSkills)}`);
    console.log(`Remaining points after update: ${updatedPoints}`);
  };

  // Function to check if the skill can be selected based on stat requirements
  const checkStatRequirement = (
    iqRequired: number,
    stRequired: number,
    dxRequired: number,
    htRequired: number
  ) => {
    return (
      stats.IQ >= iqRequired &&
      stats.ST >= stRequired &&
      stats.DX >= dxRequired &&
      stats.HT >= htRequired
    );
  };

  // Function to format the stat labels dynamically (hide 0)
  const formatStatLabel = (label: string, value: number) => {
    return value > 0 ? `${label} >= ${value}` : "";
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
                {/* Check if the stats meet the requirements */}
                {checkStatRequirement(
                  option.iqRequired,
                  option.stRequired,
                  option.dxRequired,
                  option.htRequired
                ) ? (
                  <button
                    onClick={() => handleSkillSelection(category, option.label, option.points)}
                    className={skillsData[category] === option.label ? "selected" : ""}
                  >
                    {`${option.label} (${option.points} pts, IQ >= ${option.iqRequired} ${
                      formatStatLabel("ST", option.stRequired) && `, ${formatStatLabel("ST", option.stRequired)}`
                    }${
                      formatStatLabel("DX", option.dxRequired) && `, ${formatStatLabel("DX", option.dxRequired)}`
                    }${
                      formatStatLabel("HT", option.htRequired) && `, ${formatStatLabel("HT", option.htRequired)}`
                    })`}
                  </button>
                ) : (
                  <button
                    disabled
                    className="disabled"
                  >
                    {`${option.label} (Requires stats: IQ >= ${option.iqRequired}${
                      formatStatLabel("ST", option.stRequired) && `, ${formatStatLabel("ST", option.stRequired)}`
                    }${
                      formatStatLabel("DX", option.dxRequired) && `, ${formatStatLabel("DX", option.dxRequired)}`
                    }${
                      formatStatLabel("HT", option.htRequired) && `, ${formatStatLabel("HT", option.htRequired)}`
                    })`}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SkillSelector;
