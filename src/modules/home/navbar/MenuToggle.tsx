import styled from '@emotion/styled';
import FlexBox from '../../../shared/components/FlexBox';

interface MenuToggleProps {
  onClick: () => void;
}

const MenuToggleContainer = styled(FlexBox)({
  alignItems: 'center',
  justifyContent: 'flex-end',
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const MenuToggleButton = styled('button')({
  display: 'block',
  alignItems: 'center',
  background: 'none',
  border: 'none',
  fontSize: '2rem',
  color: 'white',
});

const MenuToggle = ({ onClick }: MenuToggleProps) => (
  <MenuToggleContainer>
    <MenuToggleButton onClick={onClick}>☰</MenuToggleButton>
  </MenuToggleContainer>
);

export default MenuToggle;
