import styled from '@emotion/styled';
import FlexBox from '../../../shared/components/FlexBox';

const NavBarContainer = styled(FlexBox)({
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  zIndex: 899,
  padding: '20px 5vw 0',
  gap: '32px',
});

export default NavBarContainer;
