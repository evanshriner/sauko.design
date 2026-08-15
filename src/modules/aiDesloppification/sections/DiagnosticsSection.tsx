import styled from '@emotion/styled';
import { diagnostics } from '../data';
import {
  BREAKPOINTS,
  ChapterFolio,
  Section,
  SectionBody,
  SectionTitle,
  Shell,
} from '../styles';

const SectionHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.72fr);
  gap: var(--space-4) var(--space-6);
  align-items: end;
  margin-bottom: var(--space-5);

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: 1fr;
    margin-bottom: var(--space-4);
  }
`;

const DiagnosticHeader = styled(SectionHeader)`
  margin-bottom: var(--space-4);
`;

const DiagnosticSection = styled(Section)`
  padding-top: var(--space-6);
  padding-bottom: var(--space-7);
  border-top-color: var(--color-line-strong);

  @media (max-width: ${BREAKPOINTS.small}) {
    padding: var(--space-5) 0;
  }
`;

const DiagnosticList = styled.div`
  padding: 0 var(--space-4);
  border-top: 1px solid var(--color-line-strong);
  background: var(--color-section-wash);

  @media (max-width: ${BREAKPOINTS.small}) {
    padding: 0 var(--space-3);
  }
`;

const DiagnosticRow = styled.article`
  display: grid;
  grid-template-columns: minmax(10rem, 0.6fr) minmax(0, 1.4fr);
  gap: var(--space-3) var(--space-5);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-line);

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  @media (max-width: ${BREAKPOINTS.small}) {
    gap: var(--space-2);
    padding: var(--space-3) 0;
  }
`;

const DiagnosticTitle = styled.h3`
  margin: 0;
  color: var(--color-sepia);
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.1;
`;

const DiagnosticDetails = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
  margin: 0;

  div {
    min-width: 0;
  }

  dt {
    margin-bottom: var(--space-1);
    color: var(--color-sepia-soft);
    font-family: var(--font-technical);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    line-height: 1.4;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    color: var(--color-ivory-soft);
    font-size: 0.94rem;
    line-height: 1.58;
  }

  @media (max-width: ${BREAKPOINTS.medium}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);

    div:first-of-type {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: ${BREAKPOINTS.small}) {
    grid-template-columns: 1fr;

    div:first-of-type {
      grid-column: auto;
    }
  }
`;

export default function DiagnosticsSection() {
  return (
    <DiagnosticSection aria-labelledby="diagnostic-title" data-chapter-section>
      <Shell>
        <ChapterFolio aria-hidden="true" data-chapter-reveal>
          02 / 04
        </ChapterFolio>
        <DiagnosticHeader data-chapter-reveal>
          <SectionTitle id="diagnostic-title">
            Where the risk shows up.
          </SectionTitle>
          <SectionBody>
            These patterns appear when code is produced faster than it is
            understood. Each points to missing structure, knowledge, or
            verification that human engineering needs to restore.
          </SectionBody>
        </DiagnosticHeader>

        <DiagnosticList data-chapter-reveal>
          {diagnostics.map((diagnostic) => (
            <DiagnosticRow key={diagnostic.title}>
              <DiagnosticTitle>{diagnostic.title}</DiagnosticTitle>
              <DiagnosticDetails>
                <div>
                  <dt>Current symptom</dt>
                  <dd>{diagnostic.symptom}</dd>
                </div>
                <div>
                  <dt>Intervention</dt>
                  <dd>{diagnostic.intervention}</dd>
                </div>
                <div>
                  <dt>Result</dt>
                  <dd>{diagnostic.result}</dd>
                </div>
              </DiagnosticDetails>
            </DiagnosticRow>
          ))}
        </DiagnosticList>
      </Shell>
    </DiagnosticSection>
  );
}
