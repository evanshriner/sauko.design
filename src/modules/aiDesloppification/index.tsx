import { useRef } from 'react';
import { useAIDesloppificationAnimations } from './hooks/useAIDesloppificationAnimations';
import HeroSection from './sections/HeroSection';
import RecoverySection from './sections/RecoverySection';
import DiagnosticsSection from './sections/DiagnosticsSection';
import EngagementSection from './sections/EngagementSection';
import ClosingSection from './sections/ClosingSection';
import { Page, SignalRail } from './styles';

export default function AIDesloppification() {
  const pageRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);

  useAIDesloppificationAnimations(pageRef, heroContentRef, heroVisualRef);

  return (
    <Page
      ref={pageRef}
      id="ai-isolated-themed"
      aria-labelledby="ai-desloppification-title"
    >
      <SignalRail aria-hidden="true" />
      <HeroSection
        heroContentRef={heroContentRef}
        heroVisualRef={heroVisualRef}
      />
      <RecoverySection />
      <DiagnosticsSection />
      <EngagementSection />
      <ClosingSection />
    </Page>
  );
}
