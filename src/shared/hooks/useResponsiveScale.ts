// src/shared/hooks/useResponsiveScale.ts
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ResponsiveScale } from '@/shared/components/background/ShapeConfig';

export const useResponsiveScale = (
  config: ResponsiveScale | undefined,
  fallbackScale: number | THREE.Vector3,
): number | THREE.Vector3 => {
  const { size } = useThree();
  const { width } = size;

  if (!config) {
    return fallbackScale;
  }

  const { minScale, maxScale, minViewportWidth, maxViewportWidth } = config;

  if (width <= minViewportWidth) {
    return minScale;
  }

  if (width >= maxViewportWidth) {
    return maxScale;
  }

  const scaleRange = maxScale - minScale;
  const viewportRange = maxViewportWidth - minViewportWidth;
  const scale =
    minScale + (scaleRange * (width - minViewportWidth)) / viewportRange;

  return scale;
};
