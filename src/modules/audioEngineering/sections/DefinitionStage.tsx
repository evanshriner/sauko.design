
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

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
`;

const ProjectItem = styled.div`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DefinitionStage = () => {
  return (
    <BentoBlock transparent gridColumn="span 3" style={{ maxWidth: '900px' }}>
      <TechnicalLabel>DEFINITION_STAGE // MASTERING</TechnicalLabel>
      <Title>THE MASTERING SUITE.</Title>
      <ContentText>
        From stereo CD mastering to complex stem workflows. High-end analogue signal paths meet state-of-the-art digital precision. Online mastering built for the global industry.
      </ContentText>
      
      <ProjectGrid>
        <ProjectItem>
          <TechnicalLabel>FEATURED_01</TechnicalLabel>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>KNOW NOW</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>NOWADAYS (2024)</div>
        </ProjectItem>
        <ProjectItem>
          <TechnicalLabel>FEATURED_02</TechnicalLabel>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>COUNTEDGNOME</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>ASCENSION (2023)</div>
        </ProjectItem>
      </ProjectGrid>
    </BentoBlock>
  );
};

export default DefinitionStage;
