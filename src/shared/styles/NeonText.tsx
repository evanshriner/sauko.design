import styled from '@emotion/styled';
import FlexBox from '../components/FlexBox';

export interface NeonTextProps {
  fontSize?: string;
  darken?: boolean;
  animatedHover?: boolean;
  disableSelection?: boolean;
}

const NeonText = styled(FlexBox)<NeonTextProps>(
  // TODO: darken should be converted to 'selected' prop
  ({
    fontSize = '2rem',
    darken = false,
    animatedHover = false,
    disableSelection = false,
  }) => ({
    color: `rgba(255, 255, 255, ${darken ? 0.5 : 0.73})`,
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
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      'user-select': 'none',
    }),
  }),
);

export default NeonText;
