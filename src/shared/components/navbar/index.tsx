import Menu from './Menu';
import MenuToggle from './MenuToggle';
import NavBarContainer from './NavBarContainer';
import { useState } from 'react';
import { Logo } from './Logo';
import MediaPlayer from '../MediaPlayer/MediaPlayer';

export type Page = 'home' | 'services' | 'about' | 'contact';
export interface NavBarProps {
  onMenuItemClick: (menuItem: Page) => void;
  currentPage: string;
  onHoverChange: (isHovering: boolean) => void;
}

export default function NavBar({
  onMenuItemClick,
  currentPage,
  onHoverChange,
}: NavBarProps) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <NavBarContainer>
      <Logo
        onClick={() => onMenuItemClick('home')}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        disableSelection
      >
        sauko
      </Logo>
      <MenuToggle onClick={toggleMenu} />
      <Menu show={showMenu}>
        <MediaPlayer />
      </Menu>
    </NavBarContainer>
  );
}
