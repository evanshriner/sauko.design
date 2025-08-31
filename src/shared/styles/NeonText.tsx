import styled from '@emotion/styled';
import FlexBox from '../components/FlexBox';

export interface NeonTextProps {
  fontSize?: string;
  darken?: boolean;
  inverted?: boolean
  animatedHover?: boolean;
  disableSelection?: boolean;
}

const NeonText = styled(FlexBox)<NeonTextProps>(
  // TODO: darken should be converted to 'selected' prop
  ({
    fontSize = '2rem',
    darken = false,
    inverted = false,
    animatedHover = false,
    disableSelection = false,
  }) => ({
    color: `rgba(${inverted ? 0 : 255}, ${inverted ? 0 : 255}, ${inverted ? 0 : 255}, ${darken ? 0.5 : 0.85})`,
    fontSize,
    filter: 'url(#neonGlow)',
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
  }),
);

export default NeonText;
