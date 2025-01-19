"use client";

import React from "react";
import "./styles.css";

interface TitleCardProps {
  header: string;
  subheader: string;
  bio: React.ReactNode;
}

const TitleCard: React.FC<TitleCardProps> = ({ header, subheader, bio }) => {
  return (
    <div className='cardContainer'>
      <h1 className='header'>{header}</h1>
      <h2 className='subheader'>{subheader}</h2>
      <p className='bio'>{bio}</p>
    </div>
  );
};

export default TitleCard;
