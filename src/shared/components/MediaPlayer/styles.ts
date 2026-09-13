import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import FlexBox from '../FlexBox';
import * as C from './constants';

type PlayerVariant = 'desktop' | 'mobile';
type ControlOrientation = 'vertical' | 'horizontal';

interface VariantProps {
  $variant?: PlayerVariant;
}

interface OrientationProps {
  $orientation?: ControlOrientation;
}

export const MediaPlayerContainer = styled(FlexBox)<VariantProps>(
  ({ $variant = 'desktop' }) => ({
    backgroundColor: 'transparent',
    borderRadius: '0px',
    padding: C.MEDIA_PLAYER_PADDING,
    maxWidth: C.MEDIA_PLAYER_MAX_WIDTH,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    justifyContent: 'space-around',
    alignItems: 'center',
    ...($variant === 'mobile' && {
      width: '100%',
      minWidth: 0,
      maxWidth: '100%',
      padding: C.MOBILE_PLAYER_PADDING,
      gap: C.MOBILE_PLAYER_GAP,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      boxShadow: 'none',
      overflowX: 'hidden',
      '@media (max-width: 360px)': {
        padding: '16px',
        gap: '14px',
      },
      '@media (max-height: 540px) and (orientation: landscape)': {
        padding: '10px 16px',
        gap: '8px',
      },
    }),
  }),
);

export const ControlButton = styled(motion.button)<VariantProps>(
  ({ theme, $variant = 'desktop' }) => ({
    background: 'none',
    border: 'none',
    borderRadius: 0,
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
    '&:focus-visible': {
      outline: `2px solid ${theme.colors.defaultSelected}`,
      outlineOffset: '2px',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover, &:active': {
        transform: C.TRANSFORM_SCALE_DEFAULT,
        animation: 'none',
      },
    },
    ...($variant === 'mobile' && {
      minWidth: C.MOBILE_TOUCH_TARGET,
      minHeight: C.MOBILE_TOUCH_TARGET,
      padding: '10px',
      touchAction: 'manipulation',
      WebkitTapHighlightColor: 'transparent',
      transition: `transform 220ms cubic-bezier(0.16, 1, 0.3, 1), color 220ms cubic-bezier(0.16, 1, 0.3, 1)`,
      '@media (hover: none)': {
        '&:hover': {
          transform: C.TRANSFORM_SCALE_DEFAULT,
          animation: 'none',
        },
        '&:active': {
          color: theme.colors.defaultSelected,
          transform: 'scale(0.96)',
        },
      },
    }),
  }),
);

export const PlayPauseButton = styled(ControlButton)<VariantProps>(
  ({ theme, $variant = 'desktop' }) => ({
    border: `${C.PLAY_PAUSE_BORDER_WIDTH} solid ${theme.colors.defaultText}`,
    display: 'flex',
    fontSize: C.PLAY_PAUSE_BUTTON_FONT_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...($variant === 'mobile' && {
      width: C.MOBILE_PLAY_PAUSE_SIZE,
      height: C.MOBILE_PLAY_PAUSE_SIZE,
      minWidth: C.MOBILE_PLAY_PAUSE_SIZE,
      minHeight: C.MOBILE_PLAY_PAUSE_SIZE,
      borderWidth: '1px',
      fontSize: '1rem',
      '@media (max-height: 540px) and (orientation: landscape)': {
        width: C.MOBILE_TOUCH_TARGET,
        height: C.MOBILE_TOUCH_TARGET,
        minWidth: C.MOBILE_TOUCH_TARGET,
        minHeight: C.MOBILE_TOUCH_TARGET,
      },
    }),
  }),
);

export const PlayPauseIcon = styled(motion.div)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
});

export const ScrubberContainer = styled(FlexBox)<VariantProps>(
  ({ theme, $variant = 'desktop' }) => ({
    position: 'relative',
    width: '100%',
    height: C.SCRUBBER_HEIGHT,
    marginTop: C.SCRUBBER_MARGIN_TOP,
    cursor: 'pointer',
    alignItems: 'center',
    outline: 'none',
    '&:focus-visible': {
      outline: `2px solid ${theme.colors.defaultSelected}`,
      outlineOffset: '2px',
    },
    ...($variant === 'mobile' && {
      minWidth: 0,
      height: C.MOBILE_TOUCH_TARGET,
      minHeight: C.MOBILE_TOUCH_TARGET,
      marginTop: 0,
      touchAction: 'pan-y',
      WebkitTapHighlightColor: 'transparent',
      '&[aria-disabled="true"]': {
        cursor: 'default',
        opacity: 0.72,
      },
    }),
  }),
);

export const MediaControlContainer = styled(FlexBox)<OrientationProps>(
  ({ theme, $orientation = 'vertical' }) => ({
    position: 'relative',
    overflow: 'hidden',
    isolation: 'isolate',
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
    cursor: 'pointer',
    touchAction: 'none',
    outline: 'none',
    '&:focus-visible': {
      outline: `2px solid ${theme.colors.defaultSelected}`,
      outlineOffset: '2px',
    },
    ...($orientation === 'horizontal' && {
      boxSizing: 'border-box',
      width: '100%',
      minWidth: 0,
      maxWidth: 'none',
      height: C.MOBILE_LEVEL_CONTROL_HEIGHT,
      minHeight: C.MOBILE_LEVEL_CONTROL_HEIGHT,
      padding: '0 14px',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      borderWidth: '1px',
      boxShadow: 'none',
      opacity: 0.86,
      touchAction: 'pan-y',
      WebkitTapHighlightColor: 'transparent',
    }),
  }),
);

export const MediaControlFill = styled(motion.div)<OrientationProps>(
  ({ theme, $orientation = 'vertical' }) => ({
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    backgroundColor: theme.colors.defaultText,
    transformOrigin: $orientation === 'horizontal' ? 'left' : 'bottom',
    pointerEvents: 'none',
  }),
);

export const MediaControlIcon = styled.div({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  mixBlendMode: 'difference',
  pointerEvents: 'none',
});

export const ScrubberHandle = styled(motion.div)<VariantProps>(
  ({ theme, $variant = 'desktop' }) => ({
    position: 'absolute',
    width: C.SCRUBBER_HANDLE_SIZE,
    height: C.SCRUBBER_HANDLE_SIZE,
    backgroundColor: theme.colors.defaultText,
    borderRadius: '50%',
    filter: theme.colors.defaultTextFilter,
    top: '30%',
    cursor: 'grab',
    boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
    '&:active': {
      cursor: 'grabbing',
    },
    ...($variant === 'mobile' && {
      top: `calc(50% - ${Number(C.WAVE_SVG_HEIGHT) / 2}px)`,
    }),
  }),
);

export const MobileTrackInfo = styled.div(({ theme }) => ({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '4px',
  color: theme.colors.defaultText,
  '@media (max-height: 540px) and (orientation: landscape)': {
    gap: '2px',
  },
}));

export const MobileTrackTitle = styled.div(({ theme }) => ({
  display: '-webkit-box',
  minWidth: 0,
  overflow: 'hidden',
  color: theme.colors.defaultSelected,
  fontFamily: "'Inclusive Sans', sans-serif",
  fontSize: 'clamp(1.1rem, 5.2vw, 1.35rem)',
  fontWeight: 400,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  overflowWrap: 'anywhere',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  '@media (max-height: 540px) and (orientation: landscape)': {
    display: 'block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: '1.05rem',
  },
}));

export const MobileTrackArtist = styled.div(({ theme }) => ({
  minWidth: 0,
  overflow: 'hidden',
  color: theme.colors.defaultText,
  fontFamily: "'Rubik', sans-serif",
  fontSize: '0.82rem',
  fontWeight: 300,
  lineHeight: 1.35,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));

export const MobileScrubberBlock = styled.div({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '2px',
});

export const MobileTimeRow = styled.div(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  color: theme.colors.defaultText,
  fontFamily: "'Orbit', sans-serif",
  fontSize: '0.625rem',
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.08em',
  lineHeight: 1.2,
  opacity: 0.78,
}));

export const MobileTransport = styled.div({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 'clamp(20px, 10vw, 42px)',
  '@media (max-height: 540px) and (orientation: landscape)': {
    gap: '32px',
  },
});

export const MobileLevelControls = styled.div({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '12px',
  '@media (max-height: 540px) and (orientation: landscape)': {
    gap: '6px',
  },
});

export const MobileLevelControl = styled.div({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '6px',
  '@media (max-height: 540px) and (orientation: landscape)': {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
  },
});

export const MobileLevelMeta = styled.div(({ theme }) => ({
  display: 'flex',
  minWidth: 0,
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: '12px',
  color: theme.colors.defaultText,
  fontFamily: "'Orbit', sans-serif",
  fontSize: '0.625rem',
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.08em',
  lineHeight: 1.2,
  textTransform: 'uppercase',
  '@media (max-height: 540px) and (orientation: landscape)': {
    flex: '0 0 clamp(128px, 24vw, 156px)',
  },
}));
