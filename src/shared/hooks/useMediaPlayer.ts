import { useState, useEffect, useRef, useCallback } from 'react';

type WindowWithAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext: typeof AudioContext;
  };
import { Track, AudioService } from '../services/AudioService';

const audioService = new AudioService();

const getAmplitudeForFrequencyRange = (
  analyser: AnalyserNode,
  dataArray: Uint8Array,
  minFreq: number,
  maxFreq: number,
): number => {
  const sampleRate = analyser.context.sampleRate;
  const frequencyBinCount = analyser.frequencyBinCount;
  const maxPossibleFreq = sampleRate / 2;
  const { minDecibels, maxDecibels } = analyser;

  const startIndex = Math.floor(
    (minFreq / maxPossibleFreq) * frequencyBinCount,
  );
  const endIndex = Math.min(
    Math.floor((maxFreq / maxPossibleFreq) * frequencyBinCount),
    frequencyBinCount - 1,
  );

  if (startIndex >= endIndex) return 0;

  let linearSum = 0;
  const decibelRange = maxDecibels - minDecibels;

  for (let i = startIndex; i < endIndex; i++) {
    const amplitudeByte = dataArray[i];
    // Convert byte value back to decibels
    const decibels = (amplitudeByte / 255) * decibelRange + minDecibels;
    // Convert decibels to linear amplitude
    const linear = Math.pow(10, decibels / 20);
    linearSum += linear;
  }

  const averageLinear = linearSum / (endIndex - startIndex);

  // Normalize the average linear amplitude against the max possible amplitude.
  const maxLinearAmplitude = Math.pow(10, maxDecibels / 20);

  if (maxLinearAmplitude === 0) return 0;

  let normalizedAmplitude = averageLinear / maxLinearAmplitude;

  // Clamp to 0-1 range to be safe.
  normalizedAmplitude = Math.max(0, Math.min(1, normalizedAmplitude));

  return normalizedAmplitude;
};

export const useMediaPlayer = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioGraphSetup, setIsAudioGraphSetup] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [intensity, setIntensity] = useState(100);
  const [volume, setVolumeState] = useState(1);
  const amplitudeHistoryRef = useRef<number[]>([]);

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const lastProgressUpdate = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const resumeAfterTrackChangeRef = useRef(false);
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
      const shouldResume =
        resumeAfterTrackChangeRef.current || isPlayingRef.current;
      resumeAfterTrackChangeRef.current = false;

      setProgress(0);
      setDuration(0);
      setAmplitude(0);
      audio.src = track.url;
      audio.load();

      if (shouldResume) {
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

    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const rawAmplitude = getAmplitudeForFrequencyRange(
        analyserRef.current,
        dataArray,
        100,
        14000,
      );

      const history = amplitudeHistoryRef.current;
      history.push(rawAmplitude);
      if (history.length > 15) {
        history.shift();
      }

      const minAmp = Math.min(...history);
      const maxAmp = Math.max(...history);
      let range = maxAmp - minAmp;

      // establish a minimum dynamic range to stabilize output for smooth audio
      const MIN_RANGE = 0.15;
      range = Math.max(range, MIN_RANGE);

      let dynamicAmplitude = (rawAmplitude - minAmp) / range;

      // clamp the value to a 0-1 range.
      dynamicAmplitude = Math.max(0, Math.min(1.0, dynamicAmplitude));

      // apply a power curve to make quieter dynamics more visible
      const finalAmplitude = Math.pow(dynamicAmplitude, 1.5);

      // console.log('finalAmplitude:', finalAmplitude);
      // smoothing and intensity scaling
      setAmplitude((prev) => prev * 0.5 + finalAmplitude * (intensity * 2));
    }
  }, [intensity]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, newVolume)) / 100; // convert to 0-1
    setVolumeState(clampedVolume);
    if (gainRef.current) {
      gainRef.current.gain.setValueAtTime(
        clampedVolume,
        audioContextRef.current?.currentTime ?? 0,
      );
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
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.2;
          analyser.minDecibels = -90;
          analyser.maxDecibels = -10;
          analyserRef.current = analyser;

          const gainNode = context.createGain();
          gainNode.gain.value = volume;
          gainRef.current = gainNode;
        } catch (e) {
          console.error('Web Audio API is not supported in this browser', e);
          return;
        }
      }
      const audio = audioRef.current;
      if (audioContextRef.current && analyserRef.current && gainRef.current) {
        const source = audioContextRef.current.createMediaElementSource(audio);
        source.connect(analyserRef.current);
        analyserRef.current.connect(gainRef.current);
        gainRef.current.connect(audioContextRef.current.destination);
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
  }, [currentTrackIndex, isAudioGraphSetup, volume]);

  const pause = useCallback(() => {
    audioRef.current.pause();
  }, []);

  const skipForward = useCallback(() => {
    if (currentTrackIndex !== null && tracks.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
    }
  }, [currentTrackIndex, tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      resumeAfterTrackChangeRef.current = true;
      skipForward();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [skipForward]);

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
    amplitude,
    intensity,
    setIntensity,
    volume: volume * 100, // convert back to 0-100 for UI
    setVolume,
  };
};
