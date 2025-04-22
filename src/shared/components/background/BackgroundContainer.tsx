import styled from '@emotion/styled';
import FlexBox from '../../../shared/components/FlexBox';

const BackgroundContainer = styled(FlexBox)({
  height: '100vh',
  zIndex: -1,
  position: 'fixed',
  top: 0,
  left: 0,
});

export default BackgroundContainer;
