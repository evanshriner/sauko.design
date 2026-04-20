import { useRef, useLayoutEffect, useState, useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlexBox from '../../shared/components/FlexBox';
import CinematicSection from './components/CinematicSection';
import EngineeringConsole from './sections/EngineeringConsole';
import NeonText from '@/shared/styles/NeonText';
import { DetroitSkyline } from './components/DetroitSkyline';

const Container = styled(FlexBox)`
  width: 100%;
  position: relative;
  flex-direction: column;
  z-index: 10;
  pointer-events: auto;
  background: transparent;
`;

const NoiseOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  opacity: 0.05;
  background-image: url('/images/displacement_smoke.png');
  background-repeat: repeat;
`;

const SignalPathSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const ConsoleWrapper = styled(FlexBox)`
  width: 100%;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 4rem 0;
`;

const FloatingUI = styled.div<{ top: string; left?: string; right?: string }>`
  position: absolute;
  top: ${({ top }) => top};
  ${({ left }) => left && `left: ${left};`}
  ${({ right }) => right && `right: ${right};`}
  z-index: 3;
  pointer-events: none;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.2em;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TechnicalUIOverlay = () => {
  const [coords, setCoords] = useState({ x: '000', y: '000' });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCoords({
        x: Math.floor(Math.random() * 999).toString().padStart(3, '0'),
        y: Math.floor(Math.random() * 999).toString().padStart(3, '0'),
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <FloatingUI top="15vh" left="5%">[SCAN_MODE: ACTIVE]</FloatingUI>
      <FloatingUI top="45vh" right="8%">[BIT_DEPTH: 32_FLOAT]</FloatingUI>
      <FloatingUI top="75vh" left="10%">[XY_COORD: {coords.x}.{coords.y}]</FloatingUI>
      <FloatingUI top="120vh" right="5%">[SAMPLE_RATE: 96KHZ]</FloatingUI>
      <FloatingUI top="180vh" left="4%">[BUFFER: 1024_SAMPLES]</FloatingUI>
      <FloatingUI top="240vh" right="12%">[DYNAMIC_RANGE: +118DB]</FloatingUI>
      <FloatingUI top="310vh" left="6%">[PHASE: ALIGNED]</FloatingUI>
    </>
  );
};

function AudioEngineering() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const lastSectionRef = useRef(-1);

  // signal path down the center of the page
  const signalPath = useMemo(() => {
    let path = "M 500 0";
    const totalPoints = 700; 
    const sectionHeight = 6000 / totalPoints; 
    
    for (let i = 1; i <= totalPoints; i++) {
      const y = i * sectionHeight;
      const noiseIntensity = Math.max(0, 30 - (i / totalPoints) * 40); 
      const noise = Math.sin(i * 0.20) * noiseIntensity + (Math.random() - 0.5) * (noiseIntensity * 0.6);
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
        const sections = gsap.utils.toArray('.cinematic-section, .console-section') as HTMLElement[];
        
        sections.forEach((section, i) => {
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => {
                    if (i !== lastSectionRef.current) {
                        lastSectionRef.current = i;
                        setActiveSection(i);
                    }
                },
                onEnterBack: () => {
                    if (i !== lastSectionRef.current) {
                        lastSectionRef.current = i;
                        setActiveSection(i);
                    }
                }
            });
        });

        // Animate the signal line drawing
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
            
            gsap.to(pathRef.current, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 10%",
                    end: "bottom bottom",
                    scrub: 0.5, 
                }
            });
        }

        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: reduce)", () => {
          if (pathRef.current) {
            gsap.set(pathRef.current, { display: 'none' });
          }
        });

        mm.add("(max-width: 768px)", () => {
            if (pathRef.current) {
              gsap.set(pathRef.current, { opacity: 0.2 });
            }
        });

    }, containerRef);

    return () => {
        clearTimeout(refreshTimer);
        ctx.revert();
    }
  }, []); 

  return (
    <Container ref={containerRef}>
      <NoiseOverlay />
      <TechnicalUIOverlay />
      
      <SignalPathSVG viewBox="0 0 1000 6000" preserveAspectRatio="none">
        <path 
          ref={pathRef}
          d={signalPath}
          stroke="rgba(255, 255, 255, 0.2)" 
          strokeWidth="1.2" 
          fill="none"
        />
      </SignalPathSVG>
      
      <CinematicSection 
        id="source"
        layout="center"
        subtitle="SIGNAL_ORIGIN // FOUNDATION"
        title={<>DETROIT SOUL,<br/>WITHOUT COMPROMISE.</>}
        content={
          <>
            with over a decade of engineering, mixing, and producing experience, sauko specializes in providing high-end audio services to the motor city music
            industry.
          </>
        }
        background={<DetroitSkyline />}
      />

      <CinematicSection 
        id="restoration"
        layout="left"
        subtitle="STAGE_01 // RESTORATION & DIGITIZATION"
        title={<>ANALOGUE RESCUE.<br/>DIGITAL PRECISION.</>}
        content="preserving the heritage of sound. we specialize in the meticulous restoration and archival of analogue media, bringing recordings into the modern bit-depth with surgical transparency."
        image="/images/artist1.jpg"
      />

      <CinematicSection 
        id="mixing"
        layout="right"
        subtitle="STAGE_02 // MIXING & PRODUCTION"
        title={<>SONIC ARCHITECTURE.<br/>CREATIVE DEPTH.</>}
        content={
          <>
            shaping the acoustic landscape. we balance clarity with character, blending the warmth of analogue circuitry with modern production techniques to define your signature sound.
            <NeonText fontSize="1rem" padding="1rem 0 0 0">[CHARACTER_DRIVE_ACTIVE]</NeonText>
          </>
        }
        image="/images/artist2.jpg"
      />

      <CinematicSection 
        id="mastering"
        layout="center"
        subtitle="STAGE_03 // THE FINAL MASTER"
        title={<>TRANSPARENT LOUDNESS.<br/>GLOBAL TRANSLATION.</>}
        content="the final stage of the sonic journey. we ensure your sound translates perfectly across all playback systems, from the club to headphones. commercial loudness with zero compromise on dynamic integrity."
      />

      <ConsoleWrapper id="console" className="console-section">
        <EngineeringConsole />
      </ConsoleWrapper>
    </Container>
  );
}

export default AudioEngineering;
