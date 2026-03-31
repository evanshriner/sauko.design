import { useRef, useLayoutEffect, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlexBox from '../../shared/components/FlexBox';
import SignalSource from './sections/SignalSource';
import CorrectionStage from './sections/CorrectionStage';
import DefinitionStage from './sections/DefinitionStage';
import OutputStage from './sections/OutputStage';
import EngineeringConsole from './sections/EngineeringConsole';
import { useMediaPlayerContext } from '@/shared/context/MediaPlayerContext';

const Container = styled(FlexBox)`
  width: 100%;
  position: relative;
  flex-direction: column;
  z-index: 10;
  pointer-events: auto;
`;

const SectionWrapper = styled(FlexBox)`
  width: 100%;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  position: relative;
  pointer-events: auto;
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

  // Generate a path that is noisy at the top and smooth at the bottom
  const signalPath = useMemo(() => {
    let path = "M 500 0";
    const totalPoints = 300; 
    const sectionHeight = 5000 / totalPoints;
    
    for (let i = 1; i <= totalPoints; i++) {
      const y = i * sectionHeight;
      // Noise decreases as we go down
      // Strong noise at the top (Roots), zero noise by section 3 (Mastering)
      const noiseIntensity = Math.max(0, 150 - (i / totalPoints) * 200); 
      const noise = (Math.random() - 0.5) * noiseIntensity;
      const x = 500 + noise;
      path += ` L ${x} ${y}`;
    }
    return path;
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Ensure ScrollTrigger refreshes after page transition
    // and after everything is rendered
    const refreshTimer = setTimeout(() => {
        console.log('Refreshing ScrollTrigger for AudioEngineering');
        ScrollTrigger.refresh();
    }, 1500);

    let ctx = gsap.context(() => {
        const sections = gsap.utils.toArray('.section-wrapper') as HTMLElement[];
        console.log(`AudioEngineering: found ${sections.length} sections`);
        
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

            // Parallax/Entrance animations
            if (section.firstChild) {
              gsap.fromTo(section.firstChild, 
                  {
                    opacity: 0,
                    y: 100,
                    filter: "blur(10px)",
                  },
                  {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 95%",
                        end: "top 25%",
                        scrub: 1,
                    },
                    ease: "power2.out",
                    immediateRender: false
                  }
              );
            }
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
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.1, 
                }
            });
        }

        // Mobile "Stacked" layout handling
        let mm = gsap.matchMedia();
        mm.add("(max-width: 768px)", () => {
            sections.forEach((section) => {
                if (section.firstChild) {
                  gsap.set(section.firstChild, { opacity: 1, y: 0, filter: "none" });
                }
            });
            if (pathRef.current) {
              gsap.set(pathRef.current, { display: 'none' });
            }
        });

    }, containerRef);

    return () => {
        clearTimeout(refreshTimer);
        ctx.revert();
    }
  }, []); 
 // Run once

  return (
    <Container ref={containerRef}>
      <NoiseOverlay />
      <SignalPathSVG viewBox="0 0 1000 5000" preserveAspectRatio="none">
        <path 
          ref={pathRef}
          d={signalPath}
          stroke="rgba(255, 255, 255, 0.6)" 
          strokeWidth="3" 
          fill="none"
        />
      </SignalPathSVG>
      
      <SectionWrapper id="source" className="section-wrapper">
        <SignalSource />
      </SectionWrapper>
      <SectionWrapper id="correction" className="section-wrapper">
        <CorrectionStage />
      </SectionWrapper>
      <SectionWrapper id="definition" className="section-wrapper">
        <DefinitionStage />
      </SectionWrapper>
      <SectionWrapper id="output" className="section-wrapper">
        <OutputStage />
      </SectionWrapper>
      <SectionWrapper id="console" className="section-wrapper">
        <EngineeringConsole />
      </SectionWrapper>
    </Container>
  );
}

export default AudioEngineering;
