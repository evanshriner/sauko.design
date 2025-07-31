import React, { useEffect, useRef, useState } from 'react';
import { useAnimationFrame, useMotionValue } from 'framer-motion';
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
  MediaPlayerContainer,
  PlayPauseButton,
  PlayPauseIcon,
  ScrubberContainer,
  ScrubberHandle,
} from './styles';

const MediaPlayer: React.FC = () => {
  const theme = useTheme();
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

  const foregroundWaveRef = useRef<SVGPathElement>(null);
  const backgroundWaveRef = useRef<SVGPathElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const timeRef = useRef(0);
  const isDraggingRef = useRef(false);

  useAnimationFrame((time, delta) => {
    // Only animate the wave if playing
    if (isPlaying) {
      timeRef.current += delta / C.WAVE_ANIMATION_SPEED_DIVISOR; // Adjust divisor to control speed
    }

    // Sync progress state with visual elements (handle and clip path)
    // We do this in useAnimationFrame to ensure smooth updates that are
    // synced with the browser's paint cycle, and only when not dragging.
    if (scrubberWidth > 0 && !isDraggingRef.current) {
      const newX = progress * scrubberWidth;
      handleX.set(newX);
      if (clipRectRef.current) {
        clipRectRef.current.setAttribute('width', String(newX));
      }
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

    // Directly update the path attributes for both waves for performance
    backgroundWaveRef.current.setAttribute('d', d);
    foregroundWaveRef.current.setAttribute('d', d);

    const currentX = handleX.get();
    const handleAngle =
      (currentX / scrubberWidth) * frequency * Math.PI * 2 + timeRef.current;
    const handleYOffset =
      Math.sin(handleAngle) * amplitude * C.HANDLE_AMPLITUDE_MULTIPLIER; // Slightly larger amplitude for handle

    // Set Y value: wave offset - half handle height to center the handle on the wave
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

  // Sync handle drag position with progress state
  useEffect(() => {
    const unsubscribe = handleX.onChange((latestX) => {
      // Only seek when the user is actively dragging the handle
      if (!isDraggingRef.current) return;
      const newProgress = scrubberWidth > 0 ? latestX / scrubberWidth : 0;
      seek(Math.max(0, Math.min(1, newProgress)));
    });
    return () => unsubscribe();
  }, [handleX, scrubberWidth, seek]);

  // --- Event Handlers ---

  const handleScrubberClick = (e: { clientX: number }) => {
    if (!scrubberRef.current) return;
    const scrubberRect = scrubberRef.current.getBoundingClientRect();
    const clickX = e.clientX - scrubberRect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / scrubberWidth));
    seek(newProgress);
  };

  const createVerticalSliderHandler = (
    controlRef: React.RefObject<HTMLDivElement>,
    setter: (value: number) => void,
  ) => {
    return (event: React.MouseEvent<HTMLDivElement>) => {
      const changeValue = (
        e: React.MouseEvent<HTMLDivElement> | MouseEvent,
      ) => {
        if (!controlRef.current) return;
        const rect = controlRef.current.getBoundingClientRect();
        const mouseY = e.clientY;
        const elementY = rect.top;
        const elementHeight = rect.height;
        let percentage = ((mouseY - elementY) / elementHeight) * 100;
        percentage = 100 - percentage; // invert (we want top to be 100%)
        const newValue = Math.max(0, Math.min(100, percentage));
        setter(newValue);
      };

      changeValue(event); // Initial value on click

      const handleMouseMove = (moveEvent: MouseEvent) => {
        changeValue(moveEvent);
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };
  };

  const handleIntensityMouseDown = createVerticalSliderHandler(
    intensityControlRef,
    setIntensity,
  );
  const handleVolumeMouseDown = createVerticalSliderHandler(
    volumeControlRef,
    setVolume,
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
        <FlexBox justifyContent="space-around" width="100%" alignItems="center" clickable>
          <ControlButton onClick={skipBackward}>
            <FaBackwardStep />
          </ControlButton>

          <ScrubberContainer ref={scrubberRef} onClick={handleScrubberClick} clickable>
            {/* SVG container for the wave visuals */}
            <svg
              width={scrubberWidth}
              height="10"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* This clip path reveals the foreground wave based on progress */}
                <clipPath id="progress-clip">
                  <rect ref={clipRectRef} x="0" y="-5" width="0" height="10" />
                </clipPath>
              </defs>

              {/* Background wave (the "unfilled" part) */}
              <path
                ref={backgroundWaveRef}
                stroke={theme.colors.defaultUnselected}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Foreground wave (the "filled" part), clipped by the rect above */}
              <path
                ref={foregroundWaveRef}
                stroke={theme.colors.defaultSelected}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                clipPath="url(#progress-clip)"
              />
            </svg>

            <ScrubberHandle
              drag="x"
              dragConstraints={scrubberRef}
              dragElastic={0}
              dragMomentum={false}
              style={{ x: handleX, y: handleY }}
              onDragStart={() => (isDraggingRef.current = true)}
              onDragEnd={() => (isDraggingRef.current = false)}
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
          onMouseDown={handleIntensityMouseDown}
          intensity={intensity}
        >
          <BsBrightnessHighFill style={{ mixBlendMode: 'difference' }} />
        </MediaControlContainer>
        <MediaControlContainer
          ref={volumeControlRef}
          clickable
          onMouseDown={handleVolumeMouseDown}
          intensity={volume}
        >
          <PiSpeakerSimpleHighFill style={{ mixBlendMode: 'difference' }} />
        </MediaControlContainer>
      </FlexBox>
    </MediaPlayerContainer>
  );
};

export default MediaPlayer;
