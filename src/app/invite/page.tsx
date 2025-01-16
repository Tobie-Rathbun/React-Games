"use client";
import React, { useState } from "react";
import SpinCard from "@components/SpinCard";
import TitleCard from "@components/TitleCard";
export const dynamic = "force-dynamic";

const Invite: React.FC = () => {
  const [relModifier] = useState(0.66);

  

  return (
    <div className="container">
      <div className="spinCard">
        <SpinCard card="AH" scale={{ modifier: relModifier }} />
      </div>
      <div className="titleCard">
        <TitleCard
          header="Poker Night"
          subheader="7 p.m. at Tobie's"
          bio={
            <>
              $10 buy-ins, additional chips available.
              <br />
              Rewards will be distributed at the end of the night.
              <br />
              Snacks and drinks will be provided.
            </>
          }
        />
      </div>
    </div>
  );
};

export default Invite;
