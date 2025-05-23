"use client";
import React, { useState } from "react";
import RSVPButton from "@/components/rsvp/RSVPButton";
import RSVPList from "@/components/rsvp/RSVPList";
import RSVPClear from "@/components/rsvp/RSVPClear";

const TestRSVP = () => {
  const [rsvpList, setRsvpList] = useState<string[]>([]); // Shared state for the RSVP list

  return (
    <>
      <div>
        {/* Pass shared state to RSVPButton */}
        <RSVPButton rsvpList={rsvpList} setRsvpList={setRsvpList} />
      </div>
      <div>
        {/* Pass shared state to RSVPList */}
        <RSVPList rsvpList={rsvpList} />
      </div>
      <div>
        {/* Pass shared state to RSVPClear */}
        <RSVPClear setRsvpList={setRsvpList} />
      </div>
    </>
  );
};

export default TestRSVP;
