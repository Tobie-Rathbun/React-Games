"use client";
import React, { useState } from "react";
import SpinCard from "@components/SpinCard";
import TitleCard from "@components/TitleCard";
import RSVPButton from "@/components/RSVPButton";
import RSVPList from "@/components/RSVPList";
export const dynamic = "force-dynamic";

const Invite: React.FC = () => {
  const [relModifier] = useState(0.75);
  const [rsvpList, setRsvpList] = useState<string[]>([]); // Shared state for RSVP list

  return (
    <div className="container">
      <div className="spinCard">
        <SpinCard card="AH" scale={{ modifier: relModifier }} />
      </div>
      <div className="titleCard">
        <TitleCard
          header="Poker Night"
          subheader="7 p.m. on Friday at Tobie's"
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
      <div className="RSVPButton">
        {/* Pass shared state as props */}
        <RSVPButton rsvpList={rsvpList} setRsvpList={setRsvpList} />
      </div>
      <div className="RSVPList">
        {/* Pass shared state as props */}
        <RSVPList rsvpList={rsvpList} />
      </div>
    </div>
  );
};

export default Invite;
