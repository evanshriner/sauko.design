import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, PanInfo } from 'framer-motion';
import FlexBox from '../FlexBox';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaExternalLinkAlt } from 'react-icons/fa';
import { FaBackwardStep, FaForwardStep } from "react-icons/fa6";
import NeonText from '@/shared/styles/NeonText';



const MediaPlayerContainer = styled(FlexBox)(() => ({
  backgroundColor: 'transparent',
  borderRadius: '0px',
  padding: '8px',
  maxWidth: '600px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  justifyContent: 'space-around',
  alignItems: 'center',
}));


const ControlButton = styled(motion.button)(({theme}) => ({
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

const PlayPauseButton = styled(ControlButton)(({theme}) => ({
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

const ScrubberContainer = styled(FlexBox)(() => ({
  width: '100%',
  backgroundColor: '#333',
  borderRadius: '4px',
  height: '4px',
  overflow: 'hidden',
  cursor: 'pointer',
}));

const ScrubberLine = styled(motion.div)(() => ({
  height: '4px',
  backgroundColor: '#007bff',
  transform: 'translateY(-50%)',
  width: '100%',
}));

const ScrubberHandle = styled(motion.div)(() => ({
  width: '16px',
  height: '16px',
  backgroundColor: 'white',
  borderRadius: '4px',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  cursor: 'grab',
}));

const MediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0.3); // 0 to 1

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const scrubberRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - scrubberRect.left;
    const newProgress = clickX / scrubberRect.width;
    setProgress(newProgress);
  };

  return (
    <MediaPlayerContainer
      justifyContent="space-around"
      alignItems="center"
      gap="16px"
    >
      <PlayPauseButton onClick={togglePlayPause}>
        {isPlaying ? (
          <PlayPauseIcon
            key="pause"
          >
            <FaPause />
          </PlayPauseIcon>
        ) : (
          <PlayPauseIcon
            key="play"
          >
            <FaPlay />
          </PlayPauseIcon>
        )}
      </PlayPauseButton>
      <FlexBox width="100%" flexDirection='column'>
       <NeonText fontSize="14px" justifyContent="center" alignItems="center">
            steady.220 - suralo
            </NeonText>
      <FlexBox justifyContent="space-around" width="100%" alignItems='center'>
        <ControlButton>
          <FaBackwardStep />
        </ControlButton>

       <ScrubberContainer onClick={handleScrubberClick} alignItems="center">
        <ScrubberLine
          style={{ width: `${progress * 100}%` }}
          animate={{
            y: isPlaying ? ["-50%", "-55%", "-45%", "-50%"] : "-50%",
            x: isPlaying ? ["0%", "5%", "-5%", "0%"] : "0%",
            scaleY: isPlaying ? [1, 1.1, 0.9, 1] : 1,
            transition: isPlaying
              ? {
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                }
              : { duration: 0.3 },
          }}
        />
        <ScrubberHandle
          drag="x"
          dragConstraints={{ left: 0, right: 200 - 16 }} // Adjust based on container width
          style={{ x: progress * (200 - 16) }} // Adjust based on container width
          onDragEnd={(event: MouseEvent, info: PanInfo) => {
            const newProgress = info.point.x / (200 - 16); // Adjust based on container width
            setProgress(Math.max(0, Math.min(1, newProgress)));
          }}
        />
      </ScrubberContainer>
        <ControlButton>
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