import NeonText from '@/shared/styles/NeonText';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

export const LoadingContainer = styled.div<{ isStarted: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  color: #fff;
  z-index: 999;
  animation: ${({ isStarted }) => (isStarted ? fadeOut : 'none')} 0.5s forwards;
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
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const ProgressText = styled.span`
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 10px;
  color: #fff;
  margin-left: 10px;
`;

export const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
