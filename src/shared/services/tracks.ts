export interface Track {
  url: string;
  title: string;
  artist: string;
  normalizationGainDb: number;
}

const publicAssetBaseUrl = import.meta.env.BASE_URL;

export const TRACKS: readonly Track[] = [
  {
    url: `${publicAssetBaseUrl}music/steady220.mp3`,
    title: 'steady.220',
    artist: 'suralo',
    normalizationGainDb: -7.04,
  },
  {
    url: `${publicAssetBaseUrl}music/summer_w_suralo.mp3`,
    title: 'Summer (with suralo)',
    artist: 'Know Now',
    normalizationGainDb: 0,
  },
  {
    url: `${publicAssetBaseUrl}music/session_add.mp3`,
    title: 'Session Add',
    artist: 'Skee Mask',
    normalizationGainDb: -5.49,
  },
];
