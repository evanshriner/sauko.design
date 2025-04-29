import styled from '@emotion/styled';
import FlexBox from '../../../shared/components/FlexBox';

const NavBarContainer = styled(FlexBox)({
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  zIndex: 1000,
  position: 'fixed',
  padding: '2rem 6rem 0',
});

export default NavBarContainer;
