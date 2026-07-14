import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlexBox from '../../shared/components/FlexBox';
import CinematicSection from '../audioEngineering/components/CinematicSection';
import NeonText from '@/shared/styles/NeonText';
import DiagnosticDashboard from './components/DiagnosticDashboard';
import DeliveryModel from './components/DeliveryModel';
import AuditConsole from './sections/AuditConsole';

const Container = styled(FlexBox)`
  width: 100%;
  position: relative;
  flex-direction: column;
  z-index: 10;
  pointer-events: auto;
  background: transparent;
  overflow-x: hidden;
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

const SectionLabel = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 6rem 2rem 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.3);
  z-index: 10;
`;

const DashboardWrapper = styled(FlexBox)`
  width: 100%;
  min-height: 100vh;
  padding: 2rem 0 4rem;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 10;
`;

const ConsoleWrapper = styled(FlexBox)`
  width: 100%;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 4rem 0;
`;

const AITechnicalUIOverlay = () => {
  const [tokens, setTokens] = useState(128000);
  const [complexity, setComplexity] = useState('O(n³)');

  useEffect(() => {
    const tokenTimer = setInterval(() => {
      setTokens(prev => prev + Math.floor(Math.random() * 500));
    }, 2000);

    const complexityTimer = setInterval(() => {
      const complexities = ['O(n³)', 'O(n!)', 'O(2ⁿ)', 'O(n⁴)', 'O(n² log n)'];
      setComplexity(complexities[Math.floor(Math.random() * complexities.length)]);
    }, 4000);

    return () => {
      clearInterval(tokenTimer);
      clearInterval(complexityTimer);
    };
  }, []);

  return (
    <>
      <FloatingUI top="15vh" left="5%">[SCAN_MODE: AUDIT_SLOP]</FloatingUI>
      <FloatingUI top="45vh" right="8%">[CONTEXT_WINDOW: 128K]</FloatingUI>
      <FloatingUI top="75vh" left="10%">[TOKENS_CONSUMED: {tokens.toLocaleString()}]</FloatingUI>
      <FloatingUI top="120vh" right="5%">[REFACTOR_MODE: ACTIVE]</FloatingUI>
      <FloatingUI top="180vh" left="4%">[GUARDRAILS: ENGAGED]</FloatingUI>
      <FloatingUI top="240vh" right="12%">[CYCLOMATIC_COMPLEXITY: {complexity}]</FloatingUI>
      <FloatingUI top="310vh" left="6%">[ARCHITECTURE: STABILIZING...]</FloatingUI>
      <FloatingUI top="380vh" right="7%">[TEST_COVERAGE: REBUILDING]</FloatingUI>
      <FloatingUI top="450vh" left="8%">[DEAD_CODE: PURGING]</FloatingUI>
    </>
  );
};

export default function AIDesloppification() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSectionRef = useRef(-1);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1200);

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.cinematic-section, .pin-section, .console-section') as HTMLElement[];

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
    }, containerRef);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <Container ref={containerRef}>
      <NoiseOverlay />
      <AITechnicalUIOverlay />

      {/* Section 1: Hero */}
      <CinematicSection
        id="hero"
        layout="center"
        subtitle="AI_DESLOPPIFICATION // SERVICE"
        title={<>AI GOT IT TO DEMO.<br />WE MAKE IT DEPENDABLE.</>}
        content={
          <>
            Your team has an AI-accelerated product that technically works—until the
            next feature, incident, or handoff. We audit the shortcuts, recover the
            useful parts, and turn it into software people can safely own.
            <NeonText fontSize="1rem" padding="1.5rem 0 0 0">
              [ASSESS // STABILIZE // ENABLE]
            </NeonText>
          </>
        }
      />

      {/* Section 2: Diagnostic Dashboard (The Problem) */}
      <SectionLabel>SECTION_02 // THE PROBLEM</SectionLabel>
      <DashboardWrapper>
        <DiagnosticDashboard />
      </DashboardWrapper>

      {/* Section 3: Methodology (The Solution) */}
      <CinematicSection
        id="audit"
        layout="left"
        subtitle="PHASE_01 // AUDIT & TRIAGE"
        title={<>FIND THE ROT.<br />MAP THE DAMAGE.</>}
        content={
          <>
            We trace the behavior your business depends on, identify risk, and make
            a repair plan your team can evaluate before anyone starts changing code.
            <NeonText fontSize="1rem" padding="1rem 0 0 0">
              [OUTPUT: RISK_MAP + REPAIR_PLAN]
            </NeonText>
          </>
        }
      />

      <CinematicSection
        id="refactor"
        layout="right"
        subtitle="PHASE_02 // STABILIZE & HAND OFF"
        title={<>UNTANGLE.<br />PROVE. PROCEED.</>}
        content={
          <>
            We reshape the parts that are holding delivery hostage, add guardrails
            around the risky paths, and leave behind the context needed to build the
            next thing without re-creating the problem.
            <NeonText fontSize="1rem" padding="1rem 0 0 0">
              [OUTPUT: LEGIBLE_SYSTEM + CLEAR_HANDOFF]
            </NeonText>
          </>
        }
      />

      {/* Section 4: Engagement Model */}
      <DeliveryModel id="engagement-model" />

      {/* Section 5: Audit Console (CTA) */}
      <ConsoleWrapper id="console" className="console-section">
        <AuditConsole />
      </ConsoleWrapper>
    </Container>
  );
}
