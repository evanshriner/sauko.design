import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface NavBarContainerProps {
  $floating?: boolean;
}

const NavBarContainer = styled(motion.nav, {
  shouldForwardProp: (property) => property !== '$floating',
})<NavBarContainerProps>(({ $floating = false }) => ({
  position: $floating ? 'fixed' : 'relative',
  inset: $floating ? '0 0 auto' : 'auto',
  zIndex: 899,
  isolation: 'isolate',
  display: 'flex',
  width: '100%',
  maxWidth: '100%',
  minHeight: $floating ? '66px' : '68px',
  boxSizing: 'border-box',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '32px',
  padding: $floating ? '0 5vw' : '20px 5vw 0',
  border: 0,
  borderBottom: $floating ? '1px solid rgba(241, 237, 232, 0.15)' : 0,
  backgroundColor: $floating ? 'rgba(13, 13, 12, 0.22)' : 'transparent',
  backdropFilter: $floating ? 'blur(18px) saturate(0.72)' : 'none',
  WebkitBackdropFilter: $floating ? 'blur(18px) saturate(0.72)' : 'none',
  pointerEvents: 'auto',
  transformOrigin: 'top center',
  '@media (max-width: 768px)': {
    minHeight: $floating ? '64px' : '68px',
    gap: '16px',
    padding: $floating ? '8px 5vw' : '20px 5vw 0',
  },
}));

export default NavBarContainer;
