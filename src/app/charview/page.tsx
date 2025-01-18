"use client";

import React, { useState, useEffect } from "react";

// Type definition for character data
interface Character {
  id: string;
  name: string;
  stats: { ST: number; DX: number; IQ: number; HT: number };
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

const CharacterViewer: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  // Fetch all characters from the backend API
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/viewCharacters`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.characters) {
            setCharacters(data.characters);
          } else {
            console.error("No 'characters' field in the response:", data);
          }
        } else {
          console.error("Failed to fetch characters. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };
  
    fetchCharacters();
  }, []);
  

  // Fetch selected character details
  const fetchCharacterDetails = async (id: string) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/viewCharacters/${id}`; // Adjust to fetch specific character by ID
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();
        setSelectedCharacter(data.character); // Store selected character details in state
      } else {
        console.error("Failed to fetch character details. Status:", response.status);
        const errorText = await response.text();
        console.error("Error details:", errorText);
      }
    } catch (error) {
      console.error("Error fetching character details:", error);
    }
  };

  return (
    <div className="character-viewer">
      <h1>Character Viewer</h1>

      <div className="character-buttons">
        {characters.length > 0 ? (
          characters.map((character) => (
            <button
              key={character.id}
              onClick={() => fetchCharacterDetails(character.id)}
            >
              {character.name}
            </button>
          ))
        ) : (
          <p>Loading characters...</p>
        )}
      </div>

      {selectedCharacter && (
        <div className="character-details">
          <h2>{selectedCharacter.name}</h2>
          <p><strong>Height:</strong> {selectedCharacter.height}</p>
          <p><strong>Weight:</strong> {selectedCharacter.weight}</p>
          <p><strong>Character Points:</strong> {selectedCharacter.characterPoints}</p>
          <p><strong>Fat Type:</strong> {selectedCharacter.fatType || "N/A"}</p>

          <h3>Stats</h3>
          <p><strong>ST:</strong> {selectedCharacter.stats.ST}</p>
          <p><strong>DX:</strong> {selectedCharacter.stats.DX}</p>
          <p><strong>IQ:</strong> {selectedCharacter.stats.IQ}</p>
          <p><strong>HT:</strong> {selectedCharacter.stats.HT}</p>

          <h3>Traits</h3>
          <ul>
            {Object.entries(selectedCharacter.traits).map(([trait, value]) => (
              <li key={trait}>
                <strong>{trait}:</strong> {value}
              </li>
            ))}
          </ul>

          <h3>Attributes</h3>
          <ul>
            {Object.entries(selectedCharacter.attributes).map(([attribute, value]) => (
              <li key={attribute}>
                <strong>{attribute}:</strong> {value}
              </li>
            ))}
          </ul>

          <h3>Statuses</h3>
          <ul>
            {Object.entries(selectedCharacter.statuses).map(([status, value]) => (
              <li key={status}>
                <strong>{status}:</strong> {value}
              </li>
            ))}
          </ul>

          <h3>Disadvantages</h3>
          <ul>
            {selectedCharacter.disadvantages.map((disadvantage, index) => (
              <li key={index}>{disadvantage}</li>
            ))}
          </ul>

          <h3>Skills</h3>
          <ul>
            {Object.entries(selectedCharacter.skills).map(([skill, value]) => (
              <li key={skill}>
                <strong>{skill}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CharacterViewer;
