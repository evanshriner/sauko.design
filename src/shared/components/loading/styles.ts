import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

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


export const EnterMessage = styled.p`
  font-size: 2rem;
  cursor: pointer;
  color: #fff;
`;

export const ContentWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
