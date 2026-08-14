import styled from '@emotion/styled';

export const BREAKPOINTS = {
  small: '40rem',
  medium: '48rem',
  large: '64rem',
  largeUp: '64.0625rem',
} as const;

export const Page = styled.main`
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

export const Shell = styled.div`
  position: relative;
  z-index: 2;
  width: min(75rem, calc(100% - var(--space-6)));
  margin: 0 auto;

  @media (max-width: ${BREAKPOINTS.small}) {
    width: calc(100% - var(--space-4));
  }
`;

export const SignalRail = styled.div`
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

export const Section = styled.section`
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
export const ChapterFolio = styled.span`
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

export const SectionTitle = styled.h2`
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

export const SectionBody = styled.p`
  max-width: 42rem;
  margin: 0;
  color: var(--color-ivory-soft);
  font-size: 1rem;
  line-height: 1.65;
`;

export const PrimaryAction = styled.a`
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
