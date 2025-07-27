import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const springClick = keyframes`
  0% { transform: scale(1); }
  20% { transform: scale(0.8); }
  40% { transform: scale(1.2); }
  60% { transform: scale(0.9); }
  80% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const pulse = keyframes`
    0% { opacity: 0.73; }
    50% { opacity: 1; }
    100% { opacity: 0.73; }
`;

export const SoundButtonContainer = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  width: 40px;
  height: 40px;

  background-color: ${({ theme }) => theme.colors.defaultText};
  border: 2px solid rgba(255, 255, 255, 0.73);
  filter: url(#neonGlow);

  transition: transform 0.5s ease;
  transform: scale(1);

  svg {
    font-size: 24px;
    color: white;
    mix-blend-mode: difference;
  }

  &:hover {
    transform: scale(1.1);
    animation: ${pulse} 1.5s infinite alternate;
  }

  &:active {
    animation: ${springClick} 0.5s ease-out;
  }
`;
