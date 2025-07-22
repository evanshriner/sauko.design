import React from 'react';

interface SvgLogoProps extends React.SVGProps<SVGSVGElement> {
  progress: number;
}

const SvgLogo: React.FC<SvgLogoProps> = ({ progress, ...props }) => {
  const clipPathId = 'logo-clip-path';

  return (
    <svg
      width="140"
      height="40"
      viewBox="0 0 140 40"
      style={{ cursor: 'pointer' }}
      {...props}
    >
      <defs>
        <clipPath id={clipPathId}>
          <rect width={`${progress}%`} height="100%" />
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
          fill: 'rgba(255, 255, 255, 0.5)',
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