"use client";

import React, { useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

const validCards = [
  "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "0H", "JH", "QH", "KH", "AH",
  "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "0D", "JD", "QD", "KD", "ADi",
  "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "0C", "JC", "QC", "KC", "AC",
  "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "0S", "JS", "QS", "KS", "AS",
];


// Rotation of card
const relRotX = Math.PI / 32;
const relRotY = Math.PI / 2;
const relRotZ = Math.PI / 3.7;

// Position of card
const relPosX = -2;
const relPosY = 0.45;
const relPosZ = 0;

// Textures
const getCardImage = (card: string): string => `/images/${card}.png`;

const preloadTextures = (scene: BABYLON.Scene) => {
  validCards.forEach((card) => {
    const texturePath = getCardImage(card);
    new BABYLON.Texture(texturePath, scene); // Load and cache the texture
  });
};

const changeCardTexture = (mesh: BABYLON.Mesh, scene: BABYLON.Scene) => {
  const newCard = validCards[Math.floor(Math.random() * validCards.length)];
  const newTexturePath = getCardImage(newCard);

  const newMaterial = new BABYLON.StandardMaterial(`material_${newCard}`, scene);
  newMaterial.diffuseTexture = new BABYLON.Texture(newTexturePath, scene);
  newMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

  // Dispose the old material
  if (mesh.material) {
    mesh.material.dispose();
  }

  // Assign the new material to the card mesh
  mesh.material = newMaterial;

  console.log(`Changed card to ${newCard}`);
};

// Animations
const addRotationAnimation = (
  mesh: BABYLON.Mesh,
  scene: BABYLON.Scene,
  isAnimating: React.MutableRefObject<boolean>,
  setNewCardTexture: () => void
): void => {
  if (isAnimating.current) return;

  isAnimating.current = true;

  const animation = new BABYLON.Animation(
    "hoverRotation",
    "rotation.y",
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  // Define keyframes for 360-degree rotation
  const keys = [
    { frame: 0, value: mesh.rotation.y }, // Current rotation
    { frame: 60, value: mesh.rotation.y + Math.PI * 2 }, // Full rotation
  ];

  // Add easing with Bezier curve
  const easingFunction = new BABYLON.BezierCurveEase(0.42, 0, 0.58, 1);
  animation.setEasingFunction(easingFunction);

  animation.setKeys(keys);
  mesh.animations = [animation];

  // Delay texture change by 1.5 seconds
  setTimeout(() => {
    setNewCardTexture();
  }, 500);

  // Start the animation
  const animatable = scene.beginAnimation(mesh, 0, 60, false);
  animatable.onAnimationEnd = () => {
    isAnimating.current = false; // Reset flag when animation ends
  };
};

const addFloatingAnimation = (mesh: BABYLON.Mesh, scene: BABYLON.Scene) => {
  const animation = new BABYLON.Animation(
    "floatingAnimation",
    "position.y",
    60, // Frames per second
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE // Loop animation
  );

  // Define keyframes for smooth up and down motion
  const keys = [
    { frame: 0, value: mesh.position.y },         // Start at current position
    { frame: 30, value: mesh.position.y + 0.2 }, // Move up
    { frame: 60, value: mesh.position.y },        // Return to start
  ];

  animation.setKeys(keys);

  // Add easing for smooth transition
  const easingFunction = new BABYLON.SineEase();
  easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
  animation.setEasingFunction(easingFunction);

  // Attach animation to the mesh
  mesh.animations.push(animation);

  // Start the animation and loop it infinitely
  scene.beginAnimation(mesh, 0, 60, true);
};

const addHoverInteraction = (
  mesh: BABYLON.Mesh,
  scene: BABYLON.Scene,
  isAnimating: React.MutableRefObject<boolean>,
  setNewCardTexture: () => void
) => {
  mesh.actionManager = new BABYLON.ActionManager(scene);

  mesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      () => {
        if (isAnimating.current) return; // Prevent double triggering
        isAnimating.current = true;

        // Add rotation animation
        const rotationAnimation = new BABYLON.Animation(
          "hoverRotation",
          "rotation.y",
          60, // Frames per second
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        // Keyframes for full rotation
        const keys = [
          { frame: 0, value: mesh.rotation.y },
          { frame: 60, value: mesh.rotation.y + Math.PI * 2 },
        ];
        rotationAnimation.setKeys(keys);

        const easingFunction = new BABYLON.SineEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        rotationAnimation.setEasingFunction(easingFunction);

        mesh.animations.push(rotationAnimation);

        const animatable = scene.beginAnimation(mesh, 0, 60, false);

        // Change texture halfway through the animation
        setTimeout(() => {
          setNewCardTexture();
        }, 500);

        animatable.onAnimationEnd = () => {
          isAnimating.current = false; // Reset animation state
        };
      }
    )
  );
};

const SpinCard = ({
    scene,
    card,
    scale: { width, height, depth, modifier },
  }: {
    scene: BABYLON.Scene;
    card: string;
    scale: { width: number; height: number; depth: number; modifier: number };
  }) => {
    const cardMeshRef = useRef<BABYLON.Mesh | null>(null);
    const isAnimating = useRef(false);
  
    useEffect(() => {
      if (!scene) return;
  
      const texturePath = getCardImage(card);
  
      const faceUV = [
        new BABYLON.Vector4(1 / 114, 0, 0 / 114, 1), // Side
        new BABYLON.Vector4(2 / 114, 0, 1 / 114, 1), // Side
        new BABYLON.Vector4(3 / 114, 0, 2 / 114, 1), // Side
        new BABYLON.Vector4(4 / 114, 0, 3 / 114, 1), // Side
        new BABYLON.Vector4(59 / 114, 0, 1, 1),      // Face (Front)
        new BABYLON.Vector4(59 / 114, 0, 4 / 114, 1), // Back
      ];
  
      const cardMaterial = new BABYLON.StandardMaterial(`material_${card}`, scene);
      cardMaterial.diffuseTexture = new BABYLON.Texture(texturePath, scene);
      cardMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
  
      const cardMesh = BABYLON.MeshBuilder.CreateBox(
        card,
        {
          width: width * modifier,
          height: height * modifier,
          depth: depth * modifier,
          faceUV: faceUV,
        },
        scene
      );
  
      cardMesh.material = cardMaterial;
      cardMesh.position = new BABYLON.Vector3(relPosX, relPosY, relPosZ);
      cardMesh.rotation = new BABYLON.Vector3(relRotX, relRotY, relRotZ);
  
      cardMeshRef.current = cardMesh;
  
      addFloatingAnimation(cardMesh, scene);
      addHoverInteraction(cardMesh, scene, isAnimating, () =>
        changeCardTexture(cardMesh, scene)
      );
  
      return () => {
        cardMesh.dispose();
      };
    }, [scene, card]);
  
    return null;
  };
  
  export default SpinCard;