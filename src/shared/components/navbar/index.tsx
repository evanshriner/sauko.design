import Menu from './Menu';
import MenuToggle from './MenuToggle';
import NavBarContainer from './NavBarContainer';
import MenuItem from './MenuItem';
import { useState } from 'react';
import { Logo } from './Logo';
import NeonText from '../../styles/NeonText';

export type Page = 'home' | 'services' | 'about' | 'contact';
export interface NavBarProps {
  onMenuItemClick: (menuItem: Page) => void;
  currentPage: string;
  onHoverChange: (isHovering: boolean) => void;
}

export default function NavBar({ onMenuItemClick, currentPage, onHoverChange }: NavBarProps) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <NavBarContainer>
      <Logo onClick={() => onMenuItemClick('home')} onMouseEnter={() => onHoverChange(true)} onMouseLeave={() => onHoverChange(false)}>sauko</Logo>
      <MenuToggle onClick={toggleMenu} />
      <Menu show={showMenu}>
        <MenuItem onClick={() => onMenuItemClick('services')} onMouseEnter={() => onHoverChange(true)} onMouseLeave={() => onHoverChange(false)}>
          <NeonText fontSize="1rem" darken={currentPage !== 'services'}>
            services
          </NeonText>
        </MenuItem>
        <MenuItem onClick={() => onMenuItemClick('about')} onMouseEnter={() => onHoverChange(true)} onMouseLeave={() => onHoverChange(false)}>
          <NeonText fontSize="1rem" darken={currentPage !== 'about'}>
            about
          </NeonText>
        </MenuItem>
        <MenuItem onClick={() => onMenuItemClick('contact')} onMouseEnter={() => onHoverChange(true)} onMouseLeave={() => onHoverChange(false)}>
          <NeonText fontSize="1rem" darken={currentPage !== 'contact'}>
            contact
          </NeonText>
        </MenuItem>
      </Menu>
    </NavBarContainer>
  );
}
