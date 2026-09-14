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

const LogoButton = styled.button(({ theme }) => ({
  display: 'flex',
  width: 'auto',
  minHeight: '48px',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 0,
  borderRadius: 0,
  background: 'none',
  appearance: 'none',
  color: 'rgba(255, 255, 255, 0.85)',
  filter: theme.colors.defaultTextFilter,
  fontFamily: 'Orbit',
  fontSize: '2rem',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  pointerEvents: 'auto',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
  '&:focus-visible': {
    outline: `3px solid ${theme.colors.primaryText}`,
    outlineOffset: '3px',
  },
}));

export { Logo, LogoButton };
