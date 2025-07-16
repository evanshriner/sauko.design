import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useTheme } from '@emotion/react';
import FlexBox from '../FlexBox';
import { FaPlay, FaPause, FaExternalLinkAlt } from 'react-icons/fa';
import { FaBackwardStep, FaForwardStep } from 'react-icons/fa6';
import NeonText from '@/shared/styles/NeonText';
import { useMediaPlayer } from '@/shared/hooks/useMediaPlayer';

const MediaPlayerContainer = styled(FlexBox)(() => ({
  backgroundColor: 'transparent',
  borderRadius: '0px',
  padding: '8px',
  maxWidth: '500px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  justifyContent: 'space-around',
  alignItems: 'center',
}));

const ControlButton = styled(motion.button)(({ theme }) => ({
  background: 'none',
  border: 'none',
  color: theme.colors.defaultText,
  filter: theme.colors.defaultTextFilter,
  fontSize: '1rem',
  cursor: 'pointer',
  padding: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.5s ease',
  transform: 'scale(1)',

  '@keyframes pulse': {
    '0%': {
      opacity: 0.73,
    },
    '50%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0.73,
    },
  },

  '&:hover': {
    transform: 'scale(1.2)',
    animation: 'pulse 1.5s infinite alternate',
  },
}));

const PlayPauseButton = styled(ControlButton)(({ theme }) => ({
  border: `2px solid ${theme.colors.defaultText}`,
  display: 'flex',
  fontSize: '0.9rem',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}));

const PlayPauseIcon = styled(motion.div)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
}));

const ScrubberContainer = styled(FlexBox)({
  position: 'relative',
  width: '100%',
  height: '24px',
  marginTop: '9px',
  cursor: 'pointer',
  alignItems: 'center',
  // Padding provides space so the handle doesn't overlap the container edges
});

const ScrubberHandle = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  width: '14px',
  height: '14px',
  backgroundColor: `${theme.colors.defaultText}`,
  borderRadius: '50%',
  filter: theme.colors.defaultTextFilter,
  top: '30%',
  cursor: 'grab',
  boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
  '&:active': {
    cursor: 'grabbing',
  },
}));

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
  } = useMediaPlayer();

  const [scrubberWidth, setScrubberWidth] = useState(0);

  const scrubberRef = useRef<HTMLDivElement>(null);
  const handleX = useMotionValue(0);
  const handleY = useMotionValue(0);

  const foregroundWaveRef = useRef<SVGPathElement>(null);
  const backgroundWaveRef = useRef<SVGPathElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const timeRef = useRef(0);

  useAnimationFrame((time, delta) => {
    // Only animate the wave if playing
    if (isPlaying) {
      timeRef.current += delta / 1500; // Adjust divisor to control speed
    }

    if (
      !foregroundWaveRef.current ||
      !backgroundWaveRef.current ||
      scrubberWidth === 0
    )
      return;

    const amplitude = 3.5; // Wave height
    const frequency = 5; // Number of full waves across the scrubber

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
    const handleYOffset = Math.sin(handleAngle) * amplitude * 1.1; // Slightly larger amplitude for handle

    // Set Y value: wave offset - half handle height to center the handle on the wave
    handleY.set(handleYOffset - 7); // 14px handle height / 2 = 8
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
      const newProgress = scrubberWidth > 0 ? latestX / scrubberWidth : 0;
      seek(Math.max(0, Math.min(1, newProgress)));
    });
    return () => unsubscribe();
  }, [handleX, scrubberWidth, seek]);

  // Sync progress state with visual elements (handle and clip path)
  useEffect(() => {
    // TODO: this is the issue right here
    const newX = progress * scrubberWidth;
    handleX.set(newX);
    if (clipRectRef.current) {
      clipRectRef.current.setAttribute('width', String(newX));
    }
  }, [progress, scrubberWidth, handleX]);

  // --- Event Handlers ---

  const handleScrubberClick = (e: { clientX: number }) => {
    if (!scrubberRef.current) return;
    const scrubberRect = scrubberRef.current.getBoundingClientRect();
    const clickX = e.clientX - scrubberRect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / scrubberWidth));
    seek(newProgress);
  };

  const currentTrack =
    currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  return (
    <MediaPlayerContainer
      justifyContent="space-around"
      alignItems="center"
      gap="16px"
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
        <NeonText fontSize="14px" justifyContent="center" alignItems="center">
          {currentTrack
            ? `${currentTrack.title} | ${currentTrack.artist}`
            : 'No track loaded'}
        </NeonText>
        <FlexBox justifyContent="space-around" width="100%" alignItems="center">
          <ControlButton onClick={skipBackward}>
            <FaBackwardStep />
          </ControlButton>

          <ScrubberContainer ref={scrubberRef} onClick={handleScrubberClick}>
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
            />
          </ScrubberContainer>

          <ControlButton onClick={skipForward}>
            <FaForwardStep />
          </ControlButton>
        </FlexBox>
      </FlexBox>
      <ControlButton>
        <FaExternalLinkAlt />
      </ControlButton>
    </MediaPlayerContainer>
  );
};

export default MediaPlayer;
