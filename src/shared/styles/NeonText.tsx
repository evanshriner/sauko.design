import styled from '@emotion/styled';
import FlexBox from '../components/FlexBox';

export interface NeonTextProps {
  fontSize?: string;
  darken?: boolean;
}

const calculateTextShadow = (fontSize: string) => {
  const size = parseFloat(fontSize) || 2; // Default to 2rem if fontSize is not provided
  const unit = fontSize.replace(/[0-9.]/g, '') || 'rem'; // Extract unit or default to 'rem'
  const shadowSize = size * 0.05; // Adjust multiplier as needed for desired effect

  return `
    ${shadowSize * 0.5}${unit} ${shadowSize * 0.5}${unit} var(--c),
    ${shadowSize}${unit} ${shadowSize * 0.5}${unit} var(--c),
  `;
};

const NeonText = styled(FlexBox)<NeonTextProps>(
  // TODO: darken should be converted to 'selected' prop
  ({ fontSize = '2rem', darken = false, theme }) => ({
    color: `rgba(255, 255, 255, ${darken ? 0.5 : 0.73})`,
    fontSize,
    filter: 'url(#neonGlow)',
  }),
);

export default NeonText;
