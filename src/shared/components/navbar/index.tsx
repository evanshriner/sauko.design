import Menu from './Menu';
import MenuToggle from './MenuToggle';
import NavBarContainer from './NavBarContainer';
import MenuItem from './MenuItem';
import { useState } from 'react';
import { Logo, NeonText } from './Logo';

export type Page = 'home' | 'services' | 'about' | 'contact';
export interface NavBarProps {
  onMenuItemClick: (menuItem: Page) => void;
  currentPage: string;
}

export default function NavBar({ onMenuItemClick, currentPage }: NavBarProps) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <NavBarContainer>
      <Logo onClick={() => onMenuItemClick('home')}>sauko</Logo>
      <MenuToggle onClick={toggleMenu} />
      <Menu show={showMenu}>
        <MenuItem onClick={() => onMenuItemClick('services')}>
          <NeonText fontSize="1rem" darken={currentPage !== 'services'}>
            services
          </NeonText>
        </MenuItem>
        <MenuItem onClick={() => onMenuItemClick('about')}>
          <NeonText fontSize="1rem" darken={currentPage !== 'about'}>
            about
          </NeonText>
        </MenuItem>
        <MenuItem onClick={() => onMenuItemClick('contact')}>
          <NeonText fontSize="1rem" darken={currentPage !== 'contact'}>
            contact
          </NeonText>
        </MenuItem>
      </Menu>
    </NavBarContainer>
  );
}
