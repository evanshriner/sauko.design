import styled from '@emotion/styled';
import FlexBox from '../../../shared/components/FlexBox';

const MenuItem = styled(FlexBox)(({ theme }) => ({
  color: theme.colors.primaryText,
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '0 0.5rem',
  overflow: 'hidden',
  width: 'auto',
}));

export default MenuItem;
