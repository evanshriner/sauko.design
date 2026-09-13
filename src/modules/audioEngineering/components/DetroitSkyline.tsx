import { useRef, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SkylineContainer = styled.div`
  position: absolute;
  top: 45%;
  left: 0;
  width: 100%;
  height: 65vh;
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
  opacity: 0.18;
  filter: grayscale(100%) brightness(1.1);
`;

const SkylineSVG = styled.svg`
  width: 100%;
  height: 100%;
  will-change: transform;
`;

export const DetroitSkyline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Floating parallax effect
        gsap.to(svgRef.current, {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          }
        });

        // Dimensional entrance
        const layers = svgRef.current?.querySelectorAll('.skyline-layer');
        if (layers) {
          layers.forEach((layer, i) => {
            const buildings = layer.querySelectorAll('.building-group');
            gsap.fromTo(buildings, 
              { opacity: 0, y: 60, scaleY: 0.7 },
              { 
                opacity: 1, 
                y: 0, 
                scaleY: 1,
                stagger: 0.05,
                duration: 2.5,
                delay: i * 0.2, // Back layers reveal slightly earlier/later
                ease: "expo.out",
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: "top 85%",
                  toggleActions: "play none none reverse"
                }
              }
            );
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <SkylineContainer ref={containerRef}>
      <SkylineSVG 
        ref={svgRef}
        viewBox="0 0 1440 600" 
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="backBuilding" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
          </linearGradient>
          <linearGradient id="midBuilding" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.35)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
          </linearGradient>
          <linearGradient id="frontBuilding" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.15)" />
          </linearGradient>
          
          <pattern id="windowPattern" x="0" y="0" width="12" height="18" patternUnits="userSpaceOnUse">
            <rect x="2" y="4" width="3" height="5" fill="rgba(255, 255, 255, 0.12)" />
            <rect x="7" y="4" width="3" height="5" fill="rgba(255, 255, 255, 0.12)" />
          </pattern>
        </defs>

        {/* LAYER 1: BACK (Distant horizon, tightly packed) */}
        <g className="skyline-layer" transform="translate(0, 150)">
          <g className="building-group">
            <rect x="400" y="320" width="80" height="280" fill="url(#backBuilding)" />
            <rect x="520" y="350" width="60" height="250" fill="url(#backBuilding)" />
            <rect x="860" y="340" width="70" height="260" fill="url(#backBuilding)" />
            <rect x="980" y="310" width="90" height="290" fill="url(#backBuilding)" />
          </g>
        </g>

        {/* LAYER 2: MID (Secondary towers, overlapping back) */}
        <g className="skyline-layer" transform="translate(0, 100)">
          <g className="building-group">
            {/* Left Mid Cluster */}
            <rect x="150" y="380" width="50" height="220" fill="url(#midBuilding)" />
            <rect x="180" y="340" width="60" height="260" fill="url(#midBuilding)" />
            <rect x="220" y="280" width="45" height="320" fill="url(#midBuilding)" />
            
            {/* Guardian/Ally Center area */}
            <path d="M 330 600 L 330 220 L 355 180 L 380 220 L 380 600 Z" fill="url(#midBuilding)" />
            <rect x="400" y="260" width="55" height="340" fill="url(#midBuilding)" />
            
            {/* Right Mid Cluster */}
            <rect x="920" y="280" width="65" height="320" fill="url(#midBuilding)" />
            <path d="M 1040 600 L 1040 200 L 1065 160 L 1090 200 L 1090 600 Z" fill="url(#midBuilding)" />
            <rect x="1120" y="340" width="50" height="260" fill="url(#midBuilding)" />
          </g>
        </g>

        {/* LAYER 3: FRONT (Primary icons, large overlaps) */}
        <g className="skyline-layer" transform="translate(0, 50)">
          {/* Renaissance Center - The core dense cluster */}
          <g className="building-group">
            {/* Distant Pods */}
            <rect x="560" y="320" width="70" height="280" fill="url(#frontBuilding)" opacity="0.6" />
            <rect x="810" y="320" width="70" height="280" fill="url(#frontBuilding)" opacity="0.6" />
            
            {/* Overlapping Mid Pods */}
            <rect x="610" y="260" width="75" height="340" fill="url(#frontBuilding)" opacity="0.8" />
            <rect x="755" y="260" width="75" height="340" fill="url(#frontBuilding)" opacity="0.8" />
            
            {/* Main Central Tower - Foreground focal point */}
            <rect x="680" y="140" width="80" height="460" fill="url(#frontBuilding)" />
            <rect x="680" y="140" width="80" height="460" fill="url(#windowPattern)" />
            <rect x="680" y="180" width="80" height="15" fill="rgba(255,255,255,0.15)" />
            <rect x="718" y="100" width="4" height="40" fill="rgba(255,255,255,0.4)" />
          </g>

          {/* Additional Frontal Overlaps */}
          <g className="building-group">
            <rect x="260" y="420" width="80" height="180" fill="url(#frontBuilding)" />
            <rect x="260" y="420" width="80" height="180" fill="url(#windowPattern)" />
          </g>
          
          <g className="building-group">
            <rect x="1080" y="400" width="70" height="200" fill="url(#frontBuilding)" />
            <rect x="1080" y="400" width="70" height="200" fill="url(#windowPattern)" />
          </g>
        </g>
      </SkylineSVG>
    </SkylineContainer>
  );
};
