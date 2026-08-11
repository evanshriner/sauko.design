import styled from '@emotion/styled';

const Diagram = styled.figure`
  width: 100%;
  margin: 0;
  padding: var(--space-2) 0;
`;

const DiagramSvg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  font-family: var(--font-body);

  .boundary {
    fill: var(--color-boundary-fill);
    stroke: var(--color-line-strong);
    stroke-width: 1;
    stroke-dasharray: 7 7;
    vector-effect: non-scaling-stroke;
  }

  .boundary-label,
  .rollback-label {
    fill: var(--color-sepia-soft);
    font-family: var(--font-technical);
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.04em;
  }

  .system-route,
  .rollback-route {
    fill: none;
    stroke: var(--color-line-strong);
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
  }

  .rollback-route {
    stroke-dasharray: 5 7;
  }

  .system-trace {
    fill: none;
    stroke: var(--color-sepia);
    stroke-width: 2.5;
    stroke-dasharray: 18 34;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 6px var(--color-signal-glow));
    animation: recovery-signal 6.4s linear infinite;
  }

  .node {
    fill: var(--color-charcoal-soft);
    stroke: var(--color-line-strong);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }

  .node-port {
    fill: var(--color-sepia);
    stroke: var(--color-ivory);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }

  .system-node .node-port {
    transform-box: fill-box;
    transform-origin: center;
    animation: node-signal 6.4s var(--ease-out) infinite;
  }

  .system-node:nth-of-type(2) .node-port {
    animation-delay: 1.4s;
  }

  .system-node:nth-of-type(3) .node-port {
    animation-delay: 2.8s;
  }

  .system-node:nth-of-type(4) .node-port {
    animation-delay: 4.2s;
  }

  .node-label {
    fill: var(--color-ivory);
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 400;
    letter-spacing: -0.02em;
    text-anchor: middle;
  }

  @keyframes recovery-signal {
    to {
      stroke-dashoffset: -208;
    }
  }

  @keyframes node-signal {
    0%,
    8%,
    100% {
      opacity: 0.55;
      transform: scale(0.82);
    }
    14% {
      opacity: 1;
      transform: scale(1.45);
    }
    24% {
      opacity: 0.78;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .system-trace,
    .node-port {
      animation: none;
    }
  }
`;

const SystemTopology = () => (
  <Diagram aria-hidden="true">
    <DiagramSvg
      viewBox="0 0 720 500"
      role="img"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id="recovery-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="var(--color-sepia-soft)" />
        </marker>
      </defs>

      <rect className="boundary" x="245" y="38" width="230" height="334" />
      <text className="boundary-label" x="265" y="69">
        Customer-data boundary
      </text>

      <path className="system-route" d="M 220 135 H 360 V 280 H 510" />
      <path className="system-trace" d="M 220 135 H 360 V 280 H 510" />

      <path
        className="rollback-route"
        d="M 600 315 V 430 H 130 V 170"
        markerEnd="url(#recovery-arrow)"
      />
      <text className="rollback-label" x="365" y="462" textAnchor="middle">
        Rollback path
      </text>

      <g className="system-node">
        <rect className="node" x="40" y="100" width="180" height="70" />
        <circle className="node-port" cx="220" cy="135" r="4" />
        <text className="node-label" x="130" y="141">
          Product workflow
        </text>
      </g>

      <g className="system-node">
        <rect className="node" x="270" y="100" width="180" height="70" />
        <circle className="node-port" cx="270" cy="135" r="4" />
        <circle className="node-port" cx="360" cy="170" r="4" />
        <text className="node-label" x="360" y="141">
          Model boundary
        </text>
      </g>

      <g className="system-node">
        <rect className="node" x="270" y="245" width="180" height="70" />
        <circle className="node-port" cx="360" cy="245" r="4" />
        <circle className="node-port" cx="450" cy="280" r="4" />
        <text className="node-label" x="360" y="286">
          Review + tests
        </text>
      </g>

      <g className="system-node">
        <rect className="node" x="510" y="245" width="180" height="70" />
        <circle className="node-port" cx="510" cy="280" r="4" />
        <circle className="node-port" cx="600" cy="315" r="4" />
        <text className="node-label" x="600" y="286">
          Release path
        </text>
      </g>
    </DiagramSvg>
  </Diagram>
);

export default SystemTopology;
