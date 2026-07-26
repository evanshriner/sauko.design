import { useLayoutEffect, useRef } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NeonText from '@/shared/styles/NeonText';
import SystemTopology from './components/SystemTopology';

const risks = [
  {
    number: '01',
    title: 'CHANGE ANXIETY',
    body: 'A feature that should take an afternoon needs a week of archaeology. Every change carries a question nobody can answer with confidence: what breaks next?',
    signal: 'UNCLEAR BOUNDARIES',
  },
  {
    number: '02',
    title: 'INVISIBLE DECISIONS',
    body: 'Business logic, model output, and customer data blur together. The product appears useful, but its decisions cannot be traced, reviewed, or defended.',
    signal: 'NO REVIEW PATH',
  },
  {
    number: '03',
    title: 'FRAGILE DELIVERY',
    body: 'Deployments rely on memory, workarounds, and the person who made it work once. The first incident reveals there is no reliable path back.',
    signal: 'MISSING OPERATIONS',
  },
];

const outcomes = [
  {
    number: 'A',
    title: 'KEEP THE PROOF',
    body: 'We preserve the useful product insight and separate it from the shortcuts that made the first version fast.',
  },
  {
    number: 'B',
    title: 'MAKE RISK VISIBLE',
    body: 'Clear boundaries, tests around the behavior that matters, and review points where a system needs human judgment.',
  },
  {
    number: 'C',
    title: 'RESTORE MOMENTUM',
    body: 'Your team inherits a system it can explain, operate, and extend without rebuilding trust on every release.',
  },
];

const engagement = [
  {
    number: '01',
    timing: 'FIRST · 1–2 WEEKS',
    title: 'MAP THE REAL SYSTEM',
    body: 'We follow the workflows your business depends on, inspect how the application behaves in production, and identify what is safe to keep.',
    deliverable: 'Risk map + prioritized repair plan',
  },
  {
    number: '02',
    timing: 'FIXED SCOPE',
    title: 'STABILIZE THE FOUNDATION',
    body: 'We replace brittle paths, clarify responsibilities, add safeguards around AI behavior, and prove the critical flows with tests.',
    deliverable: 'Reliable release path + documented decisions',
  },
  {
    number: '03',
    timing: 'OPTIONAL · ONGOING',
    title: 'SHIP WITHOUT RELAPSING',
    body: 'We stay close through the next features and handoff, so the team has the conventions and context to move quickly without rebuilding the mess.',
    deliverable: 'Working rhythm for safe weekly delivery',
  },
];

const readouts = [
  { top: '14vh', left: '5%', text: '[ SYS.AUDIT: ACTIVE ]' },
  { top: '132vh', right: '6%', text: '[ TECH_DEBT: QUANTIFIED ]' },
  { top: '260vh', left: '8%', text: '[ REVIEW_PATH: PRESENT ]' },
  { top: '405vh', right: '8%', text: '[ RELEASE_STATE: STABLE ]' },
  { top: '550vh', left: '5%', text: '[ HANDOFF: READY ]' },
];

const drift = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.25; }
  50% { transform: translate3d(0, -10px, 0); opacity: 0.5; }
`;

const Page = styled.main`
  position: relative;
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.primaryText};
  pointer-events: auto;

  &::before {
    position: absolute;
    z-index: 0;
    inset: 0;
    content: '';
    background: linear-gradient(
        180deg,
        rgba(13, 13, 12, 0.12) 0%,
        rgba(13, 13, 12, 0.58) 26%,
        rgba(13, 13, 12, 0.91) 100%
      ),
      radial-gradient(
        circle at 78% 10%,
        rgba(224, 207, 173, 0.1),
        transparent 30%
      );
  }
`;

const NoiseOverlay = styled.div`
  position: fixed;
  z-index: 1;
  inset: 0;
  pointer-events: none;
  opacity: 0.045;
  background-image: url('/images/displacement_smoke.png');
  background-repeat: repeat;
`;

const FloatingReadout = styled.span<{
  top: string;
  left?: string;
  right?: string;
}>`
  position: absolute;
  z-index: 1;
  top: ${({ top }) => top};
  ${({ left }) => left && `left: ${left};`}
  ${({ right }) => right && `right: ${right};`}
  color: rgba(224, 207, 173, 0.55);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.59rem;
  letter-spacing: 0.15em;
  pointer-events: none;
  animation: ${drift} 7s ease-in-out infinite;

  @media (max-width: 760px) {
    display: none;
  }
`;

const Shell = styled.div`
  position: relative;
  z-index: 2;
  width: min(1200px, calc(100% - 3rem));
  margin: 0 auto;

  @media (max-width: 640px) {
    width: min(100% - 2rem, 1200px);
  }
`;

const TerminalLabel = styled.p`
  margin: 0;
  color: rgba(224, 207, 173, 0.72);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.67rem;
  font-weight: 400;
  letter-spacing: 0.16em;
  line-height: 1.45;
  text-transform: uppercase;
`;

const Hero = styled.section`
  position: relative;
  display: flex;
  min-height: 100svh;
  padding: clamp(9rem, 17vh, 13rem) 0 clamp(5.5rem, 10vh, 8rem);
  align-items: center;
  box-sizing: border-box;

  @media (max-width: 800px) {
    min-height: 100svh;
    padding: 8rem 0 5rem;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  width: min(760px, 72%);

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const HeroTitle = styled.h1`
  max-width: 720px;
  margin: clamp(1.35rem, 3vw, 2.2rem) 0 0;
  color: rgba(241, 237, 232, 0.96);
  font-size: clamp(3.5rem, 7.5vw, 7.25rem);
  font-weight: 700;
  letter-spacing: -0.07em;
  line-height: 0.88;
  text-transform: uppercase;
  filter: url(#neonGlow);

  em {
    color: rgba(224, 207, 173, 0.92);
    font-style: normal;
  }
`;

const HeroBody = styled.p`
  max-width: 570px;
  margin: clamp(1.8rem, 4vw, 2.7rem) 0 0;
  color: rgba(241, 237, 232, 0.74);
  font-size: clamp(1.05rem, 1.55vw, 1.25rem);
  line-height: 1.62;
`;

const HeroFootnote = styled(NeonText)`
  width: auto;
  margin-top: 2rem;
  color: rgba(224, 207, 173, 0.7);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  line-height: 1.55;
`;

const Section = styled.section`
  display: flex;
  align-items: center;
  min-height: 100svh;
  padding: clamp(6.5rem, 12vw, 10rem) 0;
  border-top: 1px solid rgba(241, 237, 232, 0.1);
  box-sizing: border-box;

  @media (max-width: 760px) {
    min-height: auto;
  }
`;

const SectionIntro = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.75fr);
  gap: 2rem 5rem;
  align-items: end;
  margin-bottom: clamp(2.6rem, 5vw, 4.5rem);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  max-width: 800px;
  margin: 1rem 0 0;
  color: rgba(241, 237, 232, 0.94);
  font-size: clamp(2.4rem, 5.2vw, 4.75rem);
  font-weight: 650;
  letter-spacing: -0.06em;
  line-height: 0.93;
  text-transform: uppercase;
  filter: url(#neonGlow);
`;

const SectionBody = styled.p`
  max-width: 400px;
  margin: 0;
  color: rgba(241, 237, 232, 0.63);
  font-size: 1rem;
  line-height: 1.6;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid rgba(241, 237, 232, 0.16);
  border-left: 1px solid rgba(241, 237, 232, 0.16);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const ScanCard = styled.article`
  min-height: 290px;
  padding: clamp(1.35rem, 2.5vw, 2rem);
  border-right: 1px solid rgba(241, 237, 232, 0.16);
  border-bottom: 1px solid rgba(241, 237, 232, 0.16);
  background: rgba(16, 16, 14, 0.2);
  box-sizing: border-box;
  transition:
    background-color 320ms ease,
    border-color 320ms ease;

  &:hover {
    border-color: rgba(224, 207, 173, 0.36);
    background: rgba(224, 207, 173, 0.055);
  }
`;

const CardIndex = styled.p`
  margin: 0;
  color: rgba(224, 207, 173, 0.68);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
`;

const CardTitle = styled.h3`
  margin: 3.4rem 0 0;
  color: rgba(241, 237, 232, 0.9);
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1;
  filter: url(#neonGlow);
`;

const CardBody = styled.p`
  margin: 1rem 0 0;
  color: rgba(241, 237, 232, 0.62);
  font-size: 0.94rem;
  line-height: 1.58;
`;

const CardSignal = styled.p`
  margin: 2rem 0 0;
  color: rgba(224, 207, 173, 0.7);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.58rem;
  letter-spacing: 0.09em;
`;

const Outcomes = styled(Section)`
  min-height: 92svh;
  padding-top: 4rem;
  border-top: none;
`;

const OutcomeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1.4rem, 3vw, 3.5rem);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const Outcome = styled.article`
  padding-top: 1.3rem;
  border-top: 1px solid rgba(224, 207, 173, 0.35);
`;

const OutcomeTitle = styled.h3`
  margin: 2.2rem 0 0;
  color: rgba(224, 207, 173, 0.9);
  font-size: clamp(1.35rem, 2.3vw, 1.8rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
  filter: url(#neonGlow) drop-shadow(0 0 0.45em rgba(224, 207, 173, 0.28));
`;

const OutcomeBody = styled.p`
  max-width: 330px;
  margin: 1rem 0 0;
  color: rgba(241, 237, 232, 0.61);
  font-size: 0.96rem;
  line-height: 1.58;
`;

const Process = styled(Section)`
  background: linear-gradient(
    90deg,
    rgba(224, 207, 173, 0.045),
    transparent 68%
  );
`;

const ProcessLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(270px, 0.75fr) minmax(0, 1.25fr);
  gap: clamp(3rem, 9vw, 9rem);

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const ProcessLead = styled.div`
  @media (min-width: 801px) {
    position: sticky;
    top: 7rem;
    align-self: start;
  }
`;

const ProcessTitle = styled(SectionTitle)`
  color: rgba(224, 207, 173, 0.92);
  font-size: clamp(2.4rem, 4.5vw, 4rem);
  filter: url(#neonGlow) drop-shadow(0 0 0.45em rgba(224, 207, 173, 0.28));
`;

const ProcessList = styled.ol`
  position: relative;
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;

  &::before {
    position: absolute;
    top: 0.4rem;
    bottom: 1.5rem;
    left: 0.32rem;
    width: 1px;
    content: '';
    background: linear-gradient(
      rgba(224, 207, 173, 0.62),
      rgba(224, 207, 173, 0.08)
    );
  }
`;

const ProcessStep = styled.li`
  position: relative;
  padding: 0 0 clamp(3.2rem, 7vw, 5.4rem) clamp(2.25rem, 5vw, 4.25rem);

  &:last-child {
    padding-bottom: 0;
  }
`;

const StepMarker = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 0.68rem;
  height: 0.68rem;
  box-sizing: border-box;
  border: 1px solid rgba(224, 207, 173, 0.82);
  border-radius: 50%;
  background: rgba(18, 17, 15, 0.9);
  box-shadow: 0 0 14px rgba(224, 207, 173, 0.25);
`;

const StepMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1rem;
  color: rgba(224, 207, 173, 0.66);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
`;

const StepTitle = styled.h3`
  margin: 0.85rem 0 0;
  color: rgba(241, 237, 232, 0.93);
  font-size: clamp(1.4rem, 2.8vw, 2.15rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1;
  filter: url(#neonGlow);
`;

const StepBody = styled.p`
  max-width: 620px;
  margin: 1rem 0 0;
  color: rgba(241, 237, 232, 0.65);
  font-size: 0.99rem;
  line-height: 1.62;
`;

const Deliverable = styled.p`
  margin: 1.25rem 0 0;
  color: rgba(241, 237, 232, 0.82);
  font-size: 0.9rem;
  line-height: 1.45;

  strong {
    margin-right: 0.45rem;
    color: rgba(224, 207, 173, 0.76);
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.1em;
  }
`;

const Invitation = styled.section`
  display: flex;
  align-items: center;
  min-height: 100svh;
  padding: clamp(7rem, 14vw, 12rem) 0;
  border-top: 1px solid rgba(241, 237, 232, 0.1);
  box-sizing: border-box;

  @media (max-width: 760px) {
    min-height: auto;
  }
`;

const InvitationStage = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.65fr);
  gap: clamp(2.4rem, 7vw, 7rem);
  padding: clamp(1.7rem, 4.5vw, 4rem);
  border: 1px solid rgba(224, 207, 173, 0.26);
  background: rgba(18, 17, 15, 0.55);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.035);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const InvitationTitle = styled.h2`
  max-width: 680px;
  margin: 1.4rem 0 0;
  color: rgba(224, 207, 173, 0.94);
  font-size: clamp(2.45rem, 5.8vw, 5.4rem);
  font-weight: 650;
  letter-spacing: -0.065em;
  line-height: 0.9;
  text-transform: uppercase;
  filter: url(#neonGlow) drop-shadow(0 0 0.5em rgba(224, 207, 173, 0.3));
`;

const InvitationBody = styled.div`
  align-self: end;
  color: rgba(241, 237, 232, 0.67);
  font-size: 1rem;
  line-height: 1.62;

  p {
    margin: 0;
  }

  ul {
    display: grid;
    gap: 0.7rem;
    margin: 1.7rem 0 0;
    padding: 1.35rem 0 0;
    border-top: 1px solid rgba(224, 207, 173, 0.16);
    list-style: none;
  }

  li {
    display: flex;
    gap: 0.7rem;
    align-items: baseline;
    color: rgba(224, 207, 173, 0.72);
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.61rem;
    letter-spacing: 0.075em;
    text-transform: uppercase;
  }

  li::before {
    content: '[ + ]';
  }
`;

const ReducedMotion = styled.div`
  @media (prefers-reduced-motion: reduce) {
    & *,
    & {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default function AIDesloppification() {
  const pageRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const stages = gsap.utils.toArray<HTMLElement>('.ai-stage');

        stages.forEach((stage) => {
          const reveals = stage.querySelectorAll<HTMLElement>('.stage-reveal');

          if (reveals.length === 0) return;

          gsap.fromTo(
            reveals,
            { autoAlpha: 0, y: 56 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.35,
              ease: 'power4.out',
              stagger: 0.11,
              scrollTrigger: {
                trigger: stage,
                start: 'top 76%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        });

        const riskCards = gsap.utils.toArray<HTMLElement>('.risk-card');
        gsap.fromTo(
          riskCards,
          { autoAlpha: 0, y: 74 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.16,
            scrollTrigger: {
              trigger: '.risk-grid',
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        const outcomeCards = gsap.utils.toArray<HTMLElement>('.outcome-card');
        gsap.fromTo(
          outcomeCards,
          { autoAlpha: 0, y: 64 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: '.outcome-grid',
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        const processSteps = gsap.utils.toArray<HTMLElement>('.process-step');
        processSteps.forEach((step) => {
          gsap.fromTo(
            step,
            { autoAlpha: 0.24, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        });
      });
    }, pageRef);

    return () => {
      context.revert();
      media.revert();
    };
  }, []);

  return (
    <Page ref={pageRef} aria-labelledby="ai-desloppification-title">
      <ReducedMotion>
        <NoiseOverlay aria-hidden="true" />
        {readouts.map((readout) => (
          <FloatingReadout key={readout.text} {...readout}>
            {readout.text}
          </FloatingReadout>
        ))}

        <Shell>
          <Hero className="ai-stage hero-stage">
            <HeroContent>
              <TerminalLabel className="stage-reveal">
                AI DESLOPPIFICATION · SOFTWARE RECOVERY
              </TerminalLabel>
              <HeroTitle
                id="ai-desloppification-title"
                className="stage-reveal"
              >
                You shipped the demo.
                <br />
                <em>Now make it a system.</em>
              </HeroTitle>
              <HeroBody className="stage-reveal">
                The first version proved there was something worth building. We
                turn the AI-accelerated application that got you there into
                software your team can understand, operate, and improve with
                confidence.
              </HeroBody>
              <HeroFootnote
                className="stage-reveal"
                tone="sepia"
                fontSize="0.68rem"
                padding="0"
              >
                ASSESS · STABILIZE · ENABLE // NO BLIND REWRITE
              </HeroFootnote>
            </HeroContent>
            <SystemTopology />
          </Hero>
        </Shell>

        <Section className="ai-stage">
          <Shell>
            <SectionIntro>
              <div>
                <TerminalLabel className="stage-reveal">
                  THE CURRENT STATE · WHAT “WORKING” CAN HIDE
                </TerminalLabel>
                <SectionTitle className="stage-reveal">
                  The expensive part starts after it works.
                </SectionTitle>
              </div>
              <SectionBody className="stage-reveal">
                Fast builds are valuable. But once a tool carries customer data,
                business decisions, or team time, unknowns become operating
                risk.
              </SectionBody>
            </SectionIntro>
            <CardGrid className="risk-grid">
              {risks.map((risk) => (
                <ScanCard className="risk-card" key={risk.number}>
                  <CardIndex>RISK_{risk.number}</CardIndex>
                  <CardTitle>{risk.title}</CardTitle>
                  <CardBody>{risk.body}</CardBody>
                  <CardSignal>[ {risk.signal} ]</CardSignal>
                </ScanCard>
              ))}
            </CardGrid>
          </Shell>
        </Section>

        <Outcomes className="ai-stage">
          <Shell>
            <SectionIntro>
              <div>
                <TerminalLabel className="stage-reveal">
                  THE OUTCOME · A BETTER BASE TO BUILD ON
                </TerminalLabel>
                <SectionTitle className="stage-reveal">
                  Not a rewrite. A reliable way forward.
                </SectionTitle>
              </div>
              <SectionBody className="stage-reveal">
                We make careful calls about what earns its place in the next
                version, then build the conditions for good engineering to
                compound.
              </SectionBody>
            </SectionIntro>
            <OutcomeGrid className="outcome-grid">
              {outcomes.map((outcome) => (
                <Outcome className="outcome-card" key={outcome.number}>
                  <CardIndex>OUTCOME_{outcome.number}</CardIndex>
                  <OutcomeTitle>{outcome.title}</OutcomeTitle>
                  <OutcomeBody>{outcome.body}</OutcomeBody>
                </Outcome>
              ))}
            </OutcomeGrid>
          </Shell>
        </Outcomes>

        <Process className="ai-stage">
          <Shell>
            <ProcessLayout>
              <ProcessLead>
                <TerminalLabel className="stage-reveal">
                  ENGAGEMENT MODEL · FROM MESS TO MOMENTUM
                </TerminalLabel>
                <ProcessTitle className="stage-reveal">
                  Small phases. Clear ownership.
                </ProcessTitle>
                <SectionBody
                  className="stage-reveal"
                  style={{ marginTop: '1.5rem' }}
                >
                  We price and sequence the work around what the business
                  actually needs to protect, not an abstract ideal of perfect
                  code.
                </SectionBody>
              </ProcessLead>

              <ProcessList>
                {engagement.map((step) => (
                  <ProcessStep className="process-step" key={step.number}>
                    <StepMarker aria-hidden="true" />
                    <StepMeta>
                      <span>PHASE_{step.number}</span>
                      <span>{step.timing}</span>
                    </StepMeta>
                    <StepTitle>{step.title}</StepTitle>
                    <StepBody>{step.body}</StepBody>
                    <Deliverable>
                      <strong>YOU RECEIVE //</strong>
                      {step.deliverable}
                    </Deliverable>
                  </ProcessStep>
                ))}
              </ProcessList>
            </ProcessLayout>
          </Shell>
        </Process>

        <Invitation className="ai-stage">
          <Shell>
            <InvitationStage>
              <div>
                <TerminalLabel className="stage-reveal">
                  START WITH THE WORKFLOW YOUR TEAM AVOIDS
                </TerminalLabel>
                <InvitationTitle className="stage-reveal">
                  Make the next change safely.
                </InvitationTitle>
              </div>
              <InvitationBody className="stage-reveal">
                <p>
                  Bring the application that has become difficult to reason
                  about. We will help you decide what to preserve, what to
                  repair, and what does not deserve a rebuild.
                </p>
                <ul>
                  <li>The release or workflow people hesitate to touch</li>
                  <li>Constraints around customers, data, or compliance</li>
                  <li>
                    The next outcome the business needs the software to support
                  </li>
                </ul>
              </InvitationBody>
            </InvitationStage>
          </Shell>
        </Invitation>
      </ReducedMotion>
    </Page>
  );
}
