import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from '@emotion/styled';

interface CursorPosition {
  x: number;
  y: number;
}

const CustomCursor: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const customCursorRef = useRef<HTMLDivElement>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const lerp = (start: number, end: number, amount: number) => {
    return (1 - amount) * start + amount * end;
  };

  const animateCursor = useCallback(() => {
    if (customCursorRef.current) {
      setCursorPosition((prevPos) => {
        // Offset the cursor to the top-left
        const offsetX = -10; // Half of the cursor width
        const offsetY = -10; // Half of the cursor height
        const newX = lerp(prevPos.x, targetX.current + offsetX, 0.1); // Adjust lerp amount for desired delay/ease
        const newY = lerp(prevPos.y, targetY.current + offsetY, 0.1);
        customCursorRef.current!.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
        return { x: newX, y: newY };
      });
    }
    animationFrameId.current = requestAnimationFrame(animateCursor);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetX.current = event.clientX;
      targetY.current = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    animationFrameId.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animateCursor]);

  const StyledCursor = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 20px; // Size of the square
    height: 20px; // Size of the square
    border: 2px solid rgba(255, 255, 255, 0.73); // Neon color
    pointer-events: none; // Allow clicks to pass through
    z-index: 9999; // Ensure it's on top
    filter: url(#neonGlow); // Apply neon glow filter
    animation: pulse 1.5s infinite alternate; // Apply pulsing animation

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
  `;

  return (
    <StyledCursor
      ref={customCursorRef}
      style={{
        transform: `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)`,
        transition: 'transform 0.1s linear', // Smooth initial positioning
      }}
    />
  );
};

export default CustomCursor;