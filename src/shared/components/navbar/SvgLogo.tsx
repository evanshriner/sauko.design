import { motion } from 'framer-motion';
import React from 'react';

interface SvgLogoProps extends React.SVGProps<SVGSVGElement> {
  progress?: number;
}

const SvgLogo: React.FC<SvgLogoProps> = ({ progress = 100, ...props }) => {
  const clipPathId = 'logo-clip-path';

  return (
    <svg
      viewBox="0 0 100 30"
      style={{ cursor: 'pointer', width: '30vw' }}
      {...props}
    >
      <defs>
        <clipPath id={clipPathId}>
          <motion.rect
            height="100%"
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeIn', duration: 0.5 }}
          />
        </clipPath>
      </defs>

      {/* Base text (unfilled) */}
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        style={{
          fontFamily: 'Orbit, sans-serif',
          fontSize: '2rem',
          fill: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        sauko
      </text>

      {/* Filled text with neon glow */}
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        style={{
          fontFamily: 'Orbit, sans-serif',
          fontSize: '2rem',
          fill: 'rgba(255, 255, 255, 0.73)',
          filter: 'url(#neonGlow)',
          clipPath: `url(#${clipPathId})`,
        }}
      >
        sauko
      </text>
    </svg>
  );
};

export default SvgLogo;
