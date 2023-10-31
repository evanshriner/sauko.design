import styled from '@emotion/styled';
import FlexBox from '../../../shared/components/FlexBox';

const MenuItem = styled(FlexBox)(({ theme }) => ({
  color: theme.colors.primaryText,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  cursor: 'pointer',
  overflow: 'hidden',
  width: 'fit-content',
}));

export default MenuItem;
