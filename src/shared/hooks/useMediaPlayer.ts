import { useState, useEffect, useRef, useCallback } from 'react';

type WindowWithAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext: typeof AudioContext;
  };
import { TRACKS, type Track } from '../services/tracks';

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

const getPlaybackGain = (track: Track | undefined, userVolume: number) =>
  userVolume * Math.pow(10, (track?.normalizationGainDb ?? 0) / 20);
const PLAYBACK_GAIN_RAMP_SECONDS = 0.015;
const PLAYBACK_EDGE_FADE_SECONDS = 0.23;

const DEFAULT_VISUAL_RESPONSE = 22;
const AMPLITUDE_HISTORY_SIZE = 15;
const MIN_ABSOLUTE_DYNAMIC_RANGE = 0.00025;
const MIN_RELATIVE_DYNAMIC_RANGE = 0.3;

export const useMediaPlayer = () => {
  const tracks = TRACKS;
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    () => (TRACKS.length > 0 ? 0 : null),
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioGraphSetup, setIsAudioGraphSetup] = useState(false);
  const amplitudeRef = useRef(0);
  const [intensity, setIntensity] = useState(DEFAULT_VISUAL_RESPONSE);
  const [volume, setVolumeState] = useState(1);
  const volumeRef = useRef(1);
  const amplitudeHistoryRef = useRef<number[]>([]);

  const resetAudioResponse = useCallback(() => {
    amplitudeHistoryRef.current.length = 0;
    amplitudeRef.current = 0;
  }, []);

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const lastProgressUpdate = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const pauseTimerRef = useRef<number | null>(null);

  const rampPlaybackGain = useCallback(
    (targetGain: number, durationSeconds: number) => {
      const context = audioContextRef.current;
      const gainNode = gainRef.current;
      if (!context || !gainNode) return;

      const now = context.currentTime;
      gainNode.gain.cancelScheduledValues(now);

      if (durationSeconds <= 0) {
        gainNode.gain.setValueAtTime(targetGain, now);
        return;
      }

      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.linearRampToValueAtTime(targetGain, now + durationSeconds);
    },
    [],
  );

  const cancelPendingPause = useCallback(() => {
    if (pauseTimerRef.current === null) return;
    window.clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = null;
  }, []);

  const resumeAfterTrackChangeRef = useRef(false);
  const hasPlaybackBeenRequestedRef = useRef(false);
  useEffect(() => {
    audioRef.current.preload = 'none';
    return cancelPendingPause;
  }, [cancelPendingPause]);

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

  const loadTrackSource = useCallback(
    (track: Track) => {
      const audio = audioRef.current;
      cancelPendingPause();

      setProgress(0);
      setDuration(0);
      resetAudioResponse();
      audio.src = track.url;
      audio.load();
      rampPlaybackGain(
        getPlaybackGain(track, volumeRef.current),
        PLAYBACK_GAIN_RAMP_SECONDS,
      );
    },
    [cancelPendingPause, rampPlaybackGain, resetAudioResponse],
  );

  useEffect(() => {
    if (!hasPlaybackBeenRequestedRef.current) return;

    const audio = audioRef.current;
    if (currentTrackIndex !== null && tracks[currentTrackIndex]) {
      const track = tracks[currentTrackIndex];
      const shouldResume =
        resumeAfterTrackChangeRef.current || isPlayingRef.current;
      resumeAfterTrackChangeRef.current = false;

      loadTrackSource(track);

      if (shouldResume) {
        audio.play().catch((e) => {
          console.error('Autoplay failed', e);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, loadTrackSource, tracks]);

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

    const analyser = analyserRef.current;
    if (analyser) {
      let dataArray = frequencyDataRef.current;
      if (!dataArray) {
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        frequencyDataRef.current = dataArray;
      }

      analyser.getByteFrequencyData(dataArray);
      const rawAmplitude = getAmplitudeForFrequencyRange(
        analyser,
        dataArray,
        100,
        14000,
      );

      const history = amplitudeHistoryRef.current;
      history.push(rawAmplitude);
      if (history.length > AMPLITUDE_HISTORY_SIZE) {
        history.shift();
      }

      const minAmp = Math.min(...history);
      const maxAmp = Math.max(...history);
      const observedRange = maxAmp - minAmp;
      const minimumRange = Math.max(
        MIN_ABSOLUTE_DYNAMIC_RANGE,
        maxAmp * MIN_RELATIVE_DYNAMIC_RANGE,
      );
      const range = Math.max(observedRange, minimumRange);

      let dynamicAmplitude = (rawAmplitude - minAmp) / range;

      // clamp the value to a 0-1 range.
      dynamicAmplitude = Math.max(0, Math.min(1.0, dynamicAmplitude));

      // apply a power curve to make quieter dynamics more visible
      const finalAmplitude = Math.pow(dynamicAmplitude, 1.5);

      // console.log('finalAmplitude:', finalAmplitude);
      // Scale to a normalized target; the WebGL frame loop owns the envelope.
      const responseScale = Math.max(0, Math.min(100, intensity)) / 100;
      amplitudeRef.current = finalAmplitude * responseScale;
    }
  }, [intensity]);

  const setVolume = useCallback(
    (newVolume: number) => {
      const clampedVolume = Math.max(0, Math.min(100, newVolume)) / 100;
      const track =
        currentTrackIndex === null ? undefined : tracks[currentTrackIndex];

      setVolumeState(clampedVolume);
      volumeRef.current = clampedVolume;
      rampPlaybackGain(
        getPlaybackGain(track, clampedVolume),
        PLAYBACK_GAIN_RAMP_SECONDS,
      );
    },
    [currentTrackIndex, rampPlaybackGain, tracks],
  );

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

    const track = tracks[currentTrackIndex];
    if (!track) return;

    const audio = audioRef.current;
    const shouldFadeIn = audio.paused;
    hasPlaybackBeenRequestedRef.current = true;
    if (audio.getAttribute('src') !== track.url) {
      loadTrackSource(track);
    }

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
          gainNode.gain.value = getPlaybackGain(track, volumeRef.current);
          gainRef.current = gainNode;
        } catch (e) {
          console.error('Web Audio API is not supported in this browser', e);
          return;
        }
      }
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
      if (shouldFadeIn) rampPlaybackGain(0, 0);
      await audio.play();
      if (shouldFadeIn) {
        rampPlaybackGain(
          getPlaybackGain(track, volumeRef.current),
          PLAYBACK_EDGE_FADE_SECONDS,
        );
      }
    } catch (error) {
      console.error('Playback failed:', error);
    }
  }, [
    currentTrackIndex,
    isAudioGraphSetup,
    loadTrackSource,
    rampPlaybackGain,
    tracks,
  ]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    const canFade = audioContextRef.current && gainRef.current;

    cancelPendingPause();
    if (audio.paused || !canFade) {
      audio.pause();
      resetAudioResponse();
      return;
    }

    rampPlaybackGain(0, PLAYBACK_EDGE_FADE_SECONDS);
    pauseTimerRef.current = window.setTimeout(() => {
      audio.pause();
      resetAudioResponse();
      pauseTimerRef.current = null;
    }, PLAYBACK_EDGE_FADE_SECONDS * 1000);
  }, [cancelPendingPause, rampPlaybackGain, resetAudioResponse]);

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
    amplitudeRef,
    intensity,
    setIntensity,
    volume: volume * 100, // convert back to 0-100 for UI
    setVolume,
  };
};
