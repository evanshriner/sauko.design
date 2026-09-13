import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const StreamContainer = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  height: 1.2rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.primaryText};
  opacity: 0.8;
  font-weight: bold;
`;

const Value = styled.span`
  color: #00ff41; // Classic matrix green for telemetry
  font-variant-numeric: tabular-nums;
`;

interface TelemetryStreamProps {
  label: string;
  values: string[];
  interval?: number;
}

const TelemetryStream: React.FC<TelemetryStreamProps> = ({ label, values, interval = 150 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % values.length);
    }, interval);

    return () => clearInterval(timer);
  }, [values.length, interval]);

  return (
    <StreamContainer>
      <Label>{label}:</Label>
      <Value>{values[index]}</Value>
    </StreamContainer>
  );
};

export default TelemetryStream;
