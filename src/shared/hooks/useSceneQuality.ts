import { useEffect, useState } from 'react';

export type SceneQualityTier = 'high' | 'balanced';

export interface SceneQualitySettings {
  tier: SceneQualityTier;
  dpr: number | [number, number];
  multisampling: number;
  reflectionResolution: number;
  reflectionRefreshRate: number;
}

export const BALANCED_SCENE_QUERY = '(max-width: 768px), (pointer: coarse)';

export const SCENE_QUALITY_SETTINGS: Record<
  SceneQualityTier,
  SceneQualitySettings
> = {
  high: {
    tier: 'high',
    dpr: [1, 2],
    multisampling: 4,
    reflectionResolution: 256,
    reflectionRefreshRate: 60,
  },
  balanced: {
    tier: 'balanced',
    dpr: 1,
    multisampling: 0,
    reflectionResolution: 128,
    reflectionRefreshRate: 60,
  },
};

const getSceneQualityTier = (): SceneQualityTier => {
  if (typeof window === 'undefined') return 'high';
  return window.matchMedia(BALANCED_SCENE_QUERY).matches ? 'balanced' : 'high';
};

export const useSceneQuality = (): SceneQualitySettings => {
  const [tier, setTier] = useState<SceneQualityTier>(getSceneQualityTier);

  useEffect(() => {
    const qualityQuery = window.matchMedia(BALANCED_SCENE_QUERY);
    const updateTier = () => {
      setTier(qualityQuery.matches ? 'balanced' : 'high');
    };

    updateTier();
    qualityQuery.addEventListener('change', updateTier);
    return () => qualityQuery.removeEventListener('change', updateTier);
  }, []);

  return SCENE_QUALITY_SETTINGS[tier];
};
