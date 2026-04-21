import { useState } from 'react';
import BentoBlock from '../../blog/BentoBlock';
import styled from '@emotion/styled';

const TechnicalLabel = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  color: rgba(255, 255, 255, 0.5);
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0.5rem 0;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  filter: url(#neonGlow);
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
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.4);
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.8rem;
  color: white;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.8rem;
  color: white;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.8rem;
  color: white;
  font-family: inherit;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const SubmitButton = styled.button`
  background: white;
  color: black;
  border: none;
  padding: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
`;

const EngineeringConsole = () => {
  const [formData, setFormData] = useState({
    name: '',
    service: 'Mastering',
    link: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SIGNAL_TRANSMITTED:', formData);
    alert('Engineering Request Transmitted to Console.');
  };

  return (
    <BentoBlock transparent gridColumn="span 3" style={{ maxWidth: '600px' }}>
      <TechnicalLabel>TERMINAL_INTERFACE // REQUEST</TechnicalLabel>
      <Title>INITIATE SIGNAL.</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>CLIENT_NAME</Label>
          <Input 
            type="text" 
            placeholder="ENTER NAME..." 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
          />
        </FormGroup>

        <FormGroup>
          <Label>SERVICE_TYPE</Label>
          <Select 
            value={formData.service}
            onChange={(e) => setFormData({...formData, service: e.target.value})}
          >
            <option>Mastering (Stereo/Stem)</option>
            <option>Mixing & Production</option>
            <option>Restoration & Digitization</option>
            <option>Sound Design</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>PROJECT_LINK (DROPBOX/WETRANSFER)</Label>
          <Input 
            type="url" 
            placeholder="HTTPS://..." 
            value={formData.link}
            onChange={(e) => setFormData({...formData, link: e.target.value})}
            required 
          />
        </FormGroup>

        <FormGroup>
          <Label>ADDITIONAL_NOTES</Label>
          <TextArea 
            placeholder="TECHNICAL SPECS, REFERENCE TRACKS, ETC..." 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </FormGroup>

        <SubmitButton type="submit">TRANSMIT REQUEST</SubmitButton>
      </Form>
    </BentoBlock>
  );
};

export default EngineeringConsole;
