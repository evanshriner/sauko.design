import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import FlexBox from '../FlexBox';
import * as C from './constants';

export const MediaPlayerContainer = styled(FlexBox)(() => ({
  backgroundColor: 'transparent',
  borderRadius: '0px',
  padding: C.MEDIA_PLAYER_PADDING,
  maxWidth: C.MEDIA_PLAYER_MAX_WIDTH,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  justifyContent: 'space-around',
  alignItems: 'center',
}));

export const ControlButton = styled(motion.button)(({ theme }) => ({
  background: 'none',
  border: 'none',
  color: theme.colors.defaultText,
  filter: theme.colors.defaultTextFilter,
  fontSize: C.CONTROL_BUTTON_FONT_SIZE,
  cursor: 'pointer',
  padding: C.CONTROL_BUTTON_PADDING,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: `transform ${C.TRANSFORM_TRANSITION_DURATION} ease`,
  transform: C.TRANSFORM_SCALE_DEFAULT,

  [`@keyframes ${C.PULSE_ANIMATION_NAME}`]: {
    '0%': { opacity: 0.73 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0.73 },
  },

  '&:hover': {
    transform: C.TRANSFORM_SCALE_HOVER,
    animation: C.PULSE_ANIMATION,
  },
}));

export const PlayPauseButton = styled(ControlButton)(({ theme }) => ({
  border: `${C.PLAY_PAUSE_BORDER_WIDTH} solid ${theme.colors.defaultText}`,
  display: 'flex',
  fontSize: C.PLAY_PAUSE_BUTTON_FONT_SIZE,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}));

export const PlayPauseIcon = styled(motion.div)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

export const ScrubberContainer = styled(FlexBox)({
  position: 'relative',
  width: '100%',
  height: C.SCRUBBER_HEIGHT,
  marginTop: C.SCRUBBER_MARGIN_TOP,
  cursor: 'pointer',
  alignItems: 'center',
});

export const MediaControlContainer = styled(FlexBox)<{ intensity?: number }>(
  ({ theme, intensity = 0 }) => ({
    backgroundColor: 'transparent',
    borderRadius: '0px',
    flexDirection: 'column',
    color: theme.colors.defaultText,
    padding: '3px',
    height: '100%',
    fontSize: '12px',
    opacity: 0.8,
    border: `${C.PLAY_PAUSE_BORDER_WIDTH} solid ${theme.colors.defaultText}`,
    width: C.CONTROL_CONTAINER_MAX_WIDTH,
    filter: theme.colors.defaultTextFilter,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    background: `linear-gradient(to top, ${theme.colors.defaultText} ${intensity}%, transparent ${intensity}%)`,
    cursor: 'pointer',
  }),
);

export const ScrubberHandle = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  width: C.SCRUBBER_HANDLE_SIZE,
  height: C.SCRUBBER_HANDLE_SIZE,
  backgroundColor: theme.colors.defaultText,
  borderRadius: '50%',
  filter: theme.colors.defaultTextFilter,
  top: '30%', // This remains a bit magic, but it's for visual centering.
  cursor: 'grab',
  boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
  '&:active': {
    cursor: 'grabbing',
  },
}));
