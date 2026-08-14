import styled from '@emotion/styled';
import { BOOKING_URL } from '@/shared/constants/booking';

const ReviewRoot = styled.section`
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  min-height: 100svh;
  padding: clamp(5rem, 12vh, 8rem) clamp(1.25rem, 5vw, 5rem);
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  @media (max-width: 40rem) {
    padding: 5rem 1rem;
  }
`;

const ReviewField = styled.div`
  display: grid;
  width: min(72rem, 100%);
  grid-template-columns: minmax(0, 1.1fr) minmax(16rem, 0.7fr);
  gap: clamp(3rem, 7vw, 7rem);
  padding: clamp(2rem, 5vw, 4rem);
  border: 1px solid var(--audio-line);
  align-items: end;
  text-align: left;
  background: linear-gradient(
    135deg,
    var(--audio-boundary-fill),
    rgba(18, 17, 15, 0.58)
  );

  @media (max-width: 64rem) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (max-width: 40rem) {
    padding: 1.5rem;
  }
`;

const TechnicalLabel = styled.p`
  margin: 0 0 1.25rem;
  color: var(--audio-technical);
  font-family: 'Orbit', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  line-height: 1.5;
  text-transform: uppercase;
`;

const ReviewTitle = styled.h2`
  max-width: 10ch;
  margin: 0;
  color: var(--audio-sepia);
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3rem, 6.6vw, 6rem);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.95;
  text-wrap: balance;
  filter: url(#neonGlow) drop-shadow(0 0.4rem 1.25rem var(--audio-signal-glow));
`;

const ReviewBody = styled.div`
  color: var(--audio-copy);
  font-size: 1rem;
  line-height: 1.65;

  > p {
    margin: 0;
  }
`;

const Preparation = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--audio-line);
`;

const PreparationLabel = styled.p`
  color: var(--audio-technical);
  font-family: 'Orbit', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const PreparationList = styled.ul`
  display: grid;
  gap: 0.65rem;
  margin: 0.85rem 0 0;
  padding-left: 1.15rem;

  li::marker {
    color: var(--audio-sepia-soft);
  }
`;

const BookingAction = styled.a`
  display: inline-flex;
  min-height: 3rem;
  margin-top: 1.75rem;
  padding: 0 1.5rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--audio-sepia);
  color: var(--audio-charcoal);
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
  background: var(--audio-sepia);
  transition:
    color 220ms var(--audio-ease-out),
    background-color 220ms var(--audio-ease-out),
    box-shadow 220ms var(--audio-ease-out),
    transform 220ms var(--audio-ease-out);

  &:hover {
    color: var(--audio-ivory);
    background: var(--audio-charcoal-soft);
    box-shadow: 0 0.35rem 1.5rem var(--audio-signal-glow);
    transform: translateY(-0.125rem);
  }

  &:focus-visible {
    outline: 3px solid var(--audio-ivory);
    outline-offset: 4px;
    box-shadow: 0 0.4rem 1.75rem var(--audio-signal-glow);
  }

  @media (max-width: 40rem) {
    width: 100%;
    box-sizing: border-box;
  }
`;

const BookingNote = styled.p`
  margin-top: 0.85rem !important;
  color: var(--audio-ivory-muted);
  font-size: 0.82rem;
  line-height: 1.5;
`;

export default function ProjectReview() {
  return (
    <ReviewRoot
      id="project-review"
      className="project-review-section"
      aria-labelledby="project-review-title"
    >
      <ReviewField>
        <div>
          <TechnicalLabel>PROJECT_REVIEW // LISTENING SESSION</TechnicalLabel>
          <ReviewTitle id="project-review-title">
            Start with the track.
          </ReviewTitle>
        </div>

        <ReviewBody>
          <p>
            Book a project review. Bring the track or project you want to
            discuss and the service you have in mind. We’ll listen, learn where
            it is in the process, and talk through your direction, references,
            and next steps.
          </p>

          <Preparation>
            <PreparationLabel>What to bring</PreparationLabel>
            <PreparationList>
              <li>A private link to the track, stems, mix, or project audio</li>
              <li>
                The service you’re looking for and the project’s current stage
              </li>
              <li>
                The direction you’re aiming for, plus any references or release
                context
              </li>
            </PreparationList>
          </Preparation>

          <BookingAction
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a project review
          </BookingAction>
          <BookingNote>
            You do not need a finished brief or an organized session before we
            talk.
          </BookingNote>
        </ReviewBody>
      </ReviewField>
    </ReviewRoot>
  );
}
