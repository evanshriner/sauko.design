import { useState, useEffect, useRef, useCallback } from 'react';

type WindowWithAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext: typeof AudioContext;
  };
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
  const [isAudioGraphSetup, setIsAudioGraphSetup] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const lastProgressUpdate = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

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
    console.log('Analyser node updated:', analyserRef.current);
  }, [analyserRef.current]);

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
    if (currentTrackIndex === null) return;

    if (!isAudioGraphSetup) {
      if (!audioContextRef.current) {
        try {
          const context = new (window.AudioContext ||
            (window as WindowWithAudioContext).webkitAudioContext)();
          audioContextRef.current = context;
          const analyser = context.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;
        } catch (e) {
          console.error('Web Audio API is not supported in this browser', e);
          return;
        }
      }
      const audio = audioRef.current;
      if (audioContextRef.current && analyserRef.current) {
        const source = audioContextRef.current.createMediaElementSource(audio);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        setIsAudioGraphSetup(true);
      }
    }

    try {
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      await audioRef.current.play();
    } catch (error) {
      console.error('Playback failed:', error);
    }
  }, [currentTrackIndex, isAudioGraphSetup]);

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
    audioRef,
    analyserRef,
  };
};
