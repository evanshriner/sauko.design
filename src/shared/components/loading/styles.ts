import NeonText from '@/shared/styles/NeonText';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const LoadingContainer = styled.div<{
  isBlooming: boolean;
  isFadingOut: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  color: #fff;
  z-index: 999;
  transition:
    filter 0.5s ease-in-out,
    opacity 0.7s ease-out;
  filter: ${({ isBlooming }) =>
    isBlooming ? 'blur(6px) brightness(1.65)' : 'none'};
  opacity: ${({ isFadingOut }) => (isFadingOut ? 0 : 1)};
`;

export const EnterMessage = styled(NeonText)`
  font-size: 2rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #fff;
`;

export const ContentWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 4rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    #loading-screen-sound-selection {
      height: auto;
      justify-content: center;
      align-items: flex-end;
    }
  }
`;

export const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
