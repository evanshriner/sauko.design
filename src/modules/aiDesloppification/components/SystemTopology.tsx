import { useEffect, useLayoutEffect, useRef } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const TopologyContainer = styled.div`
  position: absolute;
  z-index: 0;
  top: 48%;
  right: clamp(-15rem, -12vw, -7rem);
  width: min(880px, 68vw);
  height: min(760px, 82vh);
  transform: translateY(-50%);
  pointer-events: none;
  opacity: 0.78;
  mask-image: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 0, 0, 0.25) 16%,
    black 39%,
    black 100%
  );

  @media (max-width: 800px) {
    top: 51%;
    right: -72%;
    width: 160vw;
    height: 88vh;
    opacity: 0.52;
    mask-image: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 0, 0, 0.18) 18%,
      black 50%,
      black 100%
    );
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 0.58;
  }
`;

const TopologySvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 0 18px rgba(224, 207, 173, 0.06));
  will-change: transform;

  .system-grid line {
    stroke: rgba(224, 207, 173, 0.075);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }

  .system-connection {
    fill: none;
    stroke: rgba(224, 207, 173, 0.25);
    stroke-width: 1.15;
    vector-effect: non-scaling-stroke;
  }

  .system-trace {
    fill: none;
    stroke: rgba(241, 225, 194, 0.92);
    stroke-width: 1.8;
    stroke-dasharray: 14 34;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 5px rgba(224, 207, 173, 0.82));
  }

  .node-frame {
    fill: rgba(16, 16, 14, 0.34);
    stroke: rgba(224, 207, 173, 0.5);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }

  .node-detail {
    fill: none;
    stroke: rgba(224, 207, 173, 0.24);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }

  .node-port {
    fill: rgba(224, 207, 173, 0.8);
    stroke: rgba(241, 237, 232, 0.88);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 7px rgba(224, 207, 173, 0.72));
  }
`;

const SystemTopology = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const context = gsap.context(() => {
      const svg = svgRef.current;
      if (!svg) return;

      const connections =
        svg.querySelectorAll<SVGPathElement>('.system-connection');
      const traces = svg.querySelectorAll<SVGPathElement>('.system-trace');
      const nodes = svg.querySelectorAll<SVGGElement>('.system-node');

      connections.forEach((connection) => {
        const length = connection.getTotalLength();
        gsap.set(connection, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      const entrance = gsap.timeline({ delay: 0.15 });
      entrance
        .fromTo(
          svg.querySelector('.system-grid'),
          { opacity: 0 },
          { opacity: 1, duration: 1.4, ease: 'power2.out' },
        )
        .to(
          connections,
          {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: 'power2.inOut',
            stagger: 0.09,
          },
          0.2,
        )
        .fromTo(
          nodes,
          { opacity: 0, scale: 0.72, transformOrigin: 'center center' },
          {
            opacity: 1,
            scale: 1,
            duration: 1.35,
            ease: 'expo.out',
            stagger: 0.1,
          },
          0.45,
        )
        .fromTo(
          traces,
          { opacity: 0 },
          { opacity: 0.9, duration: 0.7, stagger: 0.08 },
          1.35,
        );

      gsap.to(traces, {
        strokeDashoffset: -288,
        duration: 5.2,
        ease: 'none',
        repeat: -1,
        delay: 1.7,
      });

      gsap.to(svg, {
        y: -44,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.25,
        },
      });
    }, containerRef);

    return () => context.revert();
  }, []);

  return (
    <TopologyContainer ref={containerRef} aria-hidden="true">
      <TopologySvg
        ref={svgRef}
        viewBox="0 0 980 720"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="system-grid">
          <line x1="228" y1="108" x2="592" y2="108" />
          <line x1="620" y1="238" x2="930" y2="238" />
          <line x1="140" y1="620" x2="392" y2="620" />
          <line x1="610" y1="76" x2="610" y2="226" />
          <line x1="864" y1="454" x2="864" y2="650" />
          <path className="node-detail" d="M 596 108 H 624 M 610 94 V 122" />
          <path className="node-detail" d="M 850 620 H 878 M 864 606 V 634" />
        </g>

        <g className="system-connections">
          <path className="system-connection" d="M 88 354 H 330" />
          <path className="system-connection" d="M 550 292 H 636 V 172 H 714" />
          <path className="system-connection" d="M 550 350 H 688" />
          <path className="system-connection" d="M 810 350 H 920" />
          <path className="system-connection" d="M 440 430 V 546 H 674" />
          <path className="system-connection" d="M 750 408 V 544" />
          <path className="system-connection" d="M 674 588 H 250 V 402 H 330" />
        </g>

        <g className="system-traces">
          <path className="system-trace" d="M 88 354 H 330" />
          <path className="system-trace" d="M 550 350 H 688" />
          <path className="system-trace" d="M 810 350 H 920" />
          <path className="system-trace" d="M 440 430 V 546 H 674" />
        </g>

        <g className="system-node" transform="translate(68 354)">
          <circle className="node-frame" r="20" />
          <circle className="node-port" r="4" />
        </g>

        <g className="system-node">
          <rect
            className="node-frame"
            x="330"
            y="260"
            width="220"
            height="170"
            rx="2"
          />
          <path className="node-detail" d="M 330 294 H 550" />
          <circle className="node-port" cx="330" cy="354" r="4" />
          <circle className="node-port" cx="550" cy="292" r="4" />
          <circle className="node-port" cx="550" cy="350" r="4" />
          <circle className="node-port" cx="440" cy="430" r="4" />
          <path className="node-detail" d="M 348 278 H 402 M 522 278 H 532" />
          <path className="node-detail" d="M 348 317 H 438 M 348 329 H 492" />
          <rect
            className="node-detail"
            x="348"
            y="346"
            width="74"
            height="38"
          />
          <path className="node-detail" d="M 360 359 H 402 M 360 370 H 389" />
          <rect
            className="node-detail"
            x="440"
            y="346"
            width="92"
            height="38"
          />
          <path className="node-detail" d="M 452 359 H 518 M 452 370 H 492" />
          <path className="node-detail" d="M 348 405 H 458 M 470 405 H 496" />
        </g>

        <g className="system-node">
          <rect
            className="node-frame"
            x="714"
            y="130"
            width="122"
            height="82"
            rx="2"
          />
          <path className="node-detail" d="M 714 158 H 836 M 730 180 H 820" />
          <circle className="node-port" cx="714" cy="172" r="4" />
          <path className="node-detail" d="M 730 145 H 782 M 793 145 H 820" />
          <path className="node-detail" d="M 730 193 H 784 M 730 202 H 806" />
        </g>

        <g className="system-node">
          <path
            className="node-frame"
            d="M 750 292 L 812 350 L 750 408 L 688 350 Z"
          />
          <circle className="node-port" cx="688" cy="350" r="4" />
          <circle className="node-port" cx="812" cy="350" r="4" />
          <circle className="node-port" cx="750" cy="408" r="4" />
          <path
            className="node-detail"
            d="M 750 326 L 774 350 L 750 374 L 726 350 Z"
          />
          <circle className="node-port" cx="750" cy="350" r="3" />
        </g>

        <g className="system-node">
          <rect
            className="node-frame"
            x="674"
            y="544"
            width="154"
            height="88"
            rx="44"
          />
          <circle className="node-port" cx="674" cy="588" r="4" />
          <circle className="node-port" cx="750" cy="544" r="4" />
          <circle className="node-detail" cx="720" cy="588" r="8" />
          <circle className="node-detail" cx="750" cy="588" r="8" />
          <circle className="node-detail" cx="780" cy="588" r="8" />
          <path className="node-detail" d="M 712 610 H 788" />
        </g>

        <g className="system-node" transform="translate(930 350)">
          <circle className="node-frame" r="28" />
          <circle className="node-detail" r="16" />
          <circle className="node-port" r="4" />
        </g>
      </TopologySvg>
    </TopologyContainer>
  );
};

export default SystemTopology;
