import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  from { opacity: 0.5; }
  to { opacity: 0.8; }
`;

const springClick = keyframes`
  0% { transform: scale(1); }
  20% { transform: scale(0.8); }
  40% { transform: scale(1.2); }
  60% { transform: scale(0.9); }
  80% { transform: scale(1.1); }
  100% { transform: scale(1); }
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
    transform: scale(1.2);
  }

  &:active {
    animation: ${springClick} 0.5s ease-out;
  }
`;
