import { useLayoutEffect, useRef } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const codeLines = [
  ['01', 'import { getAccount, saveDecision } from \'./data\';'],
  ['02', 'import { evaluate } from \'./agent\';'],
  ['03', ''],
  ['04', 'export async function resolveRequest(request: Request) {'],
  ['05', '  const account = await getAccount(request.accountId);'],
  ['06', '  const context = account.notes + request.message;'],
  ['07', '  const decision = await evaluate(context);', 'fault-one'],
  ['08', ''],
  ['09', '  if (decision.confidence > 0.5) {'],
  ['10', '    await saveDecision(account.id, decision);', 'fault-three'],
  ['11', '  }'],
  ['12', ''],
  ['13', '  return decision;'],
  ['14', '}'],
  ['15', ''],
  ['16', 'export async function retryRequest(request: Request) {'],
  ['17', '  try {'],
  ['18', '    return await resolveRequest(request);'],
  ['19', '  } catch (error) {'],
  ['20', '    return { confidence: 1, action: \'continue\' };', 'fault-two'],
  ['21', '  }'],
  ['22', '}'],
];

const Section = styled.section`
  width: 100%;
  height: 100vh;
  min-height: 650px;
  position: relative;
  z-index: 10;
  overflow: hidden;
  box-sizing: border-box;
`;

const Smoke = styled.div`
  position: absolute;
  inset: -15%;
  opacity: 0.13;
  pointer-events: none;
  background-image: url('/images/displacement_smoke.png');
  background-repeat: repeat;
  background-size: 520px;
  mix-blend-mode: screen;
`;

const Header = styled.div`
  position: absolute;
  z-index: 5;
  top: clamp(5.5rem, 10vh, 8.5rem);
  left: clamp(1.25rem, 7vw, 7rem);
  width: min(760px, calc(100% - 2.5rem));
  pointer-events: none;
`;

const Eyebrow = styled.p`
  margin: 0 0 1rem;
  color: rgba(211, 205, 198, 0.5);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.2em;
`;

const Heading = styled.h2`
  margin: 0;
  color: rgba(241, 237, 232, 0.94);
  font-size: clamp(2.7rem, 7vw, 6.5rem);
  font-weight: 800;
  line-height: 0.88;
  letter-spacing: -0.055em;
  text-transform: uppercase;
  filter: url(#neonGlow);
`;

const Lead = styled.p`
  max-width: 590px;
  margin: 1.5rem 0 0;
  color: rgba(211, 205, 198, 0.76);
  font-size: clamp(1rem, 1.7vw, 1.2rem);
  line-height: 1.6;
`;

const Viewport = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  perspective: 1800px;
`;

const GrainField = styled.div`
  position: absolute;
  top: 46%;
  left: 50%;
  width: min(1250px, 92vw);
  height: min(740px, 72vh);
  border: 1px solid rgba(211, 205, 198, 0.08);
  opacity: 0.65;
  transform: translate(-50%, -42%) rotateX(65deg);
  transform-origin: center;
  background-image:
    linear-gradient(rgba(211, 205, 198, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(211, 205, 198, 0.08) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: linear-gradient(to bottom, transparent, black 25%, transparent 85%);
`;

const CodePlate = styled.div`
  position: absolute;
  top: 53%;
  left: 50%;
  width: min(1000px, 82vw);
  padding: clamp(2.1rem, 4vw, 3.75rem) clamp(2rem, 5vw, 4.6rem);
  box-sizing: border-box;
  border: 1px solid rgba(211, 205, 198, 0.25);
  background-color: rgba(18, 17, 15, 0.62);
  box-shadow: 28px 34px 100px rgba(0, 0, 0, 0.38), inset 0 0 46px rgba(211, 205, 198, 0.035);
  transform: translate(-50%, -50%) rotateX(6deg) rotateY(-4deg);
  transform-style: preserve-3d;
  will-change: transform;

  &::before,
  &::after {
    content: '';
    position: absolute;
    pointer-events: none;
  }

  &::before {
    inset: 10px -10px -10px 10px;
    z-index: -1;
    border: 1px solid rgba(211, 205, 198, 0.14);
  }

  &::after {
    inset: 0;
    opacity: 0.1;
    background-image: url('/images/displacement_smoke.png');
    background-size: 250px;
    mix-blend-mode: screen;
  }

  @media (max-width: 720px) {
    top: 58%;
    width: 120vw;
    padding: 2rem 2.3rem;
  }
`;

const FileMeta = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(211, 205, 198, 0.16);
  color: rgba(211, 205, 198, 0.45);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.63rem;
  letter-spacing: 0.1em;
`;

const Code = styled.pre`
  position: relative;
  z-index: 1;
  margin: 0;
  color: rgba(241, 237, 232, 0.7);
  font-family: 'Courier New', Courier, monospace;
  font-size: clamp(0.64rem, 1.08vw, 0.93rem);
  line-height: 1.82;
  white-space: pre;
`;

const CodeLine = styled.span`
  display: block;
  position: relative;
  min-height: 1.82em;
  padding: 0 0.6rem;
  transition: color 200ms ease, background-color 200ms ease;

  &.fault-one, &.fault-two, &.fault-three {
    color: rgba(241, 237, 232, 0.9);
  }
`;

const LineNumber = styled.span`
  display: inline-block;
  width: 2.5em;
  margin-right: 1.5em;
  color: rgba(211, 205, 198, 0.3);
  user-select: none;
`;

const FocusRing = styled.div`
  position: absolute;
  z-index: 2;
  left: -0.45rem;
  right: -0.45rem;
  height: 1.82em;
  border-top: 1px solid rgba(224, 207, 173, 0.75);
  border-bottom: 1px solid rgba(224, 207, 173, 0.75);
  background-color: rgba(224, 207, 173, 0.07);
  box-shadow: 0 0 28px rgba(224, 207, 173, 0.1);
  opacity: 0;
  pointer-events: none;
`;

const Callout = styled.aside<{ align: 'left' | 'right' }>`
  position: absolute;
  z-index: 6;
  top: 56%;
  ${({ align }) => align === 'left' ? 'left: clamp(1.25rem, 7vw, 7rem);' : 'right: clamp(1.25rem, 7vw, 7rem);'}
  width: min(295px, 28vw);
  padding-left: 1rem;
  border-left: 1px solid rgba(224, 207, 173, 0.7);
  color: rgba(211, 205, 198, 0.78);
  font-size: clamp(0.88rem, 1.25vw, 1rem);
  line-height: 1.5;
  opacity: 0;
  pointer-events: none;

  strong {
    display: block;
    margin-bottom: 0.55rem;
    color: rgba(241, 237, 232, 0.95);
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.13em;
  }

  @media (max-width: 720px) {
    top: auto;
    bottom: 8%;
    left: 1.25rem;
    right: 1.25rem;
    width: auto;
    padding: 1rem 1.1rem;
    border: 1px solid rgba(224, 207, 173, 0.4);
    background-color: rgba(18, 17, 15, 0.78);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  }
`;

const Progress = styled.div`
  position: absolute;
  z-index: 7;
  right: clamp(1.25rem, 4vw, 4rem);
  bottom: clamp(1.25rem, 4vh, 3rem);
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: rgba(211, 205, 198, 0.44);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.58rem;
  letter-spacing: 0.1em;
`;

const ProgressBar = styled.span`
  display: block;
  width: 92px;
  height: 1px;
  background-color: rgba(211, 205, 198, 0.22);

  span {
    display: block;
    width: 0%;
    height: 100%;
    background-color: #e0cfad;
    box-shadow: 0 0 10px rgba(224, 207, 173, 0.42);
  }
`;

const Closing = styled.div`
  position: absolute;
  z-index: 8;
  right: clamp(1.25rem, 7vw, 7rem);
  bottom: clamp(4rem, 12vh, 9rem);
  width: min(475px, calc(100% - 2.5rem));
  color: rgba(211, 205, 198, 0.78);
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  line-height: 1.58;
  opacity: 0;
  pointer-events: none;

  strong {
    color: rgba(241, 237, 232, 0.94);
  }

  @media (max-width: 720px) {
    bottom: 16%;
    left: 1.25rem;
    right: 1.25rem;
    width: auto;
  }
`;

const FailureTrace = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const plate = sectionRef.current?.querySelector('.code-plate');
      const ring = sectionRef.current?.querySelector('.focus-ring');
      const progress = sectionRef.current?.querySelector('.progress-fill');
      const first = sectionRef.current?.querySelector('.callout-one');
      const second = sectionRef.current?.querySelector('.callout-two');
      const third = sectionRef.current?.querySelector('.callout-three');
      const closing = sectionRef.current?.querySelector('.trace-closing');
      const faultOne = sectionRef.current?.querySelector('.fault-one');
      const faultTwo = sectionRef.current?.querySelector('.fault-two');
      const faultThree = sectionRef.current?.querySelector('.fault-three');

      if (!plate || !ring) return;

      const focusLine = (line: Element | null) => {
        if (!line) return {};
        return { top: (line as HTMLElement).offsetTop };
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=360%',
          scrub: 0.75,
          pin: true,
          anticipatePin: 1,
        },
      });

      timeline
        .fromTo(plate, { opacity: 0, scale: 0.62, xPercent: -50, yPercent: -50 }, { opacity: 1, scale: 0.76, xPercent: -50, yPercent: -50, duration: 0.65, ease: 'power2.out' })
        .to(progress, { width: '16%', duration: 0.25 }, 0)
        .to(plate, { scale: 1.42, xPercent: -57, yPercent: -61, duration: 1.15, ease: 'power2.inOut' })
        .to(ring, { ...focusLine(faultOne), opacity: 1, duration: 0.28 }, '<+=0.55')
        .to(first, { opacity: 1, y: -8, duration: 0.38 }, '<+=0.12')
        .to(progress, { width: '38%', duration: 0.4 }, '<')
        .to(first, { opacity: 0, y: -20, duration: 0.28 }, '+=0.55')
        .to(plate, { scale: 1.66, xPercent: -43, yPercent: -69, duration: 1.1, ease: 'power2.inOut' })
        .to(ring, { ...focusLine(faultTwo), duration: 0.26 }, '<+=0.52')
        .to(second, { opacity: 1, y: -8, duration: 0.36 }, '<+=0.1')
        .to(progress, { width: '61%', duration: 0.36 }, '<')
        .to(second, { opacity: 0, y: -20, duration: 0.28 }, '+=0.55')
        .to(plate, { scale: 1.36, xPercent: -57, yPercent: -51, duration: 1.05, ease: 'power2.inOut' })
        .to(ring, { ...focusLine(faultThree), duration: 0.26 }, '<+=0.48')
        .to(third, { opacity: 1, y: -8, duration: 0.36 }, '<+=0.1')
        .to(progress, { width: '82%', duration: 0.36 }, '<')
        .to(third, { opacity: 0, y: -20, duration: 0.28 }, '+=0.52')
        .to(ring, { opacity: 0, duration: 0.2 })
        .to(plate, { scale: 0.61, xPercent: -50, yPercent: -50, opacity: 0.48, duration: 1.25, ease: 'power2.inOut' })
        .to(closing, { opacity: 1, y: -10, duration: 0.42 }, '<+=0.56')
        .to(progress, { width: '100%', duration: 0.5 }, '<');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="the-problem" ref={sectionRef}>
      <Smoke />
      <Header>
        <Eyebrow>SECTION_02 // WHAT THE BUILD HIDES</Eyebrow>
        <Heading>THE COST HIDES<br />BETWEEN THE LINES.</Heading>
        <Lead>
          The screens can work. The real risk is often buried in the decisions the system makes without a boundary, a test, or a person in the loop.
        </Lead>
      </Header>

      <Viewport>
        <GrainField />
        <CodePlate className="code-plate">
          <FileMeta>
            <span>REQUEST_RESOLVER.TS</span>
            <span>22 LINES // 3 QUESTIONS</span>
          </FileMeta>
          <Code aria-label="Example generated request-resolution code">
            <FocusRing className="focus-ring" />
            {codeLines.map(([number, text, className]) => (
              <CodeLine className={className} key={number}>
                <LineNumber>{number}</LineNumber>{text}
              </CodeLine>
            ))}
          </Code>
        </CodePlate>
      </Viewport>

      <Callout align="left" className="callout-one">
        <strong>LINE 07</strong>
        A model call is carrying a business decision. What should it be allowed to decide—and what must it never decide alone?
      </Callout>
      <Callout align="right" className="callout-two">
        <strong>LINE 20</strong>
        A failure is quietly converted into certainty. The system keeps moving, but the team loses the signal that something needs attention.
      </Callout>
      <Callout align="left" className="callout-three">
        <strong>LINE 10</strong>
        A generated decision is written into the record without a review point, a test, or a trace a person can follow later.
      </Callout>
      <Closing className="trace-closing">
        <strong>One line is not the problem.</strong> The problem is when these small, reasonable-looking shortcuts pile up until every new feature feels unsafe to touch.
      </Closing>
      <Progress>
        <span>READ THE SYSTEM</span>
        <ProgressBar><span className="progress-fill" /></ProgressBar>
      </Progress>
    </Section>
  );
};

export default FailureTrace;
