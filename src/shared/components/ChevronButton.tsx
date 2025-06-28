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
  transition: background-color 0.3s ease;
`;

export const ChevronButton: React.FC<ChevronButtonProps> = ({
  direction,
  onClick,
  size = 78,
  color = 'white',
}) => {
  const Icon = direction === 'left' ? MdChevronLeft : MdChevronRight;
  return (
    <StyledChevronButton onClick={onClick}>
      <Icon size={size} color={`rgba(255, 255, 255, 0.73)`} filter='url(#neonGlow)' />
    </StyledChevronButton>
  );
};