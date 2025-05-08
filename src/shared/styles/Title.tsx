import styled from '@emotion/styled';
import NeonText from '@/shared/styles/NeonText';

const Title = styled(NeonText)(({ theme }) => ({
  boxSizing: 'border-box',
  padding: '3rem',
  height: '100%',
  fontSize: '4.5vw',
  fontWeight: '500',
  color: theme.colors.primaryText,
  justifyContent: 'center',
  alignItems: 'center',
}));

export default Title;
