import styled from '@emotion/styled';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { forwardRef } from 'react';
import { LuAudioLines, LuChevronDown } from 'react-icons/lu';

const MOTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export interface MenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
  controlsId: string;
}

const MenuToggleContainer = styled('div')({
  position: 'fixed',
  top: '20px',
  right: '5vw',
  zIndex: 902,
  display: 'flex',
  width: '48px',
  height: '48px',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'auto',
  '@media (min-width: 769px)': {
    display: 'none',
  },
});

const MenuToggleButton = styled('button', {
  shouldForwardProp: (property) => property !== '$isOpen',
})<{ $isOpen: boolean }>(({ theme, $isOpen }) => ({
  position: 'relative',
  display: 'flex',
  width: '48px',
  height: '48px',
  boxSizing: 'border-box',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: `1px solid ${
    $isOpen ? 'rgba(224, 207, 173, 0.38)' : 'rgba(241, 237, 232, 0.15)'
  }`,
  borderRadius: 0,
  backgroundColor: $isOpen
    ? 'rgba(13, 13, 12, 0.82)'
    : 'rgba(13, 13, 12, 0.28)',
  color: $isOpen ? theme.colors.defaultSelected : theme.colors.defaultText,
  filter: theme.colors.defaultTextFilter,
  fontSize: '1.65rem',
  lineHeight: 1,
  cursor: 'pointer',
  pointerEvents: 'auto',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
  transition:
    'color 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
  '&:focus-visible': {
    outline: `3px solid ${theme.colors.primaryText}`,
    outlineOffset: '3px',
  },
  '&:active': {
    transform: 'scale(0.96)',
  },
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover': {
      borderColor: 'rgba(224, 207, 173, 0.38)',
      backgroundColor: 'rgba(13, 13, 12, 0.64)',
    },
  },
  '@media (prefers-reduced-motion: reduce)': {
    transitionDuration: '0.01ms',
    '&:active': {
      transform: 'none',
    },
  },
}));

const IconSlot = styled(motion.span)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const MenuToggle = forwardRef<HTMLButtonElement, MenuToggleProps>(
  function MenuToggle({ isOpen, onClick, controlsId }, ref) {
    const prefersReducedMotion = useReducedMotion();
    const iconTransition = prefersReducedMotion
      ? { duration: 0 }
      : { duration: isOpen ? 0.26 : 0.2, ease: MOTION_EASE };

    return (
      <MenuToggleContainer>
        <MenuToggleButton
          ref={ref}
          type="button"
          $isOpen={isOpen}
          onClick={onClick}
          aria-label={isOpen ? 'Close media controls' : 'Open media controls'}
          aria-expanded={isOpen}
          aria-controls={controlsId}
        >
          <AnimatePresence initial={false}>
            <IconSlot
              key={isOpen ? 'close' : 'open'}
              aria-hidden="true"
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, y: isOpen ? -5 : 5, scale: 0.9 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: isOpen ? 5 : -5, scale: 0.9 }
              }
              transition={iconTransition}
            >
              {isOpen ? <LuChevronDown /> : <LuAudioLines />}
            </IconSlot>
          </AnimatePresence>
        </MenuToggleButton>
      </MenuToggleContainer>
    );
  },
);

export default MenuToggle;
