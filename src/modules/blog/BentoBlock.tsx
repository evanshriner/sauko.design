import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import FlexBox from '@/shared/components/FlexBox';
import { keyframes } from '@emotion/react';

export interface BentoBlockProps {
  gridColumn?: string;
  gridRow?: string;
  transparent?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const glitchKeyframes = keyframes`
  0% { transform: translate(0); text-shadow: none; }
  20% { transform: translate(-2px, 2px); text-shadow: 2px 0 red, -2px 0 blue; }
  40% { transform: translate(-2px, -2px); text-shadow: -2px 0 red, 2px 0 blue; }
  60% { transform: translate(2px, 2px); text-shadow: 2px 0 red, -2px 0 blue; }
  80% { transform: translate(2px, -2px); text-shadow: -2px 0 red, 2px 0 blue; }
  100% { transform: translate(0); text-shadow: none; }
`;

const scanlineAnimation = keyframes`
  0% { top: -100%; }
  100% { top: 100%; }
`;

const StyledBentoBlock = styled(FlexBox)<BentoBlockProps>(({ theme, gridColumn, gridRow, transparent }) => ({
  boxSizing: 'border-box',
  boxShadow: transparent 
    ? 'none' 
    : 'rgba(255, 255, 255, 0.9) 0px 2px 8px 0px',
  background: transparent 
    ? 'rgba(0, 0, 0, 0.4)' 
    : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: transparent ? 'blur(10px)' : 'none',
  border: transparent ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
  color: transparent ? theme.colors.primaryText : 'black',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  padding: '1.5rem',
  gridColumn: gridColumn || 'auto',
  gridRow: gridRow || 'auto',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
  
  '&:hover': {
    backgroundColor: transparent ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 1)',
    borderColor: transparent ? 'rgba(255, 255, 255, 0.4)' : 'none',
    '& .glitch-content': {
      animation: `${glitchKeyframes} 0.2s infinite linear alternate-reverse`,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'rgba(255, 255, 255, 0.2)',
        animation: `${scanlineAnimation} 2s linear infinite`,
        pointerEvents: 'none',
    }
  }
}));

const Coordinate = styled.div`
  position: absolute;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
`;

const TopLeft = styled(Coordinate)` top: 5px; left: 5px; `;
const TopRight = styled(Coordinate)` top: 5px; right: 5px; `;
const BottomLeft = styled(Coordinate)` bottom: 5px; left: 5px; `;
const BottomRight = styled(Coordinate)` bottom: 5px; right: 5px; `;

const BentoBlock: React.FC<BentoBlockProps> = ({ children, className, ...props }) => {
  const [coords, setCoords] = useState({ x: '000', y: '000' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCoords({
        x: Math.floor(Math.random() * 999).toString().padStart(3, '0'),
        y: Math.floor(Math.random() * 999).toString().padStart(3, '0'),
      });
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <StyledBentoBlock className={`bento-block ${className || ''}`} {...props}>
      <TopLeft>[X:{coords.x} Y:{coords.y}]</TopLeft>
      <TopRight>ID:{Math.random().toString(36).substring(7).toUpperCase()}</TopRight>
      <BottomLeft>STATUS:OK</BottomLeft>
      <BottomRight>REC.001</BottomRight>
      <div className="glitch-content" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </StyledBentoBlock>
  );
};

export default BentoBlock;
