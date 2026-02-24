import styled from '@emotion/styled';
import FlexBox from '../../shared/components/FlexBox';
import BentoGrid from './BentoGrid';
import BentoBlock from './BentoBlock';
import TelemetryStream from './TelemetryStream';
import CoordinateBuild from './CoordinateBuild';
import NeonText from '@/shared/styles/NeonText';
import useTypingAnimation from '@/shared/hooks/useTypingAnimation';
import { useMediaPlayerContext } from '@/shared/context/MediaPlayerContext';

const PageWrapper = styled(FlexBox)`
  width: 100%;
  min-height: 100vh;
  padding-top: 5rem;
  padding-bottom: 5rem;
  z-index: 10;
`;

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

function AudioEngineering() {
  const { play, skipForward } = useMediaPlayerContext();
  const introText = useTypingAnimation("Sauko provides precision audio engineering services specializing in high-end mastering and surgical mixing for artists who demand a refined, modern sound.", { speed: 30 });

  const handleProjectClick = () => {
    skipForward();
    play();
  };

  return (
    <PageWrapper flexDirection="column" id="services">
      <CoordinateBuild>
        <BentoGrid>
          {/* Main Title Block */}
          <BentoBlock gridColumn="span 3" gridRow="span 2" transparent>
            <TechnicalLabel>SYSTEM.INFO // AUDIO_ENGINEERING</TechnicalLabel>
            <ContentText style={{ marginTop: '1rem', maxWidth: '80%' }}>
              {introText}
            </ContentText>
          </BentoBlock>

          {/* Telemetry Block */}
          <BentoBlock gridColumn="span 1" transparent>
            <TechnicalLabel>LIVE_TELEMETRY</TechnicalLabel>
            <TelemetryStream label="SAMPLE_RATE" values={['44.1kHz', '48.0kHz', '88.2kHz', '96.0kHz', '192.0kHz']} />
            <TelemetryStream label="BIT_DEPTH" values={['16-bit', '24-bit', '32-bit float']} />
            <TelemetryStream label="BUFFER" values={['64', '128', '256', '512', '1024']} interval={300} />
            <TelemetryStream label="LUFS_TARGET" values={['-14.0', '-12.0', '-10.5', '-9.0']} interval={1000} />
          </BentoBlock>

          {/* Gear List Block */}
          <BentoBlock gridColumn="span 1" gridRow="span 2" transparent>
            <TechnicalLabel>GEAR_INVENTORY</TechnicalLabel>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>▸ Shadow Hills Mastering Comp</div>
              <div>▸ Manley Massive Passive</div>
              <div>▸ Bettermaker Limiter</div>
              <div>▸ Dangerous Music BAX EQ</div>
              <div>▸ Neve 1073 Preamp</div>
              <div>▸ Empirical Labs Distressor</div>
            </div>
          </BentoBlock>

          {/* Mastering Service Block */}
          <BentoBlock gridColumn="span 2" transparent>
            <TechnicalLabel>SERVICE.01 // MASTERING</TechnicalLabel>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Precision Mastering</div>
            <ContentText style={{ fontSize: '0.9rem' }}>
              The final touch that translates your vision to every speaker. Digital and analog signal paths available for stereo and immersive formats.
            </ContentText>
          </BentoBlock>

          {/* Mixing Service Block */}
          <BentoBlock gridColumn="span 1" transparent>
            <TechnicalLabel>SERVICE.02 // MIXING</TechnicalLabel>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Surgical Mixing</div>
            <ContentText style={{ fontSize: '0.8rem' }}>
              Balancing frequency, space, and emotion to create a cohesive soundscape.
            </ContentText>
          </BentoBlock>

          {/* Projects / Artist Credits */}
          <BentoBlock 
            gridColumn="span 2" 
            gridRow="span 2" 
            transparent 
            onClick={handleProjectClick}
            style={{ cursor: 'pointer' }}
          >
            <TechnicalLabel>PROJECT_ARCHIVE // RECENT_WORKS</TechnicalLabel>
            <div style={{ width: '100%', height: '200px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>SURLO - SUMMER W/ SURLO</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>[ CLICK TO LOAD TRACK ]</div>
            </div>
          </BentoBlock>

          {/* Technical Specs Block */}
          <BentoBlock gridColumn="span 2" transparent>
            <TechnicalLabel>TECH_SPECS // ENVIRONMENT</TechnicalLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', gap: '1rem' }}>
               <TelemetryStream label="MONITORING" values={['ATC SCM25A', 'Amphion One18', 'Audeze LCD-X']} interval={2000} />
               <TelemetryStream label="CONVERSION" values={['Antelope Pure2', 'Dangerous Convert-8']} interval={3000} />
            </div>
          </BentoBlock>
        </BentoGrid>
      </CoordinateBuild>
    </PageWrapper>
  );
}

export default AudioEngineering;
