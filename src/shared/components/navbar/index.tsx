import Menu from './Menu';
import MenuToggle from './MenuToggle';
import NavBarContainer from './NavBarContainer';
import MenuItem from './MenuItem';
import { useState } from 'react';
import Logo from './Logo';

export default function NavBar({ onMenuItemClick }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <NavBarContainer>
      <Logo>sauko</Logo>
      <MenuToggle onClick={toggleMenu} />
      <Menu show={showMenu}>
        <MenuItem className="menu-item" onClick={() => onMenuItemClick('Blog')}>
          blog
        </MenuItem>
        <MenuItem
          className="menu-item"
          onClick={() => onMenuItemClick('About')}
        >
          about
        </MenuItem>
        <MenuItem
          className="menu-item"
          onClick={() => onMenuItemClick('Contact')}
        >
          contact
        </MenuItem>
      </Menu>
    </NavBarContainer>
  );
}
