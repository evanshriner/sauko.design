import styled from '@emotion/styled';
import BentoBlock from '../../blog/BentoBlock';

const TechnicalLabel = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  color: rgba(255, 255, 255, 0.5);
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 0.9;
  margin: 0.65rem 0 1.5rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  filter: url(#neonGlow);
`;

const Body = styled.p`
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
`;

const Checklist = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0 0;
  display: grid;
  gap: 0;
`;

const Item = styled.li`
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.95rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.78);

  &::before {
    content: '[ + ]';
    margin-right: 0.8rem;
    color: #00ff41;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.7rem;
  }
`;

const Note = styled.p`
  margin: 1.5rem 0 0;
  color: rgba(255, 255, 255, 0.45);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.7rem;
  line-height: 1.6;
  letter-spacing: 0.04em;
`;

const AuditConsole = () => (
  <BentoBlock transparent gridColumn="span 3" style={{ maxWidth: '680px', width: 'calc(100% - 2rem)' }}>
    <TechnicalLabel>START HERE // SCOPED ARCHITECTURAL TRIAGE</TechnicalLabel>
    <Title>MAKE THE NEXT<br />CHANGE SAFELY.</Title>
    <Body>
      Bring us the application that has become difficult to reason about. We will help you decide what to keep, what to repair, and what not to rebuild.
    </Body>
    <Checklist>
      <Item>A repository or deployment we can inspect with appropriate access.</Item>
      <Item>The workflow your team is currently afraid to touch.</Item>
      <Item>Any constraints around customers, data, compliance, or the next release.</Item>
    </Checklist>
    <Note>
      FIRST CONVERSATION // WE START WITH THE BUSINESS RISK, NOT A GENERIC AI SALES DECK.
    </Note>
  </BentoBlock>
);

export default AuditConsole;
