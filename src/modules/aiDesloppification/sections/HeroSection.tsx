import type { MouseEventHandler, RefObject } from 'react';
import styled from '@emotion/styled';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import SystemTopology from '../components/SystemTopology';
import { BOOKING_URL } from '@/shared/constants/booking';
import { RECOVERY_MAP_ID } from '../data';
import { BREAKPOINTS, PrimaryAction, Shell } from '../styles';

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

const handleRecoveryNavigation: MouseEventHandler<HTMLAnchorElement> = (
  event,
) => {
  event.preventDefault();
  window.history.pushState(null, '', `#${RECOVERY_MAP_ID}`);

  const target = document.getElementById(RECOVERY_MAP_ID);
  if (!target) return;

  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(target, true, 'top 6rem');
    return;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

type HeroSectionProps = Readonly<{
  heroContentRef: RefObject<HTMLDivElement>;
  heroVisualRef: RefObject<HTMLDivElement>;
}>;

export default function HeroSection({
  heroContentRef,
  heroVisualRef,
}: HeroSectionProps) {
  return (
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
            AI-accelerated software // human-led recovery
          </HeroSubtitle>
          <HeroBody>
            The first version proved the idea. AI helped you reach working
            software quickly; now it needs the engineering that speed left
            unresolved. We turn it into a system your team can explain, test,
            operate, and keep improving.
          </HeroBody>
          <HeroActions>
            <PrimaryAction
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start a system assessment
            </PrimaryAction>
            <AnchorAction
              href={`#${RECOVERY_MAP_ID}`}
              onClick={handleRecoveryNavigation}
            >
              See how recovery works
            </AnchorAction>
          </HeroActions>
          <DossierMeta aria-label="Assessment approach">
            <div>
              <dt>あはは、結局あれを翻訳してもらったんですね。</dt>
              {/* <dd>Assess · stabilize · enable</dd> */}
            </div>
            {/* <div>
              <dt>Principle</dt>
              <dd>No blind rewrite</dd>
            </div> */}
          </DossierMeta>
        </HeroContent>
        <HeroVisual ref={heroVisualRef} aria-hidden="true">
          <SystemTopology />
        </HeroVisual>
      </Hero>
    </Shell>
  );
}
