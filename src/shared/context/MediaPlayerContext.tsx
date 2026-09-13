import React, { createContext, useContext } from 'react';
import { useMediaPlayer } from '../hooks/useMediaPlayer';

type MediaPlayerContextType = ReturnType<typeof useMediaPlayer>;

const MediaPlayerContext = createContext<MediaPlayerContextType | undefined>(
  undefined,
);

export const MediaPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const mediaPlayer = useMediaPlayer();
  return (
    <MediaPlayerContext.Provider value={mediaPlayer}>
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayerContext = () => {
  const context = useContext(MediaPlayerContext);
  if (context === undefined) {
    throw new Error(
      'useMediaPlayerContext must be used within a MediaPlayerProvider',
    );
  }
  return context;
};
