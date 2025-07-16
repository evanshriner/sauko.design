import { useState, useEffect, useRef, useCallback } from 'react';
import { Track, AudioService } from '../services/AudioService';

const audioService = new AudioService();

export const useMediaPlayer = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const lastProgressUpdate = useRef<number>(0);

  useEffect(() => {
    audioRef.current.preload = 'auto';
    const fetchTracks = async () => {
      const fetchedTracks = await audioService.getTracks();
      setTracks(fetchedTracks);
      console.log(`Fetched ${fetchedTracks.length} tracks`);
      if (fetchedTracks.length > 0) {
        setCurrentTrackIndex(0);
      }
    };
    fetchTracks();
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    setDuration(audioRef.current.duration);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    const syncPlayState = () => {
      setIsPlaying(!audio.paused);
    };

    audio.addEventListener('play', syncPlayState);
    audio.addEventListener('pause', syncPlayState);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      audio.removeEventListener('play', syncPlayState);
      audio.removeEventListener('pause', syncPlayState);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [handleLoadedMetadata]);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (currentTrackIndex !== null && tracks[currentTrackIndex]) {
      const track = tracks[currentTrackIndex];
      audio.src = track.url;
      audio.load();
      if (isPlayingRef.current) {
        audio.play().catch((e) => {
          console.error('Autoplay failed', e);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, tracks]);

  const animationFrameRef = useRef<number>();

  const progressLoop = useCallback(() => {
    animationFrameRef.current = requestAnimationFrame(progressLoop);
    const now = Date.now();
    const audio = audioRef.current;
    // so we dont spam progress updates
    if (now - lastProgressUpdate.current > 150) {
      if (audio.duration > 0) {
        lastProgressUpdate.current = now;
        setProgress(audio.currentTime / audio.duration);
      }
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      lastProgressUpdate.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(progressLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, progressLoop]);

  const play = useCallback(async () => {
    if (currentTrackIndex !== null) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Playback failed:', error);
      }
    }
  }, [currentTrackIndex]);

  const pause = useCallback(() => {
    audioRef.current.pause();
  }, []);

  const skipForward = useCallback(() => {
    if (currentTrackIndex !== null) {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
    }
  }, [currentTrackIndex, tracks.length]);

  const skipBackward = useCallback(() => {
    if (currentTrackIndex !== null) {
      const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      setCurrentTrackIndex(prevIndex);
    }
  }, [currentTrackIndex, tracks.length]);

  const seek = useCallback(
    (newProgress: number) => {
      if (duration > 0) {
        audioRef.current.currentTime = newProgress * duration;
        setProgress(newProgress);
      }
    },
    [duration],
  );

  return {
    tracks,
    currentTrackIndex,
    isPlaying,
    progress,
    duration,
    play,
    pause,
    skipForward,
    skipBackward,
    seek,
  };
};
