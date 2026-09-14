import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import Menu, { DesktopMediaMenu } from './Menu';
import MenuToggle from './MenuToggle';
import NavBarContainer from './NavBarContainer';
import { LogoButton } from './Logo';
import { Pages } from '@/shared/interfaces/pages';

export const FLOATING_NAVIGATION_ROOT_ID = 'floating-navigation-root';

const MOBILE_MEDIA_SHEET_ID = 'mobile-media-sheet';
const NAVIGATION_REVEAL_SCROLL_Y = 96;
const DIRECTION_ACTIVATION_DISTANCE = 10;
const MOTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MOTION_EXIT_EASE: [number, number, number, number] = [0.7, 0, 0.84, 0];

const useDirectionalNavigation = () => {
  const [showFloatingNavigation, setShowFloatingNavigation] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let previousScrollY = Math.max(0, window.scrollY);
    let accumulatedDistance = 0;
    let currentDirection: -1 | 0 | 1 = 0;

    const handleScroll = () => {
      const nextScrollY = Math.max(0, window.scrollY);
      const delta = nextScrollY - previousScrollY;

      if (nextScrollY <= NAVIGATION_REVEAL_SCROLL_Y) {
        accumulatedDistance = 0;
        currentDirection = 0;
        setShowFloatingNavigation(false);
      } else if (Math.abs(delta) >= 1) {
        const nextDirection = delta > 0 ? 1 : -1;
        accumulatedDistance =
          nextDirection === currentDirection
            ? accumulatedDistance + Math.abs(delta)
            : Math.abs(delta);
        currentDirection = nextDirection;

        if (accumulatedDistance >= DIRECTION_ACTIVATION_DISTANCE) {
          setShowFloatingNavigation(nextDirection < 0);
          accumulatedDistance = 0;
        }
      }

      previousScrollY = nextScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return showFloatingNavigation;
};

export interface NavBarProps {
  onMenuItemClick: (menuItem: Pages) => void;
  onHoverChange: (isHovering: boolean) => void;
}

export default function NavBar({
  onMenuItemClick,
  onHoverChange,
}: NavBarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuOpenRef = useRef(false);
  const returnFocusToggleRef = useRef<HTMLButtonElement | null>(null);
  const showFloatingNavigation = useDirectionalNavigation();
  const prefersReducedMotion = useReducedMotion();

  const setMenuOpen = useCallback((open: boolean) => {
    menuOpenRef.current = open;
    setShowMenu(open);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, [setMenuOpen]);

  const toggleMenu = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (menuOpenRef.current) {
        closeMenu();
      } else {
        returnFocusToggleRef.current = event.currentTarget;
        setMenuOpen(true);
      }
    },
    [closeMenu, setMenuOpen],
  );

  const navigateHome = useCallback(() => {
    closeMenu();
    onMenuItemClick(Pages.Home);
  }, [closeMenu, onMenuItemClick]);

  useEffect(() => {
    if (!showFloatingNavigation) onHoverChange(false);
  }, [onHoverChange, showFloatingNavigation]);

  const renderNavigationContent = (floating: boolean) => (
    <>
      <LogoButton
        type="button"
        onClick={navigateHome}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        aria-label="Go to Sauko home"
      >
        sauko
      </LogoButton>
      {floating ? (
        <DesktopMediaMenu />
      ) : (
        <Menu
          open={showMenu}
          onClose={closeMenu}
          toggleRef={returnFocusToggleRef}
          id={MOBILE_MEDIA_SHEET_ID}
        />
      )}
      <MenuToggle
        isOpen={showMenu}
        onClick={toggleMenu}
        controlsId={MOBILE_MEDIA_SHEET_ID}
      />
    </>
  );

  const floatingNavigationRoot =
    typeof document === 'undefined'
      ? null
      : document.getElementById(FLOATING_NAVIGATION_ROOT_ID);

  return (
    <>
      <NavBarContainer
        aria-label="Primary navigation and media controls"
        data-navigation="primary"
      >
        {renderNavigationContent(false)}
      </NavBarContainer>
      {floatingNavigationRoot &&
        createPortal(
          <AnimatePresence>
            {showFloatingNavigation && (
              <NavBarContainer
                key="floating-navigation"
                $floating
                aria-label="Quick navigation and media controls"
                data-navigation="floating"
                initial={prefersReducedMotion ? false : { y: '-100%' }}
                animate={{ y: 0 }}
                exit={{
                  y: '-100%',
                  transition: {
                    duration: prefersReducedMotion ? 0 : 0.28,
                    ease: MOTION_EXIT_EASE,
                  },
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.34,
                  ease: MOTION_EASE,
                }}
              >
                {renderNavigationContent(true)}
              </NavBarContainer>
            )}
          </AnimatePresence>,
          floatingNavigationRoot,
        )}
      {showMenu &&
        typeof document !== 'undefined' &&
        createPortal(
          <MenuToggle
            overlay
            isOpen
            onClick={toggleMenu}
            controlsId={MOBILE_MEDIA_SHEET_ID}
          />,
          document.body,
        )}
    </>
  );
}
