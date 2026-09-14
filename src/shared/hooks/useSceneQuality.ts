import { useEffect, useState } from 'react';

export type SceneQualityTier = 'high' | 'balanced' | 'constrained';

export interface SceneQualitySettings {
  tier: SceneQualityTier;
  dpr: number | [number, number];
  frameRate: number;
  multisampling: number;
  reflectionResolution: number;
  reflectionRefreshRate: number;
}

export const MOBILE_SCENE_QUERY = '(max-width: 768px), (pointer: coarse)';
export const CONSTRAINED_SCENE_QUERY = '(prefers-reduced-motion: reduce)';

export const SCENE_QUALITY_SETTINGS: Record<
  SceneQualityTier,
  SceneQualitySettings
> = {
  high: {
    tier: 'high',
    frameRate: 60,
    dpr: [1, 2],
    multisampling: 4,
    reflectionResolution: 256,
    reflectionRefreshRate: 24,
  },
  balanced: {
    tier: 'balanced',
    dpr: 1,
    frameRate: 60,
    multisampling: 0,
    reflectionResolution: 128,
    reflectionRefreshRate: 12,
  },
  constrained: {
    tier: 'constrained',
    dpr: 1,
    frameRate: 30,
    multisampling: 0,
    reflectionResolution: 128,
    reflectionRefreshRate: 12,
  },
};

type PerformanceNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

const getSceneQualityTier = (): SceneQualityTier => {
  if (typeof window === 'undefined') return 'high';

  const deviceNavigator = window.navigator as PerformanceNavigator;
  const isConstrained =
    window.matchMedia(CONSTRAINED_SCENE_QUERY).matches ||
    deviceNavigator.connection?.saveData === true ||
    (deviceNavigator.deviceMemory !== undefined &&
      deviceNavigator.deviceMemory <= 4) ||
    deviceNavigator.hardwareConcurrency <= 4;

  if (isConstrained) return 'constrained';
  return window.matchMedia(MOBILE_SCENE_QUERY).matches ? 'balanced' : 'high';
};

export const useSceneQuality = (): SceneQualitySettings => {
  const [tier, setTier] = useState<SceneQualityTier>(getSceneQualityTier);

  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_SCENE_QUERY);
    const constrainedQuery = window.matchMedia(CONSTRAINED_SCENE_QUERY);
    const updateTier = () => setTier(getSceneQualityTier());

    updateTier();
    mobileQuery.addEventListener('change', updateTier);
    constrainedQuery.addEventListener('change', updateTier);
    return () => {
      mobileQuery.removeEventListener('change', updateTier);
      constrainedQuery.removeEventListener('change', updateTier);
    };
  }, []);

  return SCENE_QUALITY_SETTINGS[tier];
};
