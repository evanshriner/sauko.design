import {
  useEffect,
  useLayoutEffect,
  useRef,
  type MouseEventHandler,
} from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SystemTopology from './components/SystemTopology';
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const assessmentUrl =
  'https://calendar.google.com/calendar/u/0/r/month/2026/8/12';

const BREAKPOINTS = {
  small: '40rem',
  medium: '48rem',
  large: '64rem',
  largeUp: '64.0625rem',
} as const;

const diagnostics = [
  {
    title: 'Change anxiety',
    symptom:
      'Every change starts with archaeology and the same unanswered question: what breaks next?',
    intervention:
      'Map the product workflow and separate the valuable product insight from the shortcuts around it.',
    result:
      'The team can change bounded behavior without rebuilding trust from scratch.',
  },
  {
    title: 'Invisible decisions',
    symptom:
      'Business logic, model output, and customer data blur together until no decision is easy to explain.',
    intervention:
      'Isolate model behavior behind a stable boundary, make data contracts explicit, and put review and test seams where the system needs judgment.',
    result:
      'Important decisions gain an owner, a review path, and a clear explanation.',
  },
  {
    title: 'Fragile delivery',
    symptom:
      'Deployments depend on memory, workarounds, and one person’s context.',
    intervention:
      'Protect critical behavior with tests, a release path, and explicit rollback.',
    result:
      'The team can operate and extend the system through a reliable release path.',
  },
];

const engagement = [
  {
    number: '01',
    timing: 'FIRST · 1–2 WEEKS',
    title: 'Map the real system',
    body: 'We follow the workflows your business depends on, inspect how the application behaves in production, and identify what is safe to keep.',
    deliverable: 'Risk map + prioritized repair plan',
  },
  {
    number: '02',
    timing: 'FIXED SCOPE',
    title: 'Stabilize the foundation',
    body: 'We replace brittle paths, clarify responsibilities, add safeguards around AI behavior, and prove the critical flows with tests.',
    deliverable: 'Reliable release path + documented decisions',
  },
  {
    number: '03',
    timing: 'OPTIONAL · ONGOING',
    title: 'Ship without relapsing',
    body: 'We stay close through the next features and handoff, so the team has the conventions and context to move quickly without rebuilding the mess.',
    deliverable: 'Working rhythm for safe weekly delivery',
  },
];

const Page = styled.main`
  --color-ivory: ${({ theme }) => theme.colors.primaryText};
  --color-ivory-soft: rgba(241, 237, 232, 0.76);
  --color-ivory-muted: rgba(241, 237, 232, 0.62);
  --color-sepia: rgba(224, 207, 173, 0.94);
  --color-sepia-soft: rgba(224, 207, 173, 0.7);
  --color-line: rgba(241, 237, 232, 0.15);
  --color-line-strong: rgba(224, 207, 173, 0.38);
  --color-charcoal: rgba(13, 13, 12, 0.96);
  --color-charcoal-soft: rgba(18, 17, 15, 0.72);
  --color-signal-glow: rgba(224, 207, 173, 0.48);
  --color-hero-wash: rgba(224, 207, 173, 0.1);
  --color-page-wash: rgba(13, 13, 12, 0.18);
  --color-boundary-fill: rgba(224, 207, 173, 0.035);
  --color-section-wash: rgba(224, 207, 173, 0.045);
  --color-hero-glow: rgba(224, 207, 173, 0.14);
  --color-major-glow: rgba(224, 207, 173, 0.16);
  --font-display: 'Inclusive Sans', sans-serif;
  --font-body: 'Rubik', sans-serif;
  --font-technical: 'Orbit', sans-serif;
  --nav-blend-offset: 5.35rem;
  --signal-rail-inset: clamp(1.5rem, 4vw, 5rem);
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-5: 3rem;
  --space-6: 4rem;
  --space-7: 6rem;
  --space-8: 8rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  position: relative;
  z-index: 10;
  width: 100%;
  margin-top: calc(var(--nav-blend-offset) * -1);
  padding-top: var(--nav-blend-offset);
  overflow: hidden;
  box-sizing: border-box;
  color: var(--color-ivory);
  font-family: var(--font-body);
  text-align: left;
  pointer-events: auto;
  background: radial-gradient(
      circle at 78% 8%,
      var(--color-hero-wash),
      transparent 26rem
    ),
    linear-gradient(180deg, var(--color-page-wash), var(--color-charcoal) 42rem);

  @media (max-width: ${BREAKPOINTS.small}) {
    --nav-blend-offset: 4.25rem;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const Shell = styled.div`
  position: relative;
  z-index: 2;
  width: min(75rem, calc(100% - var(--space-6)));
  margin: 0 auto;

  @media (max-width: ${BREAKPOINTS.small}) {
    width: calc(100% - var(--space-4));
  }
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(22rem, 0.92fr);
  gap: clamp(var(--space-4), 5vw, var(--space-7));
  min-height: calc(100svh - var(--nav-blend-offset));
  padding: clamp(var(--space-5), 10svh, var(--space-7)) 0
    clamp(var(--space-4), 6svh, var(--space-5));
  align-items: center;

  @media (max-width: ${BREAKPOINTS.large}) {
    grid-template-columns: 1fr;
  }

  @media (max-width: ${BREAKPOINTS.small}) {
    padding-top: var(--space-4);
    padding-bottom: var(--space-4);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
`;

const HeroVisual = styled.div`
  position: relative;
  width: min(100%, 38rem);
  justify-self: end;
  opacity: 0.88;

  &::before {
    position: absolute;
    inset: 16% 8%;
    content: '';
    background: radial-gradient(
      circle,
      var(--color-hero-wash),
      transparent 68%
    );
    filter: blur(2rem);
  }

  figure {
    position: relative;
  }

  @media (max-width: ${BREAKPOINTS.large}) {
    display: none;
  }
`;

const SignalRail = styled.div`
  position: absolute;
  z-index: 1;
  top: 100svh;
  right: var(--signal-rail-inset);
  bottom: var(--space-8);
  width: 1px;
  pointer-events: none;
  background: linear-gradient(
    transparent,
    var(--color-line-strong) 8%,
    var(--color-line) 92%,
    transparent
  );

  &::after {
    position: absolute;
    top: 0;
    left: -0.2rem;
    width: 0.45rem;
    height: 0.45rem;
    border: 1px solid var(--color-sepia-soft);
    content: '';
    background: var(--color-charcoal);
    box-shadow: 0 0.35rem 1.1rem var(--color-signal-glow);
    animation: rail-travel 18s linear infinite;
  }

  @keyframes rail-travel {
    0% {
      top: 0;
      opacity: 0;
    }
    6%,
    92% {
      opacity: 0.9;
    }
    100% {
      top: calc(100% - 0.45rem);
      opacity: 0;
    }
  }

  @media (max-width: ${BREAKPOINTS.large}) {
    display: none;
  }
`;

const HeroTitle = styled.h1`
  max-width: 14ch;
  margin: 0;
  color: var(--color-ivory);
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3.55rem, min(6.6vw, 10svh), 6.9rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.88;
  text-wrap: balance;
  filter: url(#neonGlow);

  span {
    display: block;
    color: var(--color-sepia);
    filter: drop-shadow(0 0 0.48em rgba(224, 207, 173, 0.42));
  }

  @media (max-width: ${BREAKPOINTS.small}) {
    font-size: clamp(3rem, 15vw, 3.55rem);
    line-height: 0.9;
  }
`;

const HeroSubtitle = styled.p`
  margin: clamp(var(--space-2), 2.5svh, var(--space-3)) 0 0;
  color: var(--color-sepia-soft);
  font-family: var(--font-technical);
  font-size: 0.74rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  @media (max-width: ${BREAKPOINTS.small}) {
    margin-top: var(--space-2);
    font-size: 0.67rem;
    letter-spacing: 0.14em;
  }

  @media (max-width: ${BREAKPOINTS.small}) and (max-height: 44rem) {
    display: none;
  }
`;

const HeroBody = styled.p`
  max-width: 44rem;
  margin: clamp(var(--space-2), 2.5svh, var(--space-3)) 0 0;
  color: var(--color-ivory-soft);
  font-size: clamp(1.05rem, 1.8vw, 1.3rem);
  line-height: 1.58;

  @media (max-width: ${BREAKPOINTS.small}) {
    margin-top: var(--space-2);
    font-size: 1rem;
    line-height: 1.55;
  }
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-3);
  align-items: center;
  margin-top: clamp(1.25rem, 3.5svh, var(--space-4));

  @media (max-width: ${BREAKPOINTS.small}) {
    row-gap: var(--space-1);
    margin-top: var(--space-3);
  }
`;

const PrimaryAction = styled.a`
  display: inline-flex;
  min-height: var(--space-5);
  padding: 0 var(--space-3);
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-sepia);
  color: var(--color-charcoal);
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
  background: var(--color-sepia);
  transition:
    color 240ms var(--ease-out),
    background-color 240ms var(--ease-out),
    box-shadow 240ms var(--ease-out),
    transform 240ms var(--ease-out);

  &:hover {
    color: var(--color-ivory);
    background: var(--color-charcoal-soft);
    box-shadow: 0 0.35rem 1.5rem var(--color-signal-glow);
    transform: translateY(-0.125rem);
  }

  &:focus-visible {
    outline: 3px solid var(--color-ivory);
    outline-offset: 4px;
    box-shadow: 0 0.4rem 1.75rem var(--color-signal-glow);
  }
`;

const AnchorAction = styled.a`
  display: inline-flex;
  min-height: var(--space-5);
  padding: 0 var(--space-1);
  align-items: center;
  color: var(--color-ivory);
  font-size: 0.95rem;
  font-weight: 500;
  text-underline-offset: 0.35rem;
  text-decoration-color: var(--color-sepia-soft);
  transition:
    color 240ms var(--ease-out),
    text-decoration-color 240ms var(--ease-out);

  &:hover {
    color: var(--color-sepia);
    text-decoration-color: var(--color-sepia);
  }

  &:focus-visible {
    border-radius: 0.125rem;
    outline: 3px solid var(--color-ivory);
    outline-offset: 4px;
  }
`;

const DossierMeta = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  margin: clamp(var(--space-3), 5svh, var(--space-5)) 0 0;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-line);
  color: var(--color-ivory-muted);
  font-size: 0.75rem;
  line-height: 1.5;

  div {
    display: flex;
    gap: var(--space-1);
  }

  dt {
    color: var(--color-sepia-soft);
    font-family: var(--font-technical);
    font-weight: 500;
  }

  dd {
    margin: 0;
  }

  @media (max-width: ${BREAKPOINTS.small}) {
    margin-top: var(--space-3);
  }
`;

const Section = styled.section`
  position: relative;
  padding: var(--space-7) 0;
  border-top: 1px solid var(--color-line);
  scroll-margin-top: var(--space-6);

  &::before {
    position: absolute;
    top: -0.23rem;
    right: var(--signal-rail-inset);
    width: 0.45rem;
    height: 0.45rem;
    border: 1px solid var(--color-sepia-soft);
    content: '';
    background: var(--color-charcoal);
  }

  @media (max-width: ${BREAKPOINTS.large}) {
    &::before {
      display: none;
    }
  }

  @media (max-width: ${BREAKPOINTS.small}) {
    padding: var(--space-5) 0;
  }
`;
const ChapterFolio = styled.span`
  display: block;
  width: max-content;
  margin: 0 0 var(--space-2) auto;
  color: var(--color-ivory-muted);
  font-family: var(--font-technical);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 1;
`;

const RecoverySection = styled(Section)`
  padding-top: var(--space-8);
  padding-bottom: var(--space-7);

  @media (max-width: ${BREAKPOINTS.small}) {
    padding-top: var(--space-6);
    padding-bottom: var(--space-5);
  }
`;

const SectionHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.72fr);
  gap: var(--space-4) var(--space-6);
  align-items: end;
  margin-bottom: var(--space-5);

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: 1fr;
    margin-bottom: var(--space-4);
  }
`;

const DiagnosticHeader = styled(SectionHeader)`
  margin-bottom: var(--space-4);
`;

const SectionTitle = styled.h2`
  max-width: 16ch;
  margin: 0;
  color: var(--color-ivory);
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5.5vw, 4.75rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.98;
  filter: url(#neonGlow);
  text-wrap: balance;
`;

const SectionBody = styled.p`
  max-width: 42rem;
  margin: 0;
  color: var(--color-ivory-soft);
  font-size: 1rem;
  line-height: 1.65;
`;
const RecoveryHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-4);

  > h2 {
    grid-column: 1 / span 8;
  }

  > p {
    grid-column: 8 / -1;
    margin-top: var(--space-4);
  }

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: 1fr;
    gap: var(--space-3);

    > h2,
    > p {
      grid-column: 1;
      margin-top: 0;
    }
  }
`;

const RiskPrinciple = styled.div`
  display: grid;
  grid-template-columns: minmax(14rem, 0.72fr) minmax(0, 1.28fr);
  gap: var(--space-3) var(--space-6);
  width: min(62rem, calc(100% - var(--space-6)));
  margin-top: var(--space-7);
  margin-left: auto;
  padding: var(--space-4);
  border-top: 1px solid var(--color-line-strong);
  border-bottom: 1px solid var(--color-line);
  align-items: baseline;
  background: var(--color-boundary-fill);

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: 1fr;
    width: 100%;
    margin-top: var(--space-4);
    padding: var(--space-3);
  }
`;

const RiskPrincipleTitle = styled.h3`
  margin: 0;
  color: var(--color-sepia);
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.1;
`;

const RiskPrincipleBody = styled.p`
  max-width: 46rem;
  margin: 0;
  color: var(--color-ivory-soft);
  font-size: 1rem;
  line-height: 1.65;
`;

const DiagnosticSection = styled(Section)`
  padding-top: var(--space-6);
  padding-bottom: var(--space-7);
  border-top-color: var(--color-line-strong);

  @media (max-width: ${BREAKPOINTS.small}) {
    padding: var(--space-5) 0;
  }
`;

const DiagnosticList = styled.div`
  padding: 0 var(--space-4);
  border-top: 1px solid var(--color-line-strong);
  background: var(--color-section-wash);

  @media (max-width: ${BREAKPOINTS.small}) {
    padding: 0 var(--space-3);
  }
`;

const DiagnosticRow = styled.article`
  display: grid;
  grid-template-columns: minmax(10rem, 0.6fr) minmax(0, 1.4fr);
  gap: var(--space-3) var(--space-5);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-line);

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  @media (max-width: ${BREAKPOINTS.small}) {
    gap: var(--space-2);
    padding: var(--space-3) 0;
  }
`;

const DiagnosticTitle = styled.h3`
  margin: 0;
  color: var(--color-sepia);
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.1;
`;

const DiagnosticDetails = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
  margin: 0;

  div {
    min-width: 0;
  }

  dt {
    margin-bottom: var(--space-1);
    color: var(--color-sepia-soft);
    font-family: var(--font-technical);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    line-height: 1.4;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    color: var(--color-ivory-soft);
    font-size: 0.94rem;
    line-height: 1.58;
  }

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);

    div:first-of-type {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: ${BREAKPOINTS.small}) {
    grid-template-columns: 1fr;

    div:first-of-type {
      grid-column: auto;
    }
  }
`;

const EngagementSection = styled(Section)`
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

const ClosingSection = styled(Section)`
  padding-top: var(--space-8);
  padding-bottom: var(--space-8);

  @media (max-width: ${BREAKPOINTS.small}) {
    padding-top: var(--space-5);
    padding-bottom: var(--space-5);
  }
`;

const ClosingLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(16rem, 0.65fr);
  gap: var(--space-5) var(--space-7);
  padding: var(--space-5);
  align-items: end;
  background: var(--color-boundary-fill);

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    padding: var(--space-4);
  }

  @media (max-width: ${BREAKPOINTS.small}) {
    padding: var(--space-3);
  }
`;

const ClosingTitle = styled(SectionTitle)`
  max-width: 13ch;
  color: var(--color-sepia);
  filter: url(#neonGlow) drop-shadow(0 0.4rem 1.25rem var(--color-major-glow));
`;

const ClosingBody = styled.div`
  color: var(--color-ivory-soft);
  font-size: 1rem;
  line-height: 1.62;

  p {
    margin: 0;
  }

  ul {
    display: grid;
    gap: var(--space-1);
    margin: var(--space-3) 0 0;
    padding: var(--space-3) 0 0 var(--space-3);
    border-top: 1px solid var(--color-line);
  }

  li::marker {
    color: var(--color-sepia-soft);
  }
`;

const ClosingAction = styled(PrimaryAction)`
  margin-top: var(--space-3);

  @media (max-width: ${BREAKPOINTS.small}) {
    width: 100%;
  }
`;

export default function AIDesloppification() {
  const pageRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const heroContent = heroContentRef.current;
        const heroVisual = heroVisualRef.current;
        const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } });

        if (heroContent) {
          timeline
            .fromTo(
              heroContent,
              { filter: 'blur(10px)' },
              { filter: 'blur(0px)', duration: 1.15 },
              0,
            )
            .fromTo(
              Array.from(heroContent.children),
              { opacity: 0, y: 68 },
              {
                opacity: 1,
                y: 0,
                duration: 1.15,
                stagger: 0.09,
              },
              0,
            );
        }

        if (heroVisual) {
          timeline.fromTo(
            heroVisual,
            { opacity: 0, x: 64, filter: 'blur(12px)' },
            {
              opacity: 0.88,
              x: 0,
              filter: 'blur(0px)',
              duration: 1.4,
            },
            0.18,
          );
        }

        const chapterSections = Array.from(
          pageRef.current?.querySelectorAll<HTMLElement>(
            '[data-chapter-section]',
          ) ?? [],
        );

        chapterSections.forEach((section) => {
          const elements = Array.from(
            section.querySelectorAll<HTMLElement>('[data-chapter-reveal]'),
          );

          gsap.fromTo(
            elements,
            {
              opacity: 0,
              y: 56,
              filter: 'blur(8px)',
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.05,
              stagger: 0.1,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: section,
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
  const handleRecoveryNavigation: MouseEventHandler<HTMLAnchorElement> = (
    event,
  ) => {
    event.preventDefault();
    window.history.pushState(null, '', '#recovery-map');

    const target = document.getElementById('recovery-map');
    if (!target) return;

    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(target, true, 'top 6rem');
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Page
      ref={pageRef}
      id="ai-isolated-themed"
      aria-labelledby="ai-desloppification-title"
    >
      <SignalRail aria-hidden="true" />
      <Shell>
        <Hero>
          <HeroContent ref={heroContentRef}>
            <HeroTitle
              id="ai-desloppification-title"
              aria-label="You shipped the demo. Now make it a system."
            >
              You shipped the demo. <span>Now make it a system.</span>
            </HeroTitle>
            <HeroSubtitle>
              AI software recovery // maintainable systems
            </HeroSubtitle>
            <HeroBody>
              The first version proved there was something worth building. We
              turn the AI-accelerated application that got you there into
              software your team can understand, operate, and improve with
              confidence.
            </HeroBody>
            <HeroActions>
              <PrimaryAction
                href={assessmentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Start a system assessment
              </PrimaryAction>
              <AnchorAction
                href="#recovery-map"
                onClick={handleRecoveryNavigation}
              >
                See how recovery works
              </AnchorAction>
            </HeroActions>
            <DossierMeta aria-label="Assessment approach">
              <div>
                <dt>Approach</dt>
                <dd>Assess · stabilize · enable</dd>
              </div>
              <div>
                <dt>Principle</dt>
                <dd>No blind rewrite</dd>
              </div>
            </DossierMeta>
          </HeroContent>
          <HeroVisual ref={heroVisualRef} aria-hidden="true">
            <SystemTopology />
          </HeroVisual>
        </Hero>
      </Shell>

      <RecoverySection
        id="recovery-map"
        aria-labelledby="recovery-title"
        data-chapter-section
      >
        <Shell>
          <ChapterFolio aria-hidden="true" data-chapter-reveal>
            01 / 04
          </ChapterFolio>
          <RecoveryHeader data-chapter-reveal>
            <SectionTitle id="recovery-title">
              The expensive part starts after it works.
            </SectionTitle>
            <SectionBody>
              Fast builds are valuable. But once a tool carries customer data,
              business decisions, or team time, unknowns become operating risk.
            </SectionBody>
          </RecoveryHeader>

          <RiskPrinciple data-chapter-reveal>
            <RiskPrincipleTitle>
              Working and operable are different states.
            </RiskPrincipleTitle>
            <RiskPrincipleBody>
              Recovery makes the product workflow, model boundary, customer-data
              boundary, review and test seams, release path, and rollback
              explicit—without discarding the product insight that made the
              first version valuable.
            </RiskPrincipleBody>
          </RiskPrinciple>
        </Shell>
      </RecoverySection>

      <DiagnosticSection
        aria-labelledby="diagnostic-title"
        data-chapter-section
      >
        <Shell>
          <ChapterFolio aria-hidden="true" data-chapter-reveal>
            02 / 04
          </ChapterFolio>
          <DiagnosticHeader data-chapter-reveal>
            <SectionTitle id="diagnostic-title">
              Where the risk shows up.
            </SectionTitle>
            <SectionBody>
              These patterns often arrive together, but each points to a
              different boundary, safeguard, or operating path that needs to be
              made explicit.
            </SectionBody>
          </DiagnosticHeader>

          <DiagnosticList data-chapter-reveal>
            {diagnostics.map((diagnostic) => (
              <DiagnosticRow key={diagnostic.title}>
                <DiagnosticTitle>{diagnostic.title}</DiagnosticTitle>
                <DiagnosticDetails>
                  <div>
                    <dt>Current symptom</dt>
                    <dd>{diagnostic.symptom}</dd>
                  </div>
                  <div>
                    <dt>Intervention</dt>
                    <dd>{diagnostic.intervention}</dd>
                  </div>
                  <div>
                    <dt>Result</dt>
                    <dd>{diagnostic.result}</dd>
                  </div>
                </DiagnosticDetails>
              </DiagnosticRow>
            ))}
          </DiagnosticList>
        </Shell>
      </DiagnosticSection>

      <EngagementSection
        aria-labelledby="engagement-title"
        data-chapter-section
      >
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
                We price and sequence the work around what the business actually
                needs to protect, not an abstract ideal of perfect code.
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
      </EngagementSection>

      <ClosingSection aria-labelledby="closing-title" data-chapter-section>
        <Shell>
          <ChapterFolio aria-hidden="true" data-chapter-reveal>
            04 / 04
          </ChapterFolio>
          <ClosingLayout data-chapter-reveal>
            <ClosingTitle id="closing-title">
              Make the next change safely.
            </ClosingTitle>
            <ClosingBody>
              <p>
                Bring the application that has become difficult to reason about.
                We will help you decide what to preserve, what to repair, and
                what does not deserve a rebuild.
              </p>
              <ul>
                <li>The release or workflow people hesitate to touch</li>
                <li>Constraints around customers, data, or compliance</li>
                <li>
                  The next outcome the business needs the software to support
                </li>
              </ul>
              <ClosingAction
                href={assessmentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Start a system assessment
              </ClosingAction>
            </ClosingBody>
          </ClosingLayout>
        </Shell>
      </ClosingSection>
    </Page>
  );
}
