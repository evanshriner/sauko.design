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
    ${shadowSize * 1.5}${unit} ${shadowSize}${unit} var(--c),
    ${shadowSize * 1.5}${unit} ${shadowSize * 0.5}${unit} var(--c),
    ${shadowSize * 1.5}${unit} ${shadowSize * 1.5}${unit} 7px var(--c),
    ${-shadowSize * 0.5}${unit} ${shadowSize * 0.5}${unit} 6px var(--c)
  `;
};

const NeonText = styled(FlexBox)<NeonTextProps>(
  ({ fontSize = '2rem', darken = false, theme }) => ({
    color: 'rgba(255, 255, 255, 0.23)',
    fontSize,
    '--c': `rgba(255, 255, 255, ${darken ? '0.2' : '0.4'})`,
    textShadow: calculateTextShadow(fontSize),
  }),
);

export default NeonText;
