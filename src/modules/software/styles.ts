import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const revealLabel = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.35rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Page = styled.main`
  --lab-ivory: ${({ theme }) => theme.colors.primaryText};
  --lab-ivory-soft: rgba(241, 237, 232, 0.74);
  --lab-ivory-muted: rgba(241, 237, 232, 0.5);
  --lab-sepia: rgba(224, 207, 173, 0.94);
  --lab-sepia-soft: rgba(224, 207, 173, 0.64);
  --lab-line: rgba(241, 237, 232, 0.14);
  --lab-line-strong: rgba(224, 207, 173, 0.38);
  --lab-charcoal: rgba(13, 13, 12, 0.9);
  --lab-charcoal-solid: #0d0d0c;
  --lab-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --lab-nav-offset: 5.35rem;

  position: relative;
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
  min-height: 100svh;
  margin-top: calc(var(--lab-nav-offset) * -1);
  padding-top: var(--lab-nav-offset);
  overflow: hidden;
  color: var(--lab-ivory);
  font-family: 'Rubik', sans-serif;
  text-align: left;
  pointer-events: auto;
  background: radial-gradient(
      circle at 54% 54%,
      rgba(224, 207, 173, 0.055),
      transparent 36rem
    ),
    linear-gradient(
      180deg,
      rgba(13, 13, 12, 0.16),
      rgba(13, 13, 12, 0.92) 48rem
    );
  scrollbar-color: var(--lab-sepia-soft) var(--lab-charcoal-solid);

  * {
    box-sizing: border-box;
  }

  ::selection {
    color: var(--lab-charcoal-solid);
    background: var(--lab-sepia);
  }

  a,
  button {
    -webkit-tap-highlight-color: transparent;
  }

  @media (max-width: 40rem) {
    --lab-nav-offset: 4.25rem;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export const Workbench = styled.section`
  position: relative;
  display: grid;
  width: 100%;
  min-height: max(44rem, calc(100svh - var(--lab-nav-offset)));
  padding: clamp(7.25rem, 14vh, 9.5rem) clamp(1.5rem, 4vw, 4rem)
    clamp(2rem, 4.5vh, 3.5rem);
  grid-template-rows: max-content minmax(0, 1fr);
  gap: clamp(1.75rem, 3.5vh, 3rem);
  isolation: isolate;

  &::before {
    position: absolute;
    top: clamp(6.25rem, 12vh, 8.25rem);
    left: clamp(1.5rem, 4vw, 4rem);
    width: min(9rem, 18vw);
    height: 1px;
    content: '';
    background: var(--lab-line-strong);
  }

  @media (max-width: 52rem) {
    min-height: 0;
    padding: 6.5rem 1.25rem 2.5rem;
    gap: 2.25rem;

    &::before {
      top: 5.25rem;
      left: 1.25rem;
      width: 5rem;
    }
  }
`;

export const LabHeader = styled.header`
  position: relative;
  z-index: 4;
  width: max-content;
  max-width: 100%;

  h1 {
    margin: 0;
    color: var(--lab-ivory);
    font-family: 'Inclusive Sans', sans-serif;
    font-size: clamp(3.4rem, 4.8vw, 5.4rem);
    font-weight: 400;
    letter-spacing: -0.035em;
    line-height: 0.86;
    white-space: nowrap;
    filter: url(#neonGlow);
  }

  p {
    max-width: 22rem;
    margin: 1.1rem 0 0;
    color: var(--lab-ivory-soft);
    font-size: clamp(0.75rem, 0.82vw, 0.86rem);
    line-height: 1.5;
  }

  @media (max-width: 52rem) {
    h1 {
      font-size: clamp(3.25rem, 15vw, 5rem);
      line-height: 0.9;
    }

    p {
      margin-top: 1rem;
      font-size: 0.82rem;
    }
  }
`;

export const StageControls = styled.div`
  position: relative;
  z-index: 5;
  display: flex;
  width: max-content;
  margin-top: 1.25rem;
  align-items: center;
  gap: 0.65rem;

  span {
    min-width: 4.2rem;
    color: var(--lab-ivory-muted);
    font-family: 'Orbit', sans-serif;
    font-size: 0.58rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.12em;
    text-align: center;
  }
`;

export const ControlButton = styled.button`
  display: inline-flex;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--lab-line-strong);
  border-radius: 0;
  color: var(--lab-ivory);
  appearance: none;
  background: rgba(13, 13, 12, 0.36);
  cursor: pointer;
  transition:
    color 220ms var(--lab-ease),
    background-color 220ms var(--lab-ease),
    border-color 220ms var(--lab-ease),
    transform 220ms var(--lab-ease);

  svg {
    width: 1rem;
    height: 1rem;
    fill: none;
    stroke: currentColor;
    stroke-linecap: square;
    stroke-width: 1.35;
  }

  &:hover {
    border-color: var(--lab-sepia);
    color: var(--lab-charcoal-solid);
    background: var(--lab-sepia);
    transform: translateY(-0.1rem);
  }

  &:focus-visible {
    outline: 3px solid var(--lab-ivory);
    outline-offset: 4px;
  }
`;

export const ShutterStage = styled.nav`
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: clamp(28rem, 54vh, 42rem);
  align-self: stretch;
  gap: clamp(0.35rem, 0.55vw, 0.7rem);

  @media (max-width: 64rem) and (min-width: 52.0625rem) {
    min-height: clamp(25rem, 52vh, 34rem);
  }

  @media (max-width: 52rem) {
    display: flex;
    min-height: 0;
    flex-direction: column;
    gap: 0;
    border-bottom: 1px solid var(--lab-line);
  }
`;

export const ProjectShutter = styled(motion.article, {
  shouldForwardProp: (property) => property !== '$active',
})<{ $active: boolean }>`
  position: relative;
  min-width: 4.75rem;
  overflow: hidden;
  flex-basis: 0;
  border: 1px solid
    ${({ $active }) => ($active ? 'var(--lab-line-strong)' : 'var(--lab-line)')};
  background: var(--lab-charcoal-solid);
  isolation: isolate;
  transition: border-color 260ms var(--lab-ease);
  will-change: flex-grow;

  @media (max-width: 52rem) {
    width: 100%;
    min-width: 0;
    height: ${({ $active }) => ($active ? 'min(84vw, 23rem)' : '5.35rem')};
    flex: 0 0 auto !important;
    border-bottom: 0;
    transition:
      height 520ms var(--lab-ease),
      border-color 260ms var(--lab-ease);
    will-change: height;

    &:last-child {
      border-bottom: 1px solid var(--lab-line);
    }
  }
`;

export const ShutterImage = styled.img<{
  $active: boolean;
  $position: string;
}>`
  position: absolute;
  top: 0;
  left: ${({ $active }) => ($active ? 0 : '50%')};
  display: block;
  width: max(42rem, 58vw);
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: ${({ $position }) => $position};
  pointer-events: none;
  transform: ${({ $active }) =>
    $active ? 'scale(1)' : 'translateX(-50%) scale(1.035)'};
  filter: ${({ $active }) =>
    $active
      ? 'saturate(0.74) contrast(1.04) brightness(0.84)'
      : 'saturate(0.42) contrast(1.08) brightness(0.44)'};
  transition:
    left 520ms var(--lab-ease),
    filter 300ms var(--lab-ease),
    transform 520ms var(--lab-ease);

  @media (max-width: 52rem) {
    left: 0;
    width: 100%;
    transform: scale(${({ $active }) => ($active ? 1 : 1.035)});
  }
`;

export const ShutterSelect = styled.button<{ $active: boolean }>`
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  color: var(--lab-ivory);
  appearance: none;
  text-align: left;
  background: transparent;
  cursor: pointer;

  &::after {
    position: absolute;
    z-index: 1;
    inset: 0;
    content: '';
    pointer-events: none;
    background: ${({ $active }) =>
      $active
        ? 'linear-gradient(180deg, rgba(13, 13, 12, 0.08) 24%, rgba(13, 13, 12, 0.2) 50%, rgba(13, 13, 12, 0.94) 100%)'
        : 'linear-gradient(180deg, rgba(13, 13, 12, 0.24), rgba(13, 13, 12, 0.5) 48%, rgba(13, 13, 12, 0.97) 100%)'};
    transition: background 260ms var(--lab-ease);
  }

  &:hover > img {
    filter: ${({ $active }) =>
      $active
        ? 'saturate(0.78) contrast(1.04) brightness(0.9)'
        : 'saturate(0.52) contrast(1.06) brightness(0.56)'};
  }

  &:focus-visible {
    outline: 3px solid var(--lab-ivory);
    outline-offset: -4px;
  }
`;

export const ShutterIndex = styled.span<{ $active: boolean }>`
  position: absolute;
  z-index: 2;
  top: 1.15rem;
  left: 1.15rem;
  color: ${({ $active }) =>
    $active ? 'var(--lab-sepia)' : 'var(--lab-ivory-muted)'};
  font-family: 'Orbit', sans-serif;
  font-size: 0.58rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.14em;
  line-height: 1;
  text-shadow: 0 0.2rem 0.8rem var(--lab-charcoal);

  &::before {
    display: inline-block;
    width: 0.35rem;
    height: 0.35rem;
    margin-right: 0.55rem;
    border: 1px solid
      ${({ $active }) =>
        $active ? 'var(--lab-sepia)' : 'var(--lab-line-strong)'};
    content: '';
    background: ${({ $active }) =>
      $active ? 'var(--lab-sepia)' : 'transparent'};
    vertical-align: 0.02rem;
  }

  @media (max-width: 52rem) {
    top: ${({ $active }) => ($active ? '1rem' : '50%')};
    left: 1rem;
    transform: ${({ $active }) => ($active ? 'none' : 'translateY(-50%)')};
  }
`;

export const ShutterIdentity = styled.span<{ $active: boolean }>`
  position: absolute;
  z-index: 2;
  right: ${({ $active }) => ($active ? '9.5rem' : '1rem')};
  bottom: 1.2rem;
  left: 1.15rem;
  display: block;
  min-width: 0;
  animation: ${({ $active }) => ($active ? revealLabel : 'none')} 340ms
    var(--lab-ease) both;

  @media (max-width: 52rem) {
    top: ${({ $active }) => ($active ? 'auto' : '50%')};
    right: 1rem;
    bottom: ${({ $active }) => ($active ? '4.8rem' : 'auto')};
    left: ${({ $active }) => ($active ? '1rem' : '4rem')};
    transform: ${({ $active }) => ($active ? 'none' : 'translateY(-50%)')};
  }
`;

export const ShutterName = styled.span<{ $active: boolean }>`
  display: block;
  max-width: 100%;
  overflow: hidden;
  color: ${({ $active }) =>
    $active ? 'var(--lab-ivory)' : 'var(--lab-ivory-soft)'};
  font-family: 'Inclusive Sans', sans-serif;
  font-size: ${({ $active }) =>
    $active
      ? 'clamp(2rem, 3.35vw, 3.65rem)'
      : 'clamp(0.82rem, 1.08vw, 1.15rem)'};
  font-weight: 400;
  letter-spacing: ${({ $active }) => ($active ? '-0.03em' : '-0.02em')};
  line-height: ${({ $active }) => ($active ? 0.92 : 1.05)};
  overflow-wrap: normal;
  text-shadow: 0 0.35rem 1.25rem var(--lab-charcoal);

  @media (max-width: 52rem) {
    font-size: ${({ $active }) =>
      $active ? 'clamp(2rem, 9vw, 3rem)' : '1.2rem'};
    line-height: ${({ $active }) => ($active ? 0.94 : 1)};
    white-space: ${({ $active }) => ($active ? 'normal' : 'nowrap')};
  }
`;

export const ShutterMeta = styled.span<{ $active: boolean }>`
  display: block;
  max-height: ${({ $active }) => ($active ? '2rem' : 0)};
  margin-top: ${({ $active }) => ($active ? '0.55rem' : 0)};
  overflow: hidden;
  color: var(--lab-sepia-soft);
  font-family: 'Orbit', sans-serif;
  font-size: 0.55rem;
  letter-spacing: 0.09em;
  line-height: 1.35;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
  transition:
    max-height 260ms var(--lab-ease),
    margin 260ms var(--lab-ease),
    opacity 200ms var(--lab-ease);
`;

export const ShutterStatus = styled.span`
  position: absolute;
  z-index: 3;
  top: 1.15rem;
  right: 1.15rem;
  color: rgba(241, 237, 232, 0.78);
  font-family: 'Orbit', sans-serif;
  font-size: 0.58rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
  pointer-events: none;
  text-shadow: 0 0.2rem 0.8rem var(--lab-charcoal);

  @media (max-width: 52rem) {
    top: 1rem;
    right: 1rem;
  }
`;

export const VisitLink = styled(motion.a)`
  position: absolute;
  z-index: 4;
  right: 1.2rem;
  bottom: 1.2rem;
  display: inline-flex;
  min-height: 2.75rem;
  padding: 0 1rem;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid rgba(241, 237, 232, 0.52);
  color: var(--lab-ivory);
  font-size: 0.74rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-decoration: none;
  background: rgba(13, 13, 12, 0.68);
  backdrop-filter: blur(0.7rem);
  transition:
    color 220ms var(--lab-ease),
    background-color 220ms var(--lab-ease),
    border-color 220ms var(--lab-ease),
    transform 220ms var(--lab-ease);

  svg {
    width: 0.9rem;
    height: 0.9rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.4;
  }

  &:hover {
    border-color: var(--lab-sepia);
    color: var(--lab-charcoal-solid);
    background: var(--lab-sepia);
    transform: translateY(-0.1rem);
  }

  &:focus-visible {
    outline: 3px solid var(--lab-ivory);
    outline-offset: 4px;
  }

  @media (max-width: 52rem) {
    right: auto;
    bottom: 1rem;
    left: 1rem;
  }
`;

export const ScreenReaderText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
  margin: -1px;
  white-space: nowrap;
`;
