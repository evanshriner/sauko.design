
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

const SignalSource = () => {
  return (
    <BentoBlock transparent gridColumn="span 3" style={{ maxWidth: '800px' }}>
      <TechnicalLabel>SIGNAL_ORIGIN // FOUNDATION</TechnicalLabel>
      <Title>DETROIT BORN.<br/>ANALOGUE BRED.</Title>
      <ContentText>
        Over a decade of engineering, mixing, and producing experience distilled into a surgical precision workflow. Sauko is the new standard for the Motor City's high-fidelity output.
      </ContentText>
    </BentoBlock>
  );
};

export default SignalSource;
