import styled from '@emotion/styled';
import NeonText from '@/shared/styles/NeonText';

const Logo = styled(NeonText)(() => ({
  fontFamily: 'Orbit',
  alignItems: 'center',
  width: 'auto',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  lineHeight: 1,
}));

export { Logo };
