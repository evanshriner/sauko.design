import styled from '@emotion/styled';
import { RECOVERY_MAP_ID } from '../data';
import {
  BREAKPOINTS,
  ChapterFolio,
  Section,
  SectionBody,
  SectionTitle,
  Shell,
} from '../styles';

const RecoveryRoot = styled(Section)`
  padding-top: var(--space-8);
  padding-bottom: var(--space-7);

  @media (max-width: ${BREAKPOINTS.small}) {
    padding-top: var(--space-6);
    padding-bottom: var(--space-5);
  }
`;

const RecoveryHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-4);

  > h2 {
    grid-column: 1 / span 8;
  }

  > p {
    grid-column: 8 / -1;
    margin-top: var(--space-4);
  }

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: 1fr;
    gap: var(--space-3);

    > h2,
    > p {
      grid-column: 1;
      margin-top: 0;
    }
  }
`;

const RiskPrinciple = styled.div`
  display: grid;
  grid-template-columns: minmax(14rem, 0.72fr) minmax(0, 1.28fr);
  gap: var(--space-3) var(--space-6);
  width: min(62rem, calc(100% - var(--space-6)));
  margin-top: var(--space-7);
  margin-left: auto;
  padding: var(--space-4);
  border-top: 1px solid var(--color-line-strong);
  border-bottom: 1px solid var(--color-line);
  align-items: baseline;
  background: var(--color-boundary-fill);

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: 1fr;
    width: 100%;
    margin-top: var(--space-4);
    padding: var(--space-3);
  }
`;

const RiskPrincipleTitle = styled.h3`
  margin: 0;
  color: var(--color-sepia);
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.1;
`;

const RiskPrincipleBody = styled.p`
  max-width: 46rem;
  margin: 0;
  color: var(--color-ivory-soft);
  font-size: 1rem;
  line-height: 1.65;
`;

export default function RecoverySection() {
  return (
    <RecoveryRoot
      id={RECOVERY_MAP_ID}
      aria-labelledby="recovery-title"
      data-chapter-section
    >
      <Shell>
        <ChapterFolio aria-hidden="true" data-chapter-reveal>
          01 / 04
        </ChapterFolio>
        <RecoveryHeader data-chapter-reveal>
          <SectionTitle id="recovery-title">
            The expensive part starts after it works.
          </SectionTitle>
          <SectionBody>
            AI can compress the path to a working product. It does not remove
            the need for architecture, verification, and ownership. When
            generation outpaces understanding, that gap becomes operating risk.
          </SectionBody>
        </RecoveryHeader>

        <RiskPrinciple data-chapter-reveal>
          <RiskPrincipleTitle>
            Working and operable are different states.
          </RiskPrincipleTitle>
          <RiskPrincipleBody>
            Recovery closes the gap between code that produces the right result
            today and a system a team can explain, test, release, and change
            tomorrow. We keep the product insight, then make its boundaries,
            decisions, and failure paths explicit.
          </RiskPrincipleBody>
        </RiskPrinciple>
      </Shell>
    </RecoveryRoot>
  );
}
