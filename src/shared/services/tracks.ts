export interface Track {
  url: string;
  title: string;
  artist: string;
}

const publicAssetBaseUrl = import.meta.env.BASE_URL;

export const TRACKS: readonly Track[] = [
  {
    url: `${publicAssetBaseUrl}music/something_to_think_about.mp3`,
    title: 'Something to Think About',
    artist: 'Kiyoko',
  },
  {
    url: `${publicAssetBaseUrl}music/romance.mp3`,
    title: 'ROMANCE',
    artist: '.CASTING',
  },
  {
    url: `${publicAssetBaseUrl}music/steady220.mp3`,
    title: 'steady.220',
    artist: 'suralo',
  },
  {
    url: `${publicAssetBaseUrl}music/summer_w_suralo.mp3`,
    title: 'Summer (with suralo)',
    artist: 'Know Now',
  },
  {
    url: `${publicAssetBaseUrl}music/session_add.mp3`,
    title: 'Session Add',
    artist: 'Skee Mask',
  },
];
