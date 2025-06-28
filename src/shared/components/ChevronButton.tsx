import React from 'react';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import FlexBox from './FlexBox';
import styled from '@emotion/styled';

interface ChevronButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  size?: number;
  color?: string;
}

const StyledChevronButton = styled(FlexBox)`
  cursor: pointer;
  width: auto;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  background-color: transparent;
  transition: transform 0.5s ease;
  transform: scale(1);

  @keyframes pulse {
    0% {
      opacity: 0.73;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.73;
    }
  }

  &:hover {
    transform: scale(1.2);
    animation: pulse 1.5s infinite alternate;
  }
`;

export const ChevronButton: React.FC<ChevronButtonProps> = ({
  direction,
  onClick,
  size = 78,
}) => {
  const Icon = direction === 'left' ? MdChevronLeft : MdChevronRight;
  return (
    <StyledChevronButton onClick={onClick}>
      <Icon size={size} color={`rgba(255, 255, 255, 0.73)`} filter='url(#neonGlow)' />
    </StyledChevronButton>
  );
};