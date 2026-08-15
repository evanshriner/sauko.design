import styled from '@emotion/styled';
import { engagement } from '../data';
import {
  BREAKPOINTS,
  ChapterFolio,
  Section,
  SectionBody,
  SectionTitle,
  Shell,
} from '../styles';

const EngagementRoot = styled(Section)`
  background: none;
`;

const EngagementLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(16rem, 0.72fr) minmax(0, 1.28fr);
  gap: var(--space-5) var(--space-7);

  @media (max-width: ${BREAKPOINTS.large}) {
    grid-template-columns: 1fr;
  }

  @media (max-width: ${BREAKPOINTS.small}) {
    gap: var(--space-4);
  }
`;

const EngagementLead = styled.div`
  display: grid;
  gap: var(--space-3);
  align-content: start;
  align-self: start;

  @media (min-width: ${BREAKPOINTS.largeUp}) {
    position: sticky;
    top: var(--space-7);
  }
`;

const EngagementList = styled.ol`
  margin: 0;
  padding: 0 0 0 var(--space-4);
  border-top: 1px solid var(--color-line-strong);
  border-left: 1px solid var(--color-line);
  list-style: none;

  @media (max-width: ${BREAKPOINTS.large}) {
    padding-left: 0;
    border-left: 0;
  }
`;

const EngagementStep = styled.li`
  display: grid;
  grid-template-columns: var(--space-5) minmax(0, 1fr);
  gap: var(--space-3);
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--color-line);

  @media (max-width: ${BREAKPOINTS.small}) {
    padding: var(--space-3) 0;
  }
`;

const StepNumber = styled.span`
  color: var(--color-sepia-soft);
  font-family: var(--font-technical);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
`;

const StepContent = styled.div`
  min-width: 0;
`;

const StepMeta = styled.p`
  margin: 0;
  color: var(--color-ivory-muted);
  font-family: var(--font-technical);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1.5;
`;

const StepTitle = styled.h3`
  margin: var(--space-1) 0 0;
  color: var(--color-ivory);
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3vw, 2.35rem);
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.05;
`;

const StepBody = styled.p`
  max-width: 44rem;
  margin: var(--space-2) 0 0;
  color: var(--color-ivory-soft);
  font-size: 0.98rem;
  line-height: 1.62;
`;

const Deliverable = styled.p`
  margin: var(--space-2) 0 0;
  color: var(--color-ivory);
  font-size: 0.88rem;
  line-height: 1.5;

  strong {
    margin-right: var(--space-1);
    color: var(--color-sepia-soft);
    font-family: var(--font-technical);
    font-size: 0.75rem;
    font-weight: 500;
  }
`;

export default function EngagementSection() {
  return (
    <EngagementRoot aria-labelledby="engagement-title" data-chapter-section>
      <Shell>
        <ChapterFolio aria-hidden="true" data-chapter-reveal>
          03 / 04
        </ChapterFolio>
        <EngagementLayout>
          <EngagementLead data-chapter-reveal>
            <SectionTitle id="engagement-title">
              Small phases. Clear ownership.
            </SectionTitle>
            <SectionBody>
              We sequence the work around the workflows the business needs to
              trust first—not an abstract ideal of perfect code.
            </SectionBody>
          </EngagementLead>

          <EngagementList data-chapter-reveal>
            {engagement.map((step) => (
              <EngagementStep key={step.number}>
                <StepNumber aria-hidden="true">{step.number}</StepNumber>
                <StepContent>
                  <StepMeta>{step.timing}</StepMeta>
                  <StepTitle>{step.title}</StepTitle>
                  <StepBody>{step.body}</StepBody>
                  <Deliverable>
                    <strong>You receive</strong>
                    {step.deliverable}
                  </Deliverable>
                </StepContent>
              </EngagementStep>
            ))}
          </EngagementList>
        </EngagementLayout>
      </Shell>
    </EngagementRoot>
  );
}
