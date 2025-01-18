"use client";

import React, { useState, useCallback } from "react";
import StatSelector from "@components/StatSelector";
import NameSelector from "@components/NameSelector";
import HeightSelector from "@components/HeightSelector";
import TraitSelector from "@/components/TraitSelector";
import AttributeSelector from "@/components/AttributeSelector";
import StatusSelector from "@/components/StatusSelector";
import DisadvantageSelector from "@/components/DisadvantageSelector";
import SkillSelector from "@/components/SkillSelector";

interface CharacterData {
  name: string;
  stats: { ST: number; DX: number; IQ: number; HT: number }; // Stats added
  height: string;
  weight: string;
  characterPoints: number;
  fatType: string | null;
  traits: Record<string, string>;
  attributes: Record<string, number>;
  statuses: Record<string, number>;
  disadvantages: string[];
  skills: Record<string, string>;
}

const StatPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: "",
    stats: { ST: 10, DX: 10, IQ: 10, HT: 10 }, // Initialize stats
    height: "",
    weight: "",
    characterPoints: 100,
    fatType: null,
    traits: {},
    attributes: {
      Alertness: 0,
      Charisma: 0,
      Climbing: 0,
      Navigation: 0,
      Willpower: 0,
    },
    statuses: {
      MilitaryStatus: 0,
      SocialStatus: 0,
      Wealth: 0,
    },
    disadvantages: [],
    skills: {},
  });

  const handleStatSave = useCallback(
    (stats: { ST: number; DX: number; IQ: number; HT: number }, remainingPoints: number) => {
      setCharacterData((prev) => ({ ...prev, stats, characterPoints: remainingPoints }));
    },
    []
  );

  const handleSkillSave = (skills: Record<string, string>, remainingPoints: number) => {
    setCharacterData((prev) => ({
      ...prev,
      skills,
      characterPoints: remainingPoints,
    }));
  };

  const handleAttributeSave = (attributes: Record<string, number>, remainingPoints: number) => {
    setCharacterData((prev) => ({
      ...prev,
      attributes,
      characterPoints: remainingPoints,
    }));
  };

  const handleStatusSave = (statuses: Record<string, number>, remainingPoints: number) => {
    setCharacterData((prev) => ({
      ...prev,
      statuses,
      characterPoints: remainingPoints,
    }));
  };

  const handleDisadvantageChange = (disadvantages: string[], remainingPoints: number) => {
    setCharacterData((prev) => ({
      ...prev,
      disadvantages,
      characterPoints: remainingPoints,
    }));
  };

  const handleHeightChange = (height: string, weight: string) => {
    setCharacterData((prev) => ({
      ...prev,
      height: height,
      weight: weight,
    }));
  };

  const handleFatOptionChange = (fatType: string | null, points: number) => {
    setCharacterData((prev) => ({
      ...prev,
      fatType: fatType,
      characterPoints: prev.characterPoints + points,
    }));
  };

  const steps = [
    {
      component: (
        <NameSelector
          name={characterData.name}
          onNameChange={(name) => setCharacterData((prev) => ({ ...prev, name }))}
          onEnterPress={() => handleNext()}
        />
      ),
      isValid: () => characterData.name.trim().length > 0,
    },
    {
      component: (
        <StatSelector
          initialPoints={characterData.characterPoints}
          levels={characterData.stats}
          onSave={handleStatSave}
        />
      ),
      isValid: () => true,
    },
    {
      component: (
        <HeightSelector
          ST={characterData.stats.ST}
          onHeightChange={handleHeightChange}
          onFatOptionChange={handleFatOptionChange}
          fatType={characterData.fatType}
          selectedHeight={characterData.height}
        />
      ),
      isValid: () => characterData.height.trim().length > 0 && characterData.fatType !== null,
    },
    {
      component: (
        <TraitSelector
          traits={characterData.traits}
          onTraitChange={(trait, option, points) =>
            setCharacterData((prev) => ({
              ...prev,
              traits: { ...prev.traits, [trait]: option || "" },
              characterPoints: prev.characterPoints + points,
            }))
          }
        />
      ),
      isValid: () => Object.keys(characterData.traits).length > 0,
    },
    {
      component: (
        <AttributeSelector
          attributes={characterData.attributes}
          initialPoints={characterData.characterPoints}
          onSave={handleAttributeSave}
        />
      ),
      isValid: () => Object.values(characterData.attributes).every((val) => val >= 0),
    },
    {
      component: (
        <StatusSelector
          statuses={characterData.statuses}
          initialPoints={characterData.characterPoints}
          onSave={handleStatusSave}
        />
      ),
      isValid: () => Object.values(characterData.statuses).every((val) => val >= 0),
    },
    {
      component: (
        <DisadvantageSelector
          disadvantages={characterData.disadvantages}
          onDisadvantageChange={handleDisadvantageChange}
          characterPoints={characterData.characterPoints}
        />
      ),
      isValid: () => characterData.disadvantages.length > 0,
    },
    {
      component: (
        <SkillSelector
          initialPoints={characterData.characterPoints}
          stats={characterData.stats} // Pass stats here
          onSave={handleSkillSave}
        />
      ),
      isValid: () => Object.keys(characterData.skills).length > 0,
    },
  ];

  const handleNext = async () => {
    if (!steps[currentStep].isValid()) {
      alert("Please complete all required fields before proceeding.");
      return;
    }

    if (currentStep === steps.length - 1) {
      // Submit to backend
      try {
        const response = await fetch("/api/characters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(characterData),
        });

        if (!response.ok) {
          throw new Error("Failed to save character");
        }

        alert("Character saved successfully!");
      } catch (error) {
        console.error(error);
        alert("An error occurred while saving the character.");
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="page-container">
      <h1>Character Creation</h1>
      <div className="step-container">{steps[currentStep].component}</div>
      {currentStep > 0 && (
        <h1
          className="points-text"
          style={{
            color: characterData.characterPoints === 0 ? "var(--accent-color)" : "var(--highlight-color)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Points to Spend: {characterData.characterPoints}
        </h1>
      )}
      <div className="button-container" style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        {currentStep > 0 && (
          <button onClick={handlePrevious} className="prev-button">
            Previous
          </button>
        )}
        <button onClick={handleNext} className="next-button">
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default StatPage;
