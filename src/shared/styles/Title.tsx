import styled from '@emotion/styled';
import type { CSSObject } from '@emotion/react';
import NeonText from '@/shared/styles/NeonText';

const Title = styled(NeonText)((): CSSObject => ({
  boxSizing: 'border-box',
  padding: '3rem 0 0',
  height: 'auto',
  fontSize: '4.5rem',
  fontWeight: '400',
  justifyContent: 'flex-start',
  alignItems: 'center',
}));

export default Title;
