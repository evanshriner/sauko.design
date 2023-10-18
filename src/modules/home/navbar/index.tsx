import FlexBox from '../../../shared/components/FlexBox';
import Menu from './Menu';
import MenuToggle from './MenuToggle';
import NavBarContainer from './NavBarContainer';
import MenuItem from './MenuItem';
import { useState } from 'react';
import Logo from './Logo';

export default function NavBar() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <NavBarContainer>
      <Logo>sauko design</Logo>
      <MenuToggle onClick={toggleMenu}>☰</MenuToggle>
      <Menu show={showMenu}>
        <MenuItem>blog</MenuItem>
        <MenuItem>about</MenuItem>
        <MenuItem>contact</MenuItem>
      </Menu>
    </NavBarContainer>
  );
}
