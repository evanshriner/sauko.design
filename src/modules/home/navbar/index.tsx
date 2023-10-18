import Menu from './Menu';
import MenuToggle from './MenuToggle';
import NavBarContainer from './NavBarContainer';
import MenuItem from './MenuItem';
import { useState } from 'react';
import Logo from './Logo';
import FlexBox from '../../../shared/components/FlexBox';

export default function NavBar() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <NavBarContainer>
      <Logo>sauko</Logo>
      <MenuToggle onClick={toggleMenu} />
      <Menu show={showMenu}>
        <MenuItem>blog</MenuItem>
        <MenuItem>about</MenuItem>
        <MenuItem>contact</MenuItem>
      </Menu>
    </NavBarContainer>
  );
}
