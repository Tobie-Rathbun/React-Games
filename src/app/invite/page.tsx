"use client";
import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import SpinCard from "@components/SpinCard";
export const dynamic = 'force-dynamic';

// Scale of card
const relWidth = 3.5;
const relHeight = 0.05;
const relDepth = 2.5;
const relModifier = 0.66;


const Invite: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<BABYLON.Scene | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new BABYLON.Engine(canvasRef.current, true);
    const sceneInstance = new BABYLON.Scene(engine);
    sceneInstance.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 3,
      5,
      BABYLON.Vector3.Zero(),
      sceneInstance
    );
    
    // Attach the camera to the canvas
    camera.attachControl(canvasRef.current, true);
    
    // Disable all user interactions
    camera.inputs.clear(); // Clear all inputs to disable user interactions
    

    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), sceneInstance);

    setScene(sceneInstance);

    engine.runRenderLoop(() => {
      sceneInstance.render();
    });

    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: "100vw", height: "100vh", display: "block" }}
      />
      {scene && (
        <SpinCard
          scene={scene}
          card="AH"
          scale={{ width: relWidth, height: relHeight, depth: relDepth, modifier: relModifier }}
        />
      )}
    </div>
  );
};

export default Invite;
