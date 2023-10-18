import styled from '@emotion/styled';
import FlexBox from '../../shared/components/FlexBox';

const Title = styled(FlexBox)(({ theme }) => ({
  boxSizing: 'border-box',
  padding: '3rem',
  fontSize: '4.5vw',
  fontWeight: '500',
  color: theme.colors.primaryText,
  justifyContent: 'center',
  alignItems: 'center',
}));

export default Title;
