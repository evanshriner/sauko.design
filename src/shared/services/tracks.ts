export interface Track {
  url: string;
  title: string;
  artist: string;
  normalizationGainDb: number;
}

const publicAssetBaseUrl = import.meta.env.BASE_URL;

export const TRACKS: readonly Track[] = [
  {
    url: `${publicAssetBaseUrl}music/something_to_think_about.mp3`,
    title: 'Something to Think About',
    artist: 'Kiyoko',
    normalizationGainDb: -5.04,
  },
  {
    url: `${publicAssetBaseUrl}music/romance.mp3`,
    title: 'ROMANCE',
    artist: '.CASTING',
    normalizationGainDb: -11.46,
  },
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
    normalizationGainDb: -2.23,
  },
  {
    url: `${publicAssetBaseUrl}music/session_add.mp3`,
    title: 'Session Add',
    artist: 'Skee Mask',
    normalizationGainDb: -5.49,
  },
];
