import styled from '@emotion/styled';
import FlexBox from '../../shared/components/FlexBox';

const Title = styled(FlexBox)(({ theme }) => ({
  boxSizing: 'border-box',
  padding: '3rem',
  fontSize: '3.5vw',
  fontWeight: '400',
  color: theme.colors.primaryText,
  justifyContent: 'center',
  alignItems: 'center',
}));

export default Title;
