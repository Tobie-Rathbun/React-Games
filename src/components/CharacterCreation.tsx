"use client";

import React, { useState } from "react";
import NameStep from "@/components/NameSelector";
import StatSelector from "@components/StatSelector";

const CharacterCreation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [characterData, setCharacterData] = useState({
    name: "",
    stats: { ST: 10, DX: 10, IQ: 10, HT: 10 },
  });

  const steps = [
    {
      component: (
        <NameStep
          name={characterData.name}
          onNameChange={(name) =>
            setCharacterData((prev) => ({ ...prev, name }))
          }
        />
      ),
      isValid: () => characterData.name.trim().length > 0,
    },
    {
      component: (
        <StatSelector
          initialPoints={100}
          onSave={(stats) =>
            setCharacterData((prev) => ({ ...prev, stats }))
          }
        />
      ),
      isValid: () => true, // Validation logic for stats can be added here
    },
  ];

  const handleNext = async () => {
    if (!steps[currentStep].isValid()) {
      alert("Please fill out all required fields.");
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

  return (
    <div className="character-creation-container">
      <h1>Character Creation</h1>
      {steps[currentStep].component}
      <button onClick={handleNext}>
        {currentStep === steps.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
};

export default CharacterCreation;
