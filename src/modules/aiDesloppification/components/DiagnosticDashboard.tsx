import React, { useState, useEffect } from 'react';
import BentoGrid from '../../blog/BentoGrid';
import BentoBlock from '../../blog/BentoBlock';
import TelemetryStream from '../../blog/TelemetryStream';
import CoordinateBuild from '../../blog/CoordinateBuild';
import useTypingAnimation from '@/shared/hooks/useTypingAnimation';
import styled from '@emotion/styled';
import NeonText from '@/shared/styles/NeonText';

const TechnicalLabel = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.4);
`;

const ContentText = styled.div`
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
`;

const SymptomTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.85);
`;

const SymptomDescription = styled.div`
  font-size: 0.85rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.6);
`;

const CodeBlock = styled.pre`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.75rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
  width: 100%;
  margin: 0.5rem 0 0 0;
  white-space: pre;
  tab-size: 2;
`;

const CommentLine = styled.span`
  color: #00ff41;
  opacity: 0.7;
`;

const WarningLine = styled.span`
  color: #ff4141;
  opacity: 0.9;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.7rem;

  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.span`
  color: rgba(255, 255, 255, 0.5);
`;

const MetricValue = styled.span<{ severity?: 'critical' | 'warning' | 'ok' }>`
  color: ${({ severity }) =>
    severity === 'critical' ? '#ff4141' :
    severity === 'warning' ? '#ffaa00' :
    '#00ff41'};
  font-variant-numeric: tabular-nums;
`;

const SeverityBadge = styled.span<{ level: 'critical' | 'warning' }>`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.55rem;
  padding: 0.15rem 0.4rem;
  border: 1px solid ${({ level }) => level === 'critical' ? '#ff4141' : '#ffaa00'};
  color: ${({ level }) => level === 'critical' ? '#ff4141' : '#ffaa00'};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: auto;
`;

const DiagnosticDashboard: React.FC = () => {
  const introText = useTypingAnimation(
    "A healthy audit starts with evidence, not blame. We inspect the system's actual behavior, its boundaries, and the decisions AI is allowed to make. Then we separate the awkward-but-safe code from the risks that are quietly blocking your next release.",
    { speed: 20 }
  );

  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.floor(Math.random() * 3) + 1;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  return (
    <CoordinateBuild>
      <BentoGrid>
        {/* Main Diagnostic Report */}
        <BentoBlock gridColumn="span 3" gridRow="span 2" transparent>
          <TechnicalLabel>DIAGNOSTIC_PREVIEW // WHAT WE LOOK FOR</TechnicalLabel>
          <ContentText style={{ marginTop: '1rem', maxWidth: '90%' }}>
            {introText}
          </ContentText>
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', width: '100%' }}>
            <MetricRow>
              <MetricLabel>CRITICAL_WORKFLOWS_MAPPED</MetricLabel>
              <MetricValue severity="ok">{Math.min(scanProgress, 100)}%</MetricValue>
            </MetricRow>
            <MetricRow>
              <MetricLabel>UNVERIFIED_AI_DECISIONS</MetricLabel>
              <MetricValue severity="critical">REVIEW</MetricValue>
            </MetricRow>
            <MetricRow>
              <MetricLabel>CHANGE_RISK</MetricLabel>
              <MetricValue severity="warning">TRIAGE</MetricValue>
            </MetricRow>
            <MetricRow>
              <MetricLabel>SAFETY_NET</MetricLabel>
              <MetricValue severity="critical">VERIFY</MetricValue>
            </MetricRow>
          </div>
        </BentoBlock>

        {/* Live Scan Telemetry */}
        <BentoBlock gridColumn="span 1" transparent>
          <TechnicalLabel>REVIEW_LENSES // SIGNALS</TechnicalLabel>
          <TelemetryStream label="AI_BOUNDARY" values={['CLEAR', 'IMPLICIT', 'MISSING']} interval={800} />
          <TelemetryStream label="DATA_HANDLING" values={['MAPPED', 'PARTIAL', 'UNKNOWN']} interval={1200} />
          <TelemetryStream label="RELEASE_CONFIDENCE" values={['PROVEN', 'FRAGILE', 'UNTESTED']} interval={600} />
          <TelemetryStream label="OWNERSHIP" values={['DOCUMENTED', 'TRIBAL', 'UNCLEAR']} interval={400} />
          <TelemetryStream label="DEPENDENCY_HEALTH" values={['CURRENT', 'MIXED', 'STALE']} interval={900} />
        </BentoBlock>

        {/* Symptom 01 */}
        <BentoBlock gridColumn="span 1" transparent>
          <TechnicalLabel>SYMPTOM.01 // MONOLITH</TechnicalLabel>
          <SymptomTitle>Single-File Applications</SymptomTitle>
          <SymptomDescription>
            One file has become the only map of the business. A tiny change now means reading around unrelated behavior and hoping nothing moves.
          </SymptomDescription>
          <SeverityBadge level="critical">[SEVERITY: CRITICAL]</SeverityBadge>
        </BentoBlock>

        {/* Symptom 02 */}
        <BentoBlock gridColumn="span 2" transparent>
          <TechnicalLabel>SYMPTOM.02 // HALLUCINATED_ARCHITECTURE</TechnicalLabel>
          <SymptomTitle>Invented Abstractions</SymptomTitle>
          <SymptomDescription>
            Layers that sound deliberate but hide the behavior your team actually needs to change. The remedy is a boundary, not another pattern.
          </SymptomDescription>
          <SeverityBadge level="warning">[SEVERITY: HIGH]</SeverityBadge>
        </BentoBlock>

        {/* Symptom 03 */}
        <BentoBlock gridColumn="span 1" transparent>
          <TechnicalLabel>SYMPTOM.03 // FRANKENSTEIN</TechnicalLabel>
          <SymptomTitle>Framework Soup</SymptomTitle>
          <SymptomDescription>
            Competing frameworks, duplicated state, and dependency choices nobody can explain. Every feature begins with archaeology.
          </SymptomDescription>
          <SeverityBadge level="critical">[SEVERITY: CRITICAL]</SeverityBadge>
        </BentoBlock>

        {/* Code Exhibit */}
        <BentoBlock gridColumn="span 4" transparent>
          <TechnicalLabel>CODE_SAMPLE // EXHIBIT_A</TechnicalLabel>
          <NeonText fontSize="0.7rem" padding="0 0 0.5rem 0">
            [ A REPRESENTATIVE PATTERN — NOT A CLIENT CODE SAMPLE ]
          </NeonText>
          <CodeBlock>
            <CommentLine>{'// TODO: I\'m not sure what this does but removing it breaks everything'}</CommentLine>
            {'\n'}const DataProcessingManagerFactoryBuilderService = {'{'}
            {'\n'}  <WarningLine>{'// WARNING: This function is 847 lines long'}</WarningLine>
            {'\n'}  {'processData: async (data, options, config, metadata, context, flags) => {'}
            {'\n'}    {'if (data && data !== null && data !== undefined && typeof data !== \'undefined\') {'}
            {'\n'}      {'const result = await fetch(API_URL + \'/api/v1/data/process/execute/run\');'}
            {'\n'}      {'const json = await result.json();'}
            {'\n'}      {'const parsed = JSON.parse(JSON.stringify(json));'}
            {'\n'}      <CommentLine>{'// The AI generated 200 more lines of the same pattern below...'}</CommentLine>
            {'\n'}    {'}'}
            {'\n'}  {'}'}
            {'\n'}{'}'}
          </CodeBlock>
        </BentoBlock>
      </BentoGrid>
    </CoordinateBuild>
  );
};

export default DiagnosticDashboard;
