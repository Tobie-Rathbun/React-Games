"use client";
import React from "react";
import SpinCard from "@components/SpinCard";
export const dynamic = 'force-dynamic';

// Scale of card
const relModifier = 0.66;

const Invite: React.FC = () => {
  return (
    <div>
      <SpinCard card="AH" scale={{ modifier: relModifier }} />
    </div>
  );
};

export default Invite;
