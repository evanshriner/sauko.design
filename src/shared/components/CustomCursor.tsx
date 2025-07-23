import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { RiArrowRightUpLine } from 'react-icons/ri';
import { motion, useMotionValue } from 'framer-motion';

// --- Styled Components (No Changes Here) ---
const StyledCursor = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none; // Allow clicks to pass through
  
  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid rgba(255, 255, 255, 0.73);
  filter: url(#neonGlow);
  animation: pulse 2.5s infinite alternate;

  @keyframes pulse {
    from { opacity: 0.5; }
    to { opacity: 0.8; }
  }

  .hover-icon {
    color: rgba(255, 255, 255, 0.93);
    font-size: 34px;
  }
`;

const cursorVariants = {
  default: {
    width: "7px",
    height: "7px",
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.3
    }
  },
  hover: {
    width: "60px",
    height: "60px",
    backgroundColor: "rgba(65, 65, 65, 0.3)",
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.3
    }
  }
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.1, rotate: -45 },
  visible: { opacity: 1, scale: 1, rotate: 0 }
};

interface CustomCursorProps {
  isHoveringNav: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ isHoveringNav }) => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [cursorX, cursorY]);

  // Apply rule to all elements to override any specific cursor styles,
  // so the browser cursor is hidden when hovering over navigation elements.
  useEffect(() => {
    const styleId = 'custom-cursor-hide-style';
  
    if (isHoveringNav) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
    } else {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    }
  
    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, [isHoveringNav]);

  return (
    <StyledCursor
      variants={cursorVariants}
      animate={isHoveringNav ? "hover" : "default"}
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      // transition={{
      //   type: "spring",
      //   duration: 1.3,
      //   bounce: 0.2,
      // }}
    >
      <motion.div
        className="hover-icon"
        variants={iconVariants}
        initial="hidden"
        animate={isHoveringNav ? "visible" : "hidden"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <RiArrowRightUpLine />
      </motion.div>
    </StyledCursor>
  );
};

export default CustomCursor;