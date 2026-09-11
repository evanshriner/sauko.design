import styled from '@emotion/styled';
import FlexBox from '../../../shared/components/FlexBox';

const NavBarContainer = styled(FlexBox)({
  position: 'relative',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  zIndex: 899,
  minHeight: '68px',
  padding: '20px 5vw 0',
  gap: '32px',
});

export default NavBarContainer;
