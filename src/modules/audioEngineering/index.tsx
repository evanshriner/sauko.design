import { useRef, useLayoutEffect, useState, useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlexBox from '../../shared/components/FlexBox';
import CinematicSection from './components/CinematicSection';
import EngineeringConsole from './sections/EngineeringConsole';
import { useMediaPlayerContext } from '@/shared/context/MediaPlayerContext';
import NeonText from '@/shared/styles/NeonText';

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
  z-index: 2;
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
  const { skipForward } = useMediaPlayerContext();
  const [activeSection, setActiveSection] = useState(0);
  const lastSectionRef = useRef(-1);
  const skipForwardRef = useRef(skipForward);

  // Sync the skipForward ref
  useLayoutEffect(() => {
    skipForwardRef.current = skipForward;
  }, [skipForward]);

  // Generate a thinner, more elegant path
  const signalPath = useMemo(() => {
    let path = "M 500 0";
    const totalPoints = 400; 
    const sectionHeight = 6000 / totalPoints; 
    
    for (let i = 1; i <= totalPoints; i++) {
      const y = i * sectionHeight;
      const noiseIntensity = Math.max(0, 30 - (i / totalPoints) * 40); 
      const noise = Math.sin(i * 0.05) * noiseIntensity + (Math.random() - 0.5) * (noiseIntensity * 0.3);
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

    let ctx = gsap.context(() => {
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
                        skipForwardRef.current();
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

        let mm = gsap.matchMedia();
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
        title={<>DETROIT BORN.<br/>ANALOGUE BRED.</>}
        content={
          <>
            Over a decade of engineering, mixing, and producing experience distilled into a surgical precision workflow. Sauko is the new standard for the Motor City's high-fidelity output.
          </>
        }
      />

      <CinematicSection 
        id="correction"
        layout="left"
        subtitle="CORRECTION_STAGE // RESTORATION"
        title={<>ANALOGUE RESCUE &<br/>DIGITIZATION.</>}
        content="Preserving the heritage of sound. We specialize in the meticulous restoration and archival of analogue media, bringing recordings into the modern bit-depth with surgical transparency."
        image="/images/artist1.jpg"
      />

      <CinematicSection 
        id="definition"
        layout="right"
        subtitle="DEFINITION_STAGE // CHARACTER"
        title={<>REFINEMENT.<br/>DEPTH. SPACE.</>}
        content={
          <>
            More than just volume. We shape the acoustic landscape, providing the warmth of analogue circuitry with the clinical precision of digital mastering.
            <NeonText fontSize="1rem" padding="1rem 0 0 0">[CHARACTER_DRIVE_ACTIVE]</NeonText>
          </>
        }
        image="/images/artist2.jpg"
      />

      <CinematicSection 
        id="output"
        layout="center"
        subtitle="OUTPUT_STAGE // FINAL_BIT"
        title={<>TRANSPARENT.<br/>LOUD. LIMITLESS.</>}
        content="The final stage of the sonic journey. Translated perfectly across all playback systems, from the club to the headphones. Loudness with zero compromise on integrity."
      />

      <ConsoleWrapper id="console" className="console-section">
        <EngineeringConsole />
      </ConsoleWrapper>
    </Container>
  );
}

export default AudioEngineering;
