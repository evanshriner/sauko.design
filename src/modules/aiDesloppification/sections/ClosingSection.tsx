import styled from '@emotion/styled';
import {
  BREAKPOINTS,
  Shell,
  Section,
  ChapterFolio,
  SectionTitle,
  PrimaryAction,
} from '../styles';
import { BOOKING_URL } from '@/shared/constants/booking';

const ClosingRoot = styled(Section)`
  padding-top: var(--space-8);
  padding-bottom: var(--space-8);

  @media (max-width: ${BREAKPOINTS.small}) {
    padding-top: var(--space-5);
    padding-bottom: var(--space-5);
  }
`;

const ClosingLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(16rem, 0.65fr);
  gap: var(--space-5) var(--space-7);
  padding: var(--space-5);
  align-items: end;
  background: var(--color-boundary-fill);

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    padding: var(--space-4);
  }

  @media (max-width: ${BREAKPOINTS.small}) {
    padding: var(--space-3);
  }
`;

const ClosingTitle = styled(SectionTitle)`
  max-width: 13ch;
  color: var(--color-sepia);
  filter: url(#neonGlow) drop-shadow(0 0.4rem 1.25rem var(--color-major-glow));
`;

const ClosingBody = styled.div`
  color: var(--color-ivory-soft);
  font-size: 1rem;
  line-height: 1.62;

  p {
    margin: 0;
  }

  ul {
    display: grid;
    gap: var(--space-1);
    margin: var(--space-3) 0 0;
    padding: var(--space-3) 0 0 var(--space-3);
    border-top: 1px solid var(--color-line);
  }

  li::marker {
    color: var(--color-sepia-soft);
  }
`;

const ClosingAction = styled(PrimaryAction)`
  margin-top: var(--space-3);

  @media (max-width: ${BREAKPOINTS.small}) {
    width: 100%;
  }
`;

export default function ClosingSection() {
  return (
    <ClosingRoot aria-labelledby="closing-title" data-chapter-section>
      <Shell>
        <ChapterFolio aria-hidden="true" data-chapter-reveal>
          04 / 04
        </ChapterFolio>
        <ClosingLayout data-chapter-reveal>
          <ClosingTitle id="closing-title">
            Make the next change safely.
          </ClosingTitle>
          <ClosingBody>
            <p>
              Bring the AI-accelerated application that works, but has become
              difficult to explain, extend, or put into production. We will
              identify what is sound, recover the structure around it, and
              define the smallest safe path forward.
            </p>
            <ul>
              <li>The core workflow that already works</li>
              <li>Where the code becomes difficult to understand or change</li>
              <li>The next release or product outcome you need to support</li>
            </ul>
            <ClosingAction
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start a system assessment
            </ClosingAction>
          </ClosingBody>
        </ClosingLayout>
      </Shell>
    </ClosingRoot>
  );
}
