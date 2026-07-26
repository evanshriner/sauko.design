import styled from '@emotion/styled';
import FlexBox from '../components/FlexBox';

export interface NeonTextProps {
  fontSize?: string;
  darken?: boolean;
  tone?: 'default' | 'sepia';
  inverted?: boolean;
  animatedHover?: boolean;
  disableSelection?: boolean;
}

const NeonText = styled(FlexBox)<NeonTextProps>(
  // TODO: darken should be converted to 'selected' prop
  ({
    fontSize = '2rem',
    darken = false,
    inverted = false,
    tone = 'default',
    animatedHover = false,
    disableSelection = false,
  }) => {
    const opacity = darken ? 0.5 : 0.85;
    const color = inverted
      ? `rgba(0, 0, 0, ${opacity})`
      : tone === 'sepia'
      ? `rgba(224, 207, 173, ${opacity})`
      : `rgba(255, 255, 255, ${opacity})`;

    return {
      color,
      fontSize,
      filter:
        tone === 'sepia'
          ? 'url(#neonGlow) drop-shadow(0 0 0.55em rgba(224, 207, 173, 0.42))'
          : 'url(#neonGlow)',
      ...(animatedHover && {
        '@keyframes hoverX': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(5px)' },
          '100%': { transform: 'translateY(0)' },
        },
        animation: 'hoverX 6s ease-in-out infinite',
      }),
      ...(disableSelection && {
        webkitUserSelect: 'none',
        mozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
      }),
    };
  },
);

export default NeonText;
