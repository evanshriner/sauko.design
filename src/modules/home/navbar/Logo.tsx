import styled from '@emotion/styled';
import FlexBox from '../../../shared/components/FlexBox';

const Logo = styled(FlexBox)(({ theme }) => ({
  color: theme.colors.primaryText,
  fontSize: '1.5rem',
  fontFamily: 'Orbit',
  whiteSpace: 'nowrap',
}));

export default Logo;
