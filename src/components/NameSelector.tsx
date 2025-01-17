"use client";

import React from "react";

interface NameSelectorProps {
  name: string;
  onNameChange: (name: string) => void;
  onEnterPress?: () => void; // Make the prop optional
}

const NameSelector: React.FC<NameSelectorProps> = ({ name, onNameChange, onEnterPress }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnterPress) {
      onEnterPress();
    }
  };

  return (
    <div className="name-step">
      <label htmlFor="character-name">Enter your character's name:</label>
      <input
        type="text"
        id="character-name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={handleKeyDown} // Listen for the Enter key
        placeholder="Character Name"
      />
    </div>
  );
};

export default NameSelector;
