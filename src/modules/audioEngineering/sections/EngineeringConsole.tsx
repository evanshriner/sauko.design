import { useState } from 'react';
import BentoBlock from '../../blog/BentoBlock';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

const TechnicalLabel = styled.div`
  font-family: 'Orbit', sans-serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  color: var(--audio-technical);
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  margin: 0.5rem 0;
  color: var(--audio-heading);
  filter: url(#neonGlow);
`;

const ConsolePanel = styled(BentoBlock)`
  width: min(40rem, calc(100% - 2rem));
  padding: clamp(1.5rem, 4vw, 3rem);
  border: 1px solid var(--audio-line-strong);
  color: var(--audio-ivory);
  background: linear-gradient(
    135deg,
    var(--audio-boundary-fill),
    var(--audio-charcoal-soft)
  );
  backdrop-filter: none;
  box-shadow: none;

  > div:not(.glitch-content) {
    display: none;
  }

  .glitch-content {
    animation: none !important;
  }

  &::after {
    display: none !important;
  }

  &:focus-within {
    border-color: var(--audio-sepia-soft);
  }

  &:hover {
    border-color: var(--audio-line-strong);
    background: linear-gradient(
      135deg,
      var(--audio-section-wash),
      var(--audio-charcoal-soft)
    );

    .glitch-content {
      animation: none;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: 'Orbit', sans-serif;
  color: var(--audio-sepia-soft);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
`;

const fieldStyles = css`
  min-height: 3rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--audio-line);
  border-radius: 0;
  color: var(--audio-ivory);
  font-family: inherit;
  font-size: 1rem;
  background: var(--audio-boundary-fill);
  transition:
    border-color 220ms var(--audio-ease-out),
    background-color 220ms var(--audio-ease-out),
    outline-color 220ms var(--audio-ease-out);

  &::placeholder {
    color: var(--audio-ivory-muted);
  }

  &:hover {
    border-color: var(--audio-line-strong);
    background: var(--audio-section-wash);
  }

  &:focus {
    outline: none;
    border-color: var(--audio-sepia-soft);
  }

  &:focus-visible {
    outline: 3px solid var(--audio-ivory);
    outline-offset: 3px;
  }
`;

const Input = styled.input`
  ${fieldStyles}
`;

const Select = styled.select`
  ${fieldStyles}

  option {
    color: var(--audio-ivory);
    background: var(--audio-charcoal);
  }
`;

const TextArea = styled.textarea`
  ${fieldStyles}

  min-height: 8rem;
  resize: vertical;
`;

const SubmitButton = styled.button`
  min-height: 3rem;
  padding: 0 1.5rem;
  border: 1px solid var(--audio-sepia);
  color: var(--audio-charcoal);
  font-family: 'Orbit', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  background: var(--audio-sepia);
  cursor: pointer;
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
  }
`;

const EngineeringConsole = () => {
  const [formData, setFormData] = useState({
    name: '',
    service: 'Mastering',
    link: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SIGNAL_TRANSMITTED:', formData);
    alert('Engineering Request Transmitted to Console.');
  };

  return (
    <ConsolePanel transparent gridColumn="span 3">
      <TechnicalLabel>TERMINAL_INTERFACE // REQUEST</TechnicalLabel>
      <Title>Initiate signal.</Title>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="engineering-client-name">CLIENT_NAME</Label>
          <Input
            id="engineering-client-name"
            type="text"
            placeholder="ENTER NAME..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="engineering-service-type">SERVICE_TYPE</Label>
          <Select
            id="engineering-service-type"
            value={formData.service}
            onChange={(e) =>
              setFormData({ ...formData, service: e.target.value })
            }
          >
            <option>Mastering (Stereo/Stem)</option>
            <option>Mixing & Production</option>
            <option>Restoration & Digitization</option>
            <option>Sound Design</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="engineering-project-link">
            PROJECT_LINK (DROPBOX/WETRANSFER)
          </Label>
          <Input
            type="url"
            id="engineering-project-link"
            placeholder="HTTPS://..."
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="engineering-notes">ADDITIONAL_NOTES</Label>
          <TextArea
            id="engineering-notes"
            placeholder="TECHNICAL SPECS, REFERENCE TRACKS, ETC..."
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
        </FormGroup>

        <SubmitButton type="submit">TRANSMIT REQUEST</SubmitButton>
      </Form>
    </ConsolePanel>
  );
};

export default EngineeringConsole;
