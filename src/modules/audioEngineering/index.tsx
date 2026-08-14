import { useRef, useLayoutEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlexBox from '../../shared/components/FlexBox';
import CinematicSection from './components/CinematicSection';
import ProjectReview from './sections/ProjectReview';
import NeonText from '@/shared/styles/NeonText';
import { DetroitSkyline } from './components/DetroitSkyline';
import ProjectCarousel from './components/ProjectCarousel';

const Container = styled(FlexBox)`
  --audio-ivory: rgba(241, 237, 232, 0.96);
  --audio-ivory-soft: rgba(241, 237, 232, 0.76);
  --audio-ivory-muted: rgba(241, 237, 232, 0.62);
  --audio-sepia: rgba(224, 207, 173, 0.94);
  --audio-sepia-soft: rgba(224, 207, 173, 0.7);
  --audio-line: rgba(241, 237, 232, 0.15);
  --audio-line-strong: rgba(224, 207, 173, 0.38);
  --audio-charcoal: rgba(13, 13, 12, 0.97);
  --audio-charcoal-soft: rgba(18, 17, 15, 0.82);
  --audio-boundary-fill: rgba(224, 207, 173, 0.035);
  --audio-section-wash: rgba(224, 207, 173, 0.045);
  --audio-signal-glow: rgba(224, 207, 173, 0.32);
  --audio-hero-wash: rgba(224, 207, 173, 0.1);
  --audio-page-wash: rgba(13, 13, 12, 0.18);
  --audio-nav-blend-offset: 5.35rem;
  --audio-heading: var(--audio-ivory);
  --audio-copy: var(--audio-ivory-soft);
  --audio-technical: var(--audio-sepia-soft);
  --audio-ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  position: relative;
  z-index: 10;
  width: 100%;
  margin-top: calc(var(--audio-nav-blend-offset) * -1);
  padding-top: var(--audio-nav-blend-offset);
  flex-direction: column;
  overflow-x: hidden;
  color: var(--audio-ivory);
  background: radial-gradient(
      circle at 78% 8%,
      var(--audio-hero-wash),
      transparent 26rem
    ),
    linear-gradient(180deg, var(--audio-page-wash), var(--audio-charcoal) 42rem);
  isolation: isolate;
  pointer-events: auto;

  @media (max-width: 40rem) {
    --audio-nav-blend-offset: 4.25rem;
  }

  > #source {
    --audio-heading: rgba(255, 255, 255, 0.85);
    --audio-copy: rgba(255, 255, 255, 0.8);
    --audio-technical: rgba(255, 255, 255, 0.6);
  }

  > #restoration,
  > #mixing,
  > #mastering,
  > #projects,
  > #project-review {
    position: relative;
    border-top: 1px solid var(--audio-line);
  }

  > #restoration::before,
  > #mixing::before,
  > #mastering::before,
  > #projects::before,
  > #project-review::before {
    position: absolute;
    z-index: 4;
    top: -0.25rem;
    right: clamp(1.5rem, 5vw, 5rem);
    width: 0.45rem;
    height: 0.45rem;
    border: 1px solid var(--audio-sepia-soft);
    content: '';
    background: var(--audio-charcoal);
    box-shadow: 0 0.35rem 1.1rem var(--audio-signal-glow);
  }

  @media (max-width: 64rem) {
    > #restoration::before,
    > #mixing::before,
    > #mastering::before,
    > #projects::before,
    > #project-review::before {
      display: none;
    }
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

const SignalPathSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  min-width: 2460px;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  path {
    stroke: var(--audio-sepia-soft);
    opacity: 0.42;
  }
`;

const FloatingUI = styled.div<{
  top: string;
  left?: string;
  right?: string;
}>`
  position: absolute;
  top: ${({ top }) => top};
  ${({ left }) => left && `left: ${left};`}
  ${({ right }) => right && `right: ${right};`}
  z-index: 3;
  pointer-events: none;
  font-family: 'Orbit', sans-serif;
  font-size: 0.6rem;
  color: rgba(224, 207, 173, 0.38);
  text-transform: uppercase;
  letter-spacing: 0.2em;

  @media (max-width: 64rem) {
    display: none;
  }
`;

const TechnicalUIOverlay = () => (
  <>
    <FloatingUI top="15vh" left="5%" aria-hidden="true">
      [SCAN_MODE: ACTIVE]
    </FloatingUI>
    <FloatingUI top="45vh" right="8%" aria-hidden="true">
      [BIT_DEPTH: 32_FLOAT]
    </FloatingUI>
    <FloatingUI top="120vh" right="5%" aria-hidden="true">
      [SAMPLE_RATE: 96KHZ]
    </FloatingUI>
    <FloatingUI top="240vh" right="12%" aria-hidden="true">
      [DYNAMIC_RANGE: +118DB]
    </FloatingUI>
  </>
);

function AudioEngineering() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const lastSectionRef = useRef(-1);

  // signal path down the center of the page
  const signalPath = useMemo(() => {
    let path = 'M 500 0';
    const totalPoints = 700;
    const sectionHeight = 6000 / totalPoints;

    for (let i = 1; i <= totalPoints; i++) {
      const y = i * sectionHeight;
      const noiseIntensity = Math.max(0, 30 - (i / totalPoints) * 40);
      const noise =
        Math.sin(i * 0.2) * noiseIntensity +
        (Math.random() - 0.5) * (noiseIntensity * 0.6);
      const x = 500 + noise;
      path += ` L ${x} ${y}`;
    }
    return path;
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1200);

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(
        '.cinematic-section, .pin-section, .project-review-section',
      ) as HTMLElement[];

      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            if (i !== lastSectionRef.current) {
              lastSectionRef.current = i;
            }
          },
          onEnterBack: () => {
            if (i !== lastSectionRef.current) {
              lastSectionRef.current = i;
            }
          },
        });
      });

      // Animate the signal line drawing
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 10%',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        });
      }

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (pathRef.current) {
          gsap.set(pathRef.current, { display: 'none' });
        }
      });
    }, containerRef);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <Container ref={containerRef}>
      <TechnicalUIOverlay />

      <SignalPathSVG viewBox="0 0 1000 6000" preserveAspectRatio="none">
        <path
          ref={pathRef}
          d={signalPath}
          stroke="rgba(224, 207, 173, 0.7)"
          strokeWidth="1.2"
          fill="none"
        />
      </SignalPathSVG>

      <CinematicSection
        id="source"
        layout="center"
        subtitle="SIGNAL_ORIGIN // FOUNDATION"
        title={
          <>
            Detroit soul,
            <br />
            without compromise.
          </>
        }
        content={
          <>
            with over a decade of engineering, mixing, and producing experience,
            sauko specializes in providing high-end audio services to the motor
            city music industry.
          </>
        }
        background={<DetroitSkyline />}
      />

      <CinematicSection
        id="restoration"
        layout="left"
        subtitle="STAGE_01 // RESTORATION & DIGITIZATION"
        title={
          <>
            Analogue rescue.
            <br />
            Digital precision.
          </>
        }
        content="preserving the heritage of sound. we specialize in the meticulous restoration and archival of analogue media, bringing recordings into the modern bit-depth with surgical transparency."
        image="/images/restoration_equipment.png"
        imageAlt="Reel-to-reel and archival audio restoration equipment"
      />

      <CinematicSection
        id="mixing"
        layout="right"
        subtitle="STAGE_02 // MIXING & PRODUCTION"
        title={
          <>
            Sonic architecture.
            <br />
            Creative depth.
          </>
        }
        content={
          <>
            shaping the acoustic landscape. we balance clarity with character,
            blending the warmth of analogue circuitry with modern production
            techniques to define your signature sound.
            <NeonText fontSize="1rem" padding="1rem 0 0 0">
              [CHARACTER_DRIVE_ACTIVE]
            </NeonText>
          </>
        }
        image="/images/modular_rack.png"
        imageAlt="Modular synthesis and analogue production rack"
      />

      <CinematicSection
        id="mastering"
        layout="center"
        subtitle="STAGE_03 // THE FINAL MASTER"
        title={
          <>
            Transparent loudness.
            <br />
            Global translation.
          </>
        }
        content="the final stage of the sonic journey. we ensure your sound translates perfectly across all playback systems, from the club to headphones. commercial loudness with zero compromise on dynamic integrity."
      />

      <ProjectCarousel id="projects" />

      <ProjectReview />
    </Container>
  );
}

export default AudioEngineering;
