// src/objectConfig.ts
import * as THREE from 'three';

export enum DisplayedObject {
  Boombox = 'BOOMBOX',
  Laptop = 'LAPTOP',
  PostedLetter = 'POSTED_LETTER',
  // Add more object identifiers here
}

export interface ObjectConfig {
  id: DisplayedObject;
  gltfPath: string;
  scale: THREE.Vector3 | number; // Uniform scale or per-axis
  basePosition: THREE.Vector3; // The "center" position it will occupy when active
  // Animation function for rotation
  rotationAnimation: (
    mesh: THREE.Mesh,
    time: number,
    initialRotationOffset?: number,
  ) => void;
  floatAnimation: (mesh: THREE.Mesh, time: number) => void; // bouncing up and down animation
  initialRotationOffset?: number; // Optional: for specific starting orientations
  isReflective?: boolean; // Flag to determine if this object uses the reflective shader
}

export const objectConfigurations: ObjectConfig[] = [
  {
    id: DisplayedObject.Boombox,
    gltfPath: '/Boombox.glb',
    scale: 0.45,
    basePosition: new THREE.Vector3(0.0, 0.0, 0.0),
    rotationAnimation: (mesh, time, initialOffset = 4.73) => {
      mesh.rotation.y = -time * 0.06 - (initialOffset + (Math.sin(time * 0.5) * 0.05));
    },
    floatAnimation: (mesh, time) => {
      // Floats around its local origin; group handles fly-in/out
      mesh.position.y = Math.sin(time * 0.7) * 0.02;
    },
    initialRotationOffset: 4.73,
    isReflective: true,
  },
  {
    id: DisplayedObject.Laptop,
    gltfPath: '/Laptop.glb',
    scale: 0.4,
    basePosition: new THREE.Vector3(5.0, 0.2, 0), // Centered when active
    rotationAnimation: (mesh, time) => {
      mesh.rotation.y = time * 0.15;
    },
    floatAnimation: (mesh, time) => {
      mesh.position.y = Math.cos(time * 0.6) * 0.03;
    },
    isReflective: true,
  },
//   {
//     id: DisplayedObject.PostedLetter,
//     gltfPath: '/PostedLetter.glb',
//     scale: 0.6,
//     basePosition: new THREE.Vector3(0, 0.15, 0),
//     rotationAnimation: (mesh, time) => {
//       mesh.rotation.x = Math.sin(time * 0.5) * 0.1;
//       mesh.rotation.y = time * 0.2;
//     },
//     floatAnimation: (mesh, time) => {
//       mesh.position.y = Math.sin(time * 0.8) * 0.05;
//     },
//     isReflective: true, 
//   },
];

// Animation constants for transitions
export const ANIMATION_DURATION = 0.8; // seconds
export const FLY_OUT_Y_POSITION = 4; // units to fly up/out
export const FLY_IN_Y_START_POSITION = -4; // units to fly in from below