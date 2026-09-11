import React, { useEffect, useRef, useState } from 'react';
import {
  animate,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { useTheme } from '@emotion/react';
import FlexBox from '../FlexBox';
import { FaPlay, FaPause } from 'react-icons/fa';
import { FaBackwardStep, FaForwardStep } from 'react-icons/fa6';
import { BsBrightnessHighFill } from 'react-icons/bs';
import { PiSpeakerSimpleHighFill } from 'react-icons/pi';

import NeonText from '../../styles/NeonText';
import { useMediaPlayerContext } from '../../context/MediaPlayerContext';
import * as C from './constants';
import {
  ControlButton,
  MediaControlContainer,
  MediaControlFill,
  MediaControlIcon,
  MediaPlayerContainer,
  PlayPauseButton,
  PlayPauseIcon,
  ScrubberContainer,
  ScrubberHandle,
} from './styles';

const MediaPlayer: React.FC = () => {
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const {
    isPlaying,
    progress,
    tracks,
    currentTrackIndex,
    play,
    pause,
    skipForward,
    skipBackward,
    seek,
    intensity,
    setIntensity,
    volume,
    setVolume,
  } = useMediaPlayerContext();

  const [scrubberWidth, setScrubberWidth] = useState(0);

  const scrubberRef = useRef<HTMLDivElement>(null);
  const intensityControlRef = useRef<HTMLDivElement>(null);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const handleX = useMotionValue(0);
  const handleY = useMotionValue(0);
  const intensityFill = useMotionValue(intensity / 100);
  const volumeFill = useMotionValue(volume / 100);

  const foregroundWaveRef = useRef<SVGPathElement>(null);
  const backgroundWaveRef = useRef<SVGPathElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const timeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isScrubberAnimatingRef = useRef(false);
  const scrubberAnimationRef = useRef<{ stop: () => void } | null>(null);
  const isIntensityAnimatingRef = useRef(false);
  const intensityAnimationRef = useRef<{ stop: () => void } | null>(null);
  const isVolumeAnimatingRef = useRef(false);
  const volumeAnimationRef = useRef<{ stop: () => void } | null>(null);

  const scrubberTravel = Math.max(0, scrubberWidth - C.SCRUBBER_HANDLE_SIZE_PX);

  useAnimationFrame((_, delta) => {
    if (isPlaying) {
      timeRef.current += delta / C.WAVE_ANIMATION_SPEED_DIVISOR;
    }

    if (
      scrubberWidth > 0 &&
      !isDraggingRef.current &&
      !isScrubberAnimatingRef.current
    ) {
      const boundedProgress = Math.max(0, Math.min(1, progress));
      handleX.set(boundedProgress * scrubberTravel);
    }

    if (
      !foregroundWaveRef.current ||
      !backgroundWaveRef.current ||
      scrubberWidth === 0
    )
      return;

    const amplitude = C.WAVE_AMPLITUDE; // Wave height
    const frequency = C.WAVE_FREQUENCY; // Number of full waves across the scrubber

    // Build the SVG path string for the sine wave
    let d = `M 0 0`;
    for (let x = 0; x <= scrubberWidth; x++) {
      const angle =
        (x / scrubberWidth) * frequency * Math.PI * 2 + timeRef.current;
      const y = Math.sin(angle) * amplitude;
      d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }

    backgroundWaveRef.current.setAttribute('d', d);
    foregroundWaveRef.current.setAttribute('d', d);

    const visualProgress =
      scrubberTravel > 0 ? handleX.get() / scrubberTravel : 0;
    const handleAngle =
      visualProgress * frequency * Math.PI * 2 + timeRef.current;
    const handleYOffset =
      Math.sin(handleAngle) * amplitude * C.HANDLE_AMPLITUDE_MULTIPLIER;

    handleY.set(handleYOffset - C.SCRUBBER_HANDLE_Y_OFFSET);
  });

  useEffect(() => {
    const scrubberElement = scrubberRef.current;
    if (!scrubberElement) return;

    const updateWidth = () => {
      const newWidth = scrubberElement.getBoundingClientRect().width;
      setScrubberWidth(newWidth); // Account for 8px padding on each side
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(scrubberElement);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const unsubscribe = handleX.onChange((latestX) => {
      const visualProgress = scrubberTravel > 0 ? latestX / scrubberTravel : 0;
      const boundedProgress = Math.max(0, Math.min(1, visualProgress));

      if (clipRectRef.current) {
        clipRectRef.current.setAttribute(
          'width',
          String(boundedProgress * scrubberWidth),
        );
      }

      if (isDraggingRef.current) {
        seek(boundedProgress);
      }
    });
    return () => unsubscribe();
  }, [handleX, scrubberTravel, scrubberWidth, seek]);

  useEffect(() => {
    if (!isIntensityAnimatingRef.current) {
      intensityFill.set(intensity / 100);
    }
  }, [intensity, intensityFill]);

  useEffect(() => {
    if (!isVolumeAnimatingRef.current) {
      volumeFill.set(volume / 100);
    }
  }, [volume, volumeFill]);

  useEffect(
    () => () => {
      scrubberAnimationRef.current?.stop();
      intensityAnimationRef.current?.stop();
      volumeAnimationRef.current?.stop();
    },
    [],
  );

  const animateControlFill = (
    fill: typeof intensityFill,
    animationRef: typeof intensityAnimationRef,
    isAnimatingRef: typeof isIntensityAnimatingRef,
    targetValue: number,
  ) => {
    animationRef.current?.stop();
    const normalizedTarget = Math.max(0, Math.min(100, targetValue)) / 100;

    if (prefersReducedMotion) {
      isAnimatingRef.current = false;
      animationRef.current = null;
      fill.set(normalizedTarget);
      return;
    }

    isAnimatingRef.current = true;
    animationRef.current = animate(fill.get(), normalizedTarget, {
      duration: C.CONTROL_CLICK_ANIMATION_DURATION,
      ease: C.CONTROL_CLICK_ANIMATION_EASE,
      onUpdate: (latest) => fill.set(latest),
      onComplete: () => {
        isAnimatingRef.current = false;
        animationRef.current = null;
      },
    });
  };

  const handleScrubberClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberRef.current || scrubberWidth <= 0) return;

    const scrubberRect = scrubberRef.current.getBoundingClientRect();
    const clickX = event.clientX - scrubberRect.left;
    const targetProgress = Math.max(0, Math.min(1, clickX / scrubberWidth));
    const targetX = targetProgress * scrubberTravel;

    seek(targetProgress);
    scrubberAnimationRef.current?.stop();

    if (prefersReducedMotion || scrubberTravel === 0) {
      isScrubberAnimatingRef.current = false;
      scrubberAnimationRef.current = null;
      handleX.set(targetX);
      if (clipRectRef.current) {
        clipRectRef.current.setAttribute(
          'width',
          String(targetProgress * scrubberWidth),
        );
      }
      return;
    }

    isScrubberAnimatingRef.current = true;
    scrubberAnimationRef.current = animate(handleX.get(), targetX, {
      duration: C.CONTROL_CLICK_ANIMATION_DURATION,
      ease: C.CONTROL_CLICK_ANIMATION_EASE,
      onUpdate: (latest) => handleX.set(latest),
      onComplete: () => {
        isScrubberAnimatingRef.current = false;
        scrubberAnimationRef.current = null;
      },
    });
  };

  const createVerticalSliderHandler = (
    controlRef: React.RefObject<HTMLDivElement>,
    setter: (value: number) => void,
    fill: typeof intensityFill,
    animationRef: typeof intensityAnimationRef,
    isAnimatingRef: typeof isIntensityAnimatingRef,
  ) => {
    return (event: React.PointerEvent<HTMLDivElement>) => {
      if (!event.isPrimary || event.button !== 0) return;

      event.preventDefault();
      const startY = event.clientY;
      let hasDragged = false;

      const getValue = (clientY: number) => {
        if (!controlRef.current) return null;
        const rect = controlRef.current.getBoundingClientRect();
        const percentage = 100 - ((clientY - rect.top) / rect.height) * 100;
        return Math.max(0, Math.min(100, percentage));
      };

      const applyDraggedValue = (value: number) => {
        animationRef.current?.stop();
        animationRef.current = null;
        isAnimatingRef.current = false;
        fill.set(value / 100);
        setter(value);
      };

      const removeWindowListeners = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerCancel);
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (
          !hasDragged &&
          Math.abs(moveEvent.clientY - startY) < C.CONTROL_DRAG_THRESHOLD
        ) {
          return;
        }

        hasDragged = true;
        const value = getValue(moveEvent.clientY);
        if (value !== null) applyDraggedValue(value);
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        removeWindowListeners();
        const value = getValue(upEvent.clientY);
        if (value === null) return;

        if (hasDragged) {
          applyDraggedValue(value);
          return;
        }

        animateControlFill(fill, animationRef, isAnimatingRef, value);
        setter(value);
      };

      const handlePointerCancel = () => {
        removeWindowListeners();
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerCancel);
    };
  };

  const handleIntensityPointerDown = createVerticalSliderHandler(
    intensityControlRef,
    setIntensity,
    intensityFill,
    intensityAnimationRef,
    isIntensityAnimatingRef,
  );
  const handleVolumePointerDown = createVerticalSliderHandler(
    volumeControlRef,
    setVolume,
    volumeFill,
    volumeAnimationRef,
    isVolumeAnimatingRef,
  );

  const currentTrack =
    currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  return (
    <MediaPlayerContainer
      justifyContent="space-around"
      alignItems="center"
      gap={C.MEDIA_PLAYER_GAP}
      clickable
    >
      <PlayPauseButton onClick={isPlaying ? pause : play}>
        {isPlaying ? (
          <PlayPauseIcon key="pause">
            <FaPause />
          </PlayPauseIcon>
        ) : (
          <PlayPauseIcon key="play">
            <FaPlay />
          </PlayPauseIcon>
        )}
      </PlayPauseButton>
      <FlexBox width="100%" flexDirection="column">
        <FlexBox>
          <NeonText
            fontSize={C.TRACK_INFO_FONT_SIZE}
            justifyContent="center"
            alignItems="center"
            disableSelection
          >
            {currentTrack
              ? `${currentTrack.title} | ${currentTrack.artist}`
              : 'No track loaded'}
          </NeonText>
          {/* TODO: find a way to go to source audio */}
          {/* <ControlButton>
            <FaExternalLinkAlt />
          </ControlButton> */}
        </FlexBox>
        <FlexBox
          justifyContent="space-around"
          width="100%"
          alignItems="center"
          clickable
        >
          <ControlButton onClick={skipBackward}>
            <FaBackwardStep />
          </ControlButton>

          <ScrubberContainer
            ref={scrubberRef}
            onClick={handleScrubberClick}
            clickable
          >
            {/* SVG container for the wave visuals */}
            <svg
              width={scrubberWidth}
              height="10"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* This clip path reveals the foreground wave based on progress */}
                <clipPath id={C.CLIP_PATH_ID}>
                  <rect ref={clipRectRef} x="0" y="-5" width="0" height="10" />
                </clipPath>
              </defs>

              {/* Background wave (the "unfilled" part) */}
              <path
                ref={backgroundWaveRef}
                stroke={theme.colors.defaultUnselected}
                strokeWidth={C.WAVE_STROKE_WIDTH}
                strokeLinecap="round"
                fill="none"
              />

              {/* Foreground wave (the "filled" part), clipped by the rect above */}
              <path
                ref={foregroundWaveRef}
                stroke={theme.colors.defaultSelected}
                strokeWidth={C.WAVE_STROKE_WIDTH}
                strokeLinecap="round"
                fill="none"
                clipPath={`url(#${C.CLIP_PATH_ID})`}
              />
            </svg>

            <ScrubberHandle
              drag="x"
              dragConstraints={{ left: 0, right: scrubberTravel }}
              dragElastic={0}
              dragMomentum={false}
              style={{ x: handleX, y: handleY }}
              onDragStart={() => {
                scrubberAnimationRef.current?.stop();
                scrubberAnimationRef.current = null;
                isScrubberAnimatingRef.current = false;
                isDraggingRef.current = true;
              }}
              onDragEnd={() => {
                isDraggingRef.current = false;
              }}
            />
          </ScrubberContainer>

          <ControlButton onClick={skipForward}>
            <FaForwardStep />
          </ControlButton>
        </FlexBox>
      </FlexBox>
      <FlexBox gap="8px" alignItems="center" width="auto" height="100%">
        <MediaControlContainer
          ref={intensityControlRef}
          clickable
          onPointerDown={handleIntensityPointerDown}
        >
          <MediaControlFill style={{ scaleY: intensityFill }} />
          <MediaControlIcon>
            <BsBrightnessHighFill />
          </MediaControlIcon>
        </MediaControlContainer>
        <MediaControlContainer
          ref={volumeControlRef}
          clickable
          onPointerDown={handleVolumePointerDown}
        >
          <MediaControlFill style={{ scaleY: volumeFill }} />
          <MediaControlIcon>
            <PiSpeakerSimpleHighFill />
          </MediaControlIcon>
        </MediaControlContainer>
      </FlexBox>
    </MediaPlayerContainer>
  );
};

export default MediaPlayer;
