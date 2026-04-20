import { useRef, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SkylineContainer = styled.div`
  position: absolute;
  top: 45%;
  left: 0;
  width: 100%;
  height: 60vh;
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
  opacity: 0.15;
  filter: grayscale(100%) brightness(1.2);
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
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });

        // Building reveal with staggered scale/fade
        const groups = svgRef.current?.querySelectorAll('.building-group');
        if (groups) {
          gsap.fromTo(groups, 
            { opacity: 0, y: 40, scaleY: 0.8 },
            { 
              opacity: 1, 
              y: 0, 
              scaleY: 1,
              stagger: 0.08,
              duration: 2.5,
              ease: "expo.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
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
          <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
          </linearGradient>
          
          <pattern id="windowPattern" x="0" y="0" width="10" height="15" patternUnits="userSpaceOnUse">
            <rect x="2" y="4" width="2" height="4" fill="rgba(255, 255, 255, 0.15)" />
            <rect x="6" y="4" width="2" height="4" fill="rgba(255, 255, 255, 0.15)" />
          </pattern>
        </defs>

        <g transform="translate(0, 100)">
          {/* Left Side Cluster */}
          <g className="building-group">
            <rect x="50" y="380" width="60" height="220" fill="url(#buildingGrad)" />
            <rect x="50" y="380" width="60" height="220" fill="url(#windowPattern)" />
            <rect x="75" y="360" width="10" height="20" fill="rgba(255,255,255,0.3)" />
          </g>

          <g className="building-group">
            <rect x="130" y="320" width="45" height="280" fill="url(#buildingGrad)" />
            <rect x="130" y="320" width="45" height="280" fill="url(#windowPattern)" />
          </g>

          <g className="building-group">
            <rect x="200" y="250" width="70" height="350" fill="url(#buildingGrad)" />
            <rect x="200" y="250" width="70" height="350" fill="url(#windowPattern)" />
            <rect x="230" y="230" width="10" height="20" fill="rgba(255,255,255,0.3)" />
          </g>

          {/* Ally Detroit Center / Guardian Area - More complex shapes */}
          <g className="building-group">
            <path d="M 300 600 L 300 180 L 320 140 L 340 180 L 340 600 Z" fill="url(#buildingGrad)" />
            <rect x="300" y="180" width="40" height="420" fill="url(#windowPattern)" />
            <rect x="318" y="100" width="4" height="40" fill="rgba(255,255,255,0.4)" />
          </g>

          <g className="building-group">
            <rect x="360" y="340" width="50" height="260" fill="url(#buildingGrad)" />
            <rect x="360" y="340" width="50" height="260" fill="url(#windowPattern)" />
          </g>

          <g className="building-group">
            <rect x="430" y="220" width="60" height="380" fill="url(#buildingGrad)" />
            <rect x="430" y="220" width="60" height="380" fill="url(#windowPattern)" />
          </g>

          {/* Renaissance Center (RenCen) - Dimensionalized */}
          <g className="building-group">
            {/* Outer Pods */}
            <rect x="550" y="280" width="60" height="320" fill="url(#buildingGrad)" opacity="0.7" />
            <rect x="830" y="280" width="60" height="320" fill="url(#buildingGrad)" opacity="0.7" />
            
            {/* Inner Pods */}
            <rect x="620" y="220" width="60" height="380" fill="url(#buildingGrad)" opacity="0.8" />
            <rect x="760" y="220" width="60" height="380" fill="url(#buildingGrad)" opacity="0.8" />
            
            {/* Center Tower */}
            <rect x="690" y="120" width="60" height="480" fill="url(#buildingGrad)" />
            <rect x="690" y="120" width="60" height="480" fill="url(#windowPattern)" />
            <circle cx="720" cy="150" r="20" fill="rgba(255,255,255,0.2)" /> {/* Observation Deck effect */}
            <rect x="718" y="80" width="4" height="40" fill="rgba(255,255,255,0.5)" />
          </g>

          {/* One Detroit Center / Penobscot area */}
          <g className="building-group">
            <rect x="940" y="260" width="55" height="340" fill="url(#buildingGrad)" />
            <rect x="940" y="260" width="55" height="340" fill="url(#windowPattern)" />
          </g>

          <g className="building-group">
            <path d="M 1020 600 L 1020 180 L 1045 140 L 1070 180 L 1070 600 Z" fill="url(#buildingGrad)" />
            <rect x="1020" y="180" width="50" height="420" fill="url(#windowPattern)" />
            <rect x="1043" y="110" width="4" height="30" fill="rgba(255,255,255,0.3)" />
          </g>

          <g className="building-group">
            <rect x="1100" y="320" width="45" height="280" fill="url(#buildingGrad)" />
            <rect x="1100" y="320" width="45" height="280" fill="url(#windowPattern)" />
          </g>

          {/* Far Right horizon */}
          <g className="building-group">
            <rect x="1180" y="400" width="60" height="200" fill="url(#buildingGrad)" opacity="0.6" />
            <rect x="1260" y="440" width="50" height="160" fill="url(#buildingGrad)" opacity="0.5" />
            <rect x="1330" y="460" width="60" height="140" fill="url(#buildingGrad)" opacity="0.4" />
          </g>
        </g>
      </SkylineSVG>
    </SkylineContainer>
  );
};
