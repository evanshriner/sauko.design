export interface Track {
  url: string;
  title: string;
  artist: string;
}

export const TRACKS: readonly Track[] = [
  {
    url: '/music/steady220.mp3',
    title: 'steady.220',
    artist: 'suralo',
  },
  {
    url: '/music/summer_w_suralo.mp3',
    title: 'Summer (with suralo)',
    artist: 'Know Now',
  },
  {
    url: '/music/session_add.mp3',
    title: 'Session Add',
    artist: 'Skee Mask',
  },
];
