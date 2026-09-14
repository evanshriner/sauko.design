import { useEffect, useState } from 'react';

export type SceneQualityTier = 'high' | 'balanced';

export interface SceneQualitySettings {
  tier: SceneQualityTier;
  dpr: number | [number, number];
  frameRate: number;
  multisampling: number;
  reflectionResolution: number;
  reflectionRefreshRate: number;
}

export const BALANCED_SCENE_QUERY =
  '(max-width: 768px), (pointer: coarse), (prefers-reduced-motion: reduce)';

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
  const shouldBalance =
    window.matchMedia(BALANCED_SCENE_QUERY).matches ||
    deviceNavigator.connection?.saveData === true ||
    (deviceNavigator.deviceMemory !== undefined &&
      deviceNavigator.deviceMemory <= 4) ||
    deviceNavigator.hardwareConcurrency <= 4;

  return shouldBalance ? 'balanced' : 'high';
};

export const useSceneQuality = (): SceneQualitySettings => {
  const [tier, setTier] = useState<SceneQualityTier>(getSceneQualityTier);

  useEffect(() => {
    const qualityQuery = window.matchMedia(BALANCED_SCENE_QUERY);
    const updateTier = () => setTier(getSceneQualityTier());

    updateTier();
    qualityQuery.addEventListener('change', updateTier);
    return () => qualityQuery.removeEventListener('change', updateTier);
  }, []);

  return SCENE_QUALITY_SETTINGS[tier];
};
