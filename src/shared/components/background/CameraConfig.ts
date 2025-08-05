// src/shared/components/background/CameraConfig.ts
import { Pages } from '@/shared/interfaces/pages';
import * as THREE from 'three';

export interface CameraConfig {
  page: Pages;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

export const cameraConfigurations: CameraConfig[] = [
  {
    page: Pages.Home,
    position: new THREE.Vector3(0, 0.3, 1.3),
    lookAt: new THREE.Vector3(0, 0.3, 0),
  },
  {
    page: Pages.AudioEngineering,
    position: new THREE.Vector3(-0.5, 0.9, 1.5),
    lookAt: new THREE.Vector3(1, 2.4, 0),
  },
  {
    page: Pages.Software,
    position: new THREE.Vector3(0.5, 0.2, 1.5),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
  {
    page: Pages.AIAugmentation,
    position: new THREE.Vector3(0, -0.5, 1.5),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
];
