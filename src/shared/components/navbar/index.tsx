import Menu from './Menu';
import MenuToggle from './MenuToggle';
import NavBarContainer from './NavBarContainer';
import { useState } from 'react';
import { Logo } from './Logo';
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import { Pages } from '@/shared/interfaces/pages';

export interface NavBarProps {
  onMenuItemClick: (menuItem: Pages) => void;
  currentPage: string;
  onHoverChange: (isHovering: boolean) => void;
}

export default function NavBar({
  onMenuItemClick,
  onHoverChange,
}: NavBarProps) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <NavBarContainer>
      <Logo
        onClick={() => onMenuItemClick(Pages.Home)}
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
