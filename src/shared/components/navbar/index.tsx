import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Menu from './Menu';
import MenuToggle from './MenuToggle';
import NavBarContainer from './NavBarContainer';
import { Logo } from './Logo';
import { Pages } from '@/shared/interfaces/pages';

const MOBILE_MEDIA_SHEET_ID = 'mobile-media-sheet';

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
  const toggleRef = useRef<HTMLButtonElement>(null);

  const setMenuOpen = useCallback((open: boolean) => {
    menuOpenRef.current = open;
    setShowMenu(open);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, [setMenuOpen]);

  const toggleMenu = useCallback(() => {
    if (menuOpenRef.current) {
      closeMenu();
    } else {
      setMenuOpen(true);
    }
  }, [closeMenu, setMenuOpen]);

  const navigateHome = useCallback(() => {
    closeMenu();
    onMenuItemClick(Pages.Home);
  }, [closeMenu, onMenuItemClick]);

  const mobileToggle = (
    <MenuToggle
      ref={toggleRef}
      isOpen={showMenu}
      onClick={toggleMenu}
      controlsId={MOBILE_MEDIA_SHEET_ID}
    />
  );

  return (
    <NavBarContainer clickable>
      <Logo
        clickable
        onClick={navigateHome}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        disableSelection
      >
        sauko
      </Logo>
      <Menu
        open={showMenu}
        onClose={closeMenu}
        toggleRef={toggleRef}
        id={MOBILE_MEDIA_SHEET_ID}
      />
      {typeof document === 'undefined'
        ? mobileToggle
        : createPortal(mobileToggle, document.body)}
    </NavBarContainer>
  );
}
