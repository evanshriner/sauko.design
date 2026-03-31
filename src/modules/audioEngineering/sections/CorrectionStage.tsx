
import BentoBlock from '../../blog/BentoBlock';
import styled from '@emotion/styled';

const ContentText = styled.div`
  font-size: 1.2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 1rem;
`;

const TechnicalLabel = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  color: rgba(255, 255, 255, 0.5);
`;

const Title = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0.5rem 0;
  letter-spacing: -0.05rem;
  text-transform: uppercase;
`;

const CorrectionStage = () => {
  return (
    <BentoBlock transparent gridColumn="span 3" style={{ maxWidth: '800px' }}>
      <TechnicalLabel>CORRECTION_STAGE // RESTORATION</TechnicalLabel>
      <Title>ANALOGUE RESCUE &<br/>DIGITIZATION.</Title>
      <ContentText>
        Preserving the heritage of sound. We specialize in the meticulous restoration and archival of analogue media, bringing recordings into the modern bit-depth with surgical transparency.
      </ContentText>
    </BentoBlock>
  );
};

export default CorrectionStage;
