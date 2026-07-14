import React, { useLayoutEffect, useRef } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface EngagementStep {
  number: string;
  cadence: string;
  title: string;
  description: string;
  deliverable: string;
  signals: string[];
}

const engagementSteps: EngagementStep[] = [
  {
    number: '01',
    cadence: 'FIRST // 1–2 WEEKS',
    title: 'ASSESS',
    description:
      'We trace the system as it actually behaves: the critical workflows, the data it touches, the places it can fail, and the parts worth keeping. No blind rewrite. No hand-wavy “AI audit.”',
    deliverable: 'Risk map, prioritized repair plan, and a clear scope for the work ahead.',
    signals: ['DEPENDENCIES', 'DATA FLOWS', 'RISK SURFACE'],
  },
  {
    number: '02',
    cadence: 'THEN // FIXED SCOPE',
    title: 'STABILIZE',
    description:
      'We reduce the fragility that slows your team down—untangling boundaries, replacing brittle logic, adding tests around the behavior that matters, and putting review points around AI decisions.',
    deliverable: 'A maintainable release path, with the work documented in plain language.',
    signals: ['GUARDRAILS', 'TEST COVERAGE', 'HUMAN REVIEW'],
  },
  {
    number: '03',
    cadence: 'OPTIONAL // ONGOING',
    title: 'ENABLE',
    description:
      'We stay close through the next features and handoff so the same shortcuts do not grow back. Your team gets context, conventions, and a system they can extend without crossing their fingers.',
    deliverable: 'A practical operating rhythm for shipping safely after the rescue.',
    signals: ['TEAM HANDOFF', 'WEEKLY SHIPPING', 'OBSERVABILITY'],
  },
];

const SectionContainer = styled.section`
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 15vh 5vw;
  z-index: 2;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 10vh 20px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: clamp(3rem, 8vw, 8rem);
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const TitleColumn = styled.div`
  flex: 0.85;
  padding-top: 2rem;

  @media (max-width: 768px) {
    width: 100%;
    padding-top: 0;
  }
`;

const StepsColumn = styled.div`
  flex: 1.15;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2.8rem, 6vw, 5.5rem);
  font-weight: 800;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  line-height: 0.88;
  margin: 0;
  filter: url(#neonGlow);
`;

const Intro = styled.p`
  max-width: 22rem;
  margin: 1.5rem 0 0;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
`;

const TechnicalLabel = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
`;

const StepCard = styled.article`
  position: relative;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.3s ease, background-color 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.06);
  }
`;

const StepMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.65rem;
  letter-spacing: 0.13em;
  color: rgba(255, 255, 255, 0.48);
`;

const StepTitle = styled.h3`
  margin: 1.25rem 0 0.85rem;
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  line-height: 1;
  color: rgba(255, 255, 255, 0.9);
`;

const Description = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
`;

const Deliverable = styled.p`
  margin: 1.5rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.88);
`;

const SignalList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
`;

const Signal = styled.span`
  padding: 0.3rem 0.45rem;
  border: 1px solid rgba(0, 255, 65, 0.38);
  color: #00ff41;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.58rem;
  letter-spacing: 0.08em;
`;

const DeliveryModel: React.FC<{ id: string }> = ({ id }) => {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.engagement-step') as HTMLElement[];
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 42, opacity: 0, filter: 'blur(8px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      const media = gsap.matchMedia();
      media.add('(min-width: 769px)', () => ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 15%',
        end: 'bottom 85%',
        pin: titleRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
      }));
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionContainer id={id} ref={containerRef} className="pin-section">
      <ContentWrapper>
        <TitleColumn ref={titleRef}>
          <TechnicalLabel>ENGAGEMENT MODEL // FROM MESS TO MOMENTUM</TechnicalLabel>
          <SectionTitle>FIX WHAT<br />MATTERS.</SectionTitle>
          <Intro>
            Small, legible phases. Clear ownership. A codebase that is easier to change at the end than it was at the start.
          </Intro>
        </TitleColumn>
        <StepsColumn>
          {engagementSteps.map((step) => (
            <StepCard className="engagement-step" key={step.number}>
              <StepMeta>
                <span>PHASE_{step.number}</span>
                <span>{step.cadence}</span>
              </StepMeta>
              <StepTitle>{step.title}</StepTitle>
              <Description>{step.description}</Description>
              <Deliverable><strong>YOU RECEIVE //</strong> {step.deliverable}</Deliverable>
              <SignalList aria-label={`${step.title} focus areas`}>
                {step.signals.map((signal) => <Signal key={signal}>{signal}</Signal>)}
              </SignalList>
            </StepCard>
          ))}
        </StepsColumn>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default DeliveryModel;
