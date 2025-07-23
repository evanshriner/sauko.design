import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const RippleCircle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  pointer-events: none;
  z-index: 1000;
`;

export interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

interface RippleEffectProps {
  ripples: Ripple[];
}

export const RippleEffect: React.FC<RippleEffectProps> = ({ ripples }) => {
  return (
    <>
      {ripples.map((ripple) => (
        <RippleCircle
          key={ripple.id}
          style={{
            top: ripple.y - ripple.size / 2,
            left: ripple.x - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 10, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}
    </>
  );
};
