import styled from '@emotion/styled';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { type RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import FlexBox from '../FlexBox';
import MediaPlayer from '../MediaPlayer/MediaPlayer';

const MOBILE_BREAKPOINT = '(max-width: 768px)';
const DESKTOP_BREAKPOINT = '(min-width: 769px)';
const MOTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export interface MenuProps {
  open: boolean;
  onClose: () => void;
  toggleRef: RefObject<HTMLButtonElement>;
  id: string;
}

const DesktopMenu = styled(FlexBox)({
  justifyContent: 'flex-end',
  gap: '1.75rem',
  '@media (max-width: 768px)': {
    display: 'none',
  },
});

const MobileBackdrop = styled(motion.div)({
  position: 'fixed',
  inset: 0,
  zIndex: 900,
  backgroundColor: 'rgba(4, 4, 3, 0.64)',
  backdropFilter: 'blur(3px)',
  WebkitBackdropFilter: 'blur(3px)',
  pointerEvents: 'auto',
  touchAction: 'none',
  '@media (min-width: 769px)': {
    display: 'none',
  },
});

const MobileSheet = styled(motion.section)(({ theme }) => ({
  position: 'fixed',
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 901,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxHeight: 'calc(100dvh - 5.25rem)',
  boxSizing: 'border-box',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  WebkitOverflowScrolling: 'touch',
  padding:
    '1.25rem max(1rem, env(safe-area-inset-right)) max(1.25rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left))',
  border: 0,
  borderTop: '1px solid rgba(241, 237, 232, 0.15)',
  borderRadius: 0,
  backgroundColor: 'rgba(13, 13, 12, 0.9)',
  color: theme.colors.primaryText,
  backdropFilter: 'blur(20px) saturate(0.85)',
  WebkitBackdropFilter: 'blur(20px) saturate(0.85)',
  pointerEvents: 'auto',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.primaryText}`,
    outlineOffset: '-3px',
  },
  '@media (min-width: 769px)': {
    display: 'none',
  },
}));

const getFocusableElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => {
      const style = window.getComputedStyle(element);
      return (
        !element.matches(':disabled') &&
        element.getAttribute('aria-hidden') !== 'true' &&
        style.display !== 'none' &&
        style.visibility !== 'hidden'
      );
    },
  );

const Menu = ({ open, onClose, toggleRef, id }: MenuProps) => {
  const prefersReducedMotion = useReducedMotion();
  const sheetRef = useRef<HTMLElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;

    const desktopQuery = window.matchMedia(DESKTOP_BREAKPOINT);
    const closeAtDesktop = () => {
      if (desktopQuery.matches) onClose();
    };

    closeAtDesktop();
    desktopQuery.addEventListener('change', closeAtDesktop);
    return () => desktopQuery.removeEventListener('change', closeAtDesktop);
  }, [onClose, open]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = Math.max(
      0,
      window.innerWidth - document.documentElement.clientWidth,
    );
    const computedPaddingRight =
      Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;

    const focusFrame = window.requestAnimationFrame(() => {
      const sheet = sheetRef.current;
      if (!sheet) return;

      const firstFocusableElement = getFocusableElements(sheet)[0];
      (firstFocusableElement ?? sheet).focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [open]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return;

    const containFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const sheet = sheetRef.current;
      if (!sheet) return;

      const focusableElements = getFocusableElements(sheet);
      if (focusableElements.length === 0) {
        event.preventDefault();
        sheet.focus({ preventScroll: true });
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (
        event.shiftKey &&
        (activeElement === firstFocusableElement ||
          activeElement === sheet ||
          !sheet.contains(activeElement))
      ) {
        event.preventDefault();
        lastFocusableElement.focus({ preventScroll: true });
      } else if (
        !event.shiftKey &&
        (activeElement === lastFocusableElement || !sheet.contains(activeElement))
      ) {
        event.preventDefault();
        firstFocusableElement.focus({ preventScroll: true });
      }
    };

    document.addEventListener('keydown', containFocus, true);
    return () => document.removeEventListener('keydown', containFocus, true);
  }, [onClose, open]);

  const returnFocusToToggle = () => {
    if (
      openRef.current ||
      typeof window === 'undefined' ||
      !window.matchMedia(MOBILE_BREAKPOINT).matches
    ) {
      return;
    }

    toggleRef.current?.focus({ preventScroll: true });
  };

  const backdropTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: MOTION_EASE };
  const backdropExitTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: MOTION_EASE };
  const sheetTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.33, ease: MOTION_EASE };
  const sheetExitTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.21, ease: MOTION_EASE };
  const sheetExit = prefersReducedMotion
    ? { opacity: 0, transition: sheetExitTransition }
    : {
        opacity: 0,
        y: '2rem',
        transition: sheetExitTransition,
      };

  return (
    <>
      <DesktopMenu clickable>
        <MediaPlayer />
      </DesktopMenu>
      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence
              initial={false}
              onExitComplete={returnFocusToToggle}
            >
              {open && (
                <MobileBackdrop
                  key="mobile-media-backdrop"
                  aria-hidden="true"
                  onPointerDown={onClose}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: backdropExitTransition,
                  }}
                  transition={backdropTransition}
                />
              )}
              {open && (
                <MobileSheet
                  key="mobile-media-sheet"
                  ref={sheetRef}
                  id={id}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Quick controls"
                  tabIndex={-1}
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, y: '3rem' }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={sheetExit}
                  transition={sheetTransition}
                >
                  <MediaPlayer variant="mobile" />
                </MobileSheet>
              )}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
};

export default Menu;

