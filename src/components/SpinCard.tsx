"use client";

import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

const validCards = [
  "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "0H", "JH", "QH", "KH", "AH",
  "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "0D", "JD", "QD", "KD", "ADi",
  "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "0C", "JC", "QC", "KC", "AC",
  "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "0S", "JS", "QS", "KS", "AS",
];

// Rotation and Position of the card
const relRotX = Math.PI / 32;
const relRotY = Math.PI / 2;
const relRotZ = Math.PI / 3.7;

const relPosX = -2;
const relPosY = 0.45;
const relPosZ = 0;

const relWidth = 3.5;
const relHeight = 0.05;
const relDepth = 2.5;

// Helper functions
const getCardImage = (card: string): string => `/images/${card}.png`;

const preloadTextures = (scene: BABYLON.Scene) => {
  validCards.forEach((card) => {
    const texturePath = getCardImage(card);
    new BABYLON.Texture(texturePath, scene); // Preload and cache textures
  });
};

const changeCardTexture = (mesh: BABYLON.Mesh, scene: BABYLON.Scene) => {
  const newCard = validCards[Math.floor(Math.random() * validCards.length)];
  const newTexturePath = getCardImage(newCard);

  const newMaterial = new BABYLON.StandardMaterial(`material_${newCard}`, scene);
  newMaterial.diffuseTexture = new BABYLON.Texture(newTexturePath, scene);
  newMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

  if (mesh.material) {
    mesh.material.dispose();
  }
  mesh.material = newMaterial;

  console.log(`Changed card to ${newCard}`);
};


// Animations
const addFloatingAnimation = (mesh: BABYLON.Mesh, scene: BABYLON.Scene): void => {
  scene.stopAnimation(mesh, "floatingAnimation");

  const animation = new BABYLON.Animation(
    "floatingAnimation",
    "position.y",
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const keys = [
    { frame: 0, value: mesh.position.y },
    { frame: 30, value: mesh.position.y + 0.2 },
    { frame: 60, value: mesh.position.y },
  ];

  animation.setKeys(keys);

  const easingFunction = new BABYLON.SineEase();
  easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
  animation.setEasingFunction(easingFunction);

  mesh.animations = [];
  mesh.animations.push(animation);
  scene.beginAnimation(mesh, 0, 60, true);
};


// Interactions
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
        if (isAnimating.current) return;
        isAnimating.current = true;

        scene.stopAnimation(mesh, "floatingAnimation");

        const rotationAnimation = new BABYLON.Animation(
          "hoverRotation",
          "rotation.y",
          60,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

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

        setTimeout(() => {
          setNewCardTexture();
        }, 500);

        animatable.onAnimationEnd = () => {
          isAnimating.current = false;
          addFloatingAnimation(mesh, scene);
        };
      }
    )
  );
};

const addClickInteraction = (
  mesh: BABYLON.Mesh,
  scene: BABYLON.Scene,
  isAnimating: React.MutableRefObject<boolean>,
  setNewCardTexture: () => void
) => {
  if (!mesh.actionManager) {
    mesh.actionManager = new BABYLON.ActionManager(scene);
  }

  mesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPickTrigger,
      () => {
        if (isAnimating.current) return; // Prevent multiple triggers
        isAnimating.current = true;

        // Perform the spin animation
        const spinAnimation = new BABYLON.Animation(
          "clickSpin",
          "rotation.y",
          60,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const keys = [
          { frame: 0, value: mesh.rotation.y },
          { frame: 60, value: mesh.rotation.y + Math.PI * 2 },
        ];
        spinAnimation.setKeys(keys);

        const easingFunction = new BABYLON.SineEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        spinAnimation.setEasingFunction(easingFunction);

        mesh.animations.push(spinAnimation);
        const animatable = scene.beginAnimation(mesh, 0, 60, false);

        // Change card texture midway through the spin
        setTimeout(() => {
          setNewCardTexture();
        }, 500); // Adjust the timing if needed

        animatable.onAnimationEnd = () => {
          isAnimating.current = false;
        };
      }
    )
  );
};



const SpinCard = ({
  card,
  scale: { modifier },
}: {
  card: string;
  scale: { modifier: number };
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardMeshRef = useRef<BABYLON.Mesh | null>(null);
  const isAnimating = useRef(false);
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
      6,
      BABYLON.Vector3.Zero(),
      sceneInstance
    );
    camera.attachControl(canvasRef.current, true, false);
    camera.inputs.clear();

    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), sceneInstance);

    setScene(sceneInstance);

    engine.runRenderLoop(() => {
      sceneInstance.render();
    });

    return () => {
      engine.dispose();
    };
  }, []);

  useEffect(() => {
    if (!scene) return;

    preloadTextures(scene);

    const texturePath = getCardImage(card);

    const faceUV = [
      new BABYLON.Vector4(1 / 114, 0, 0 / 114, 1),
      new BABYLON.Vector4(2 / 114, 0, 1 / 114, 1),
      new BABYLON.Vector4(3 / 114, 0, 2 / 114, 1),
      new BABYLON.Vector4(4 / 114, 0, 3 / 114, 1),
      new BABYLON.Vector4(59 / 114, 0, 1, 1),
      new BABYLON.Vector4(59 / 114, 0, 4 / 114, 1),
    ];

    const cardMaterial = new BABYLON.StandardMaterial(`material_${card}`, scene);
    cardMaterial.diffuseTexture = new BABYLON.Texture(texturePath, scene);
    cardMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

    const cardMesh = BABYLON.MeshBuilder.CreateBox(
      card,
      {
        width: relWidth * modifier,
        height: relHeight * modifier,
        depth: relDepth * modifier,
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
    addClickInteraction(cardMesh, scene, isAnimating, () =>
      changeCardTexture(cardMesh, scene)
    );

    return () => {
      cardMesh.dispose();
    };
  }, [scene, card]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
};

export default SpinCard;
