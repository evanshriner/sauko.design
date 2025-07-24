import { motion } from 'framer-motion';
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clipPathId = 'progress-bar-clip-path';
  // A string of forward slashes to act as the progress bar visuals.
  const slashes = '/'.repeat(30);

  return (
    <svg
      width="100%"
      height="20"
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      style={{ maxWidth: '400px' }}
    >
      <defs>
        <clipPath id={clipPathId}>
          <motion.rect
            height="100%"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'linear', duration: 0.2 }}
          />
        </clipPath>
      </defs>

      {/* Base text (unfilled) */}
      <text
        x="0"
        y="50%"
        dy=".3em"
        style={{
          fontFamily: 'Orbit, sans-serif',
          fontSize: '11px',
          fill: 'rgba(255, 255, 255, 0.3)',
          whiteSpace: 'pre',
          userSelect: 'none',
        }}
      >
        {slashes}
      </text>

      {/* Filled text */}
      <text
        x="0"
        y="50%"
        dy=".3em"
        style={{
          fontFamily: 'Orbit, sans-serif',
          fontSize: '11px',
          fill: 'rgba(255, 255, 255, 0.9)',
          clipPath: `url(#${clipPathId})`,
          whiteSpace: 'pre',
          userSelect: 'none',
        }}
      >
        {slashes}
      </text>
    </svg>
  );
};

export default ProgressBar;
