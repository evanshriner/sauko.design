import styled from '@emotion/styled';
import FlexBox from '../../shared/components/FlexBox';
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Title from '@/shared/styles/Title';
import ContentBox from '@/shared/styles/ContentBox';
import NeonText from '@/shared/styles/NeonText';
import GlassPane from '@/shared/components/glassPane/GlassPane';

const CardText = styled(FlexBox)(({ theme }) => ({
  padding: '24px',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  textWrap: 'wrap',
  zIndex: '1',
}));

const SizzleReel = styled.video`
  position: absolute;
  top: 0;
  opacity: 0.5;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const SizzleReelContainer = styled(ContentBox)`
  position: relative;
  overflow: hidden;
  width: 80vw;
  height: 100%;
`;

function AudioEngineering() {
  return (
    <FlexBox
      flexDirection="column"
      height="200vh"
      id="services"
    >
      <FlexBox gap="12px" height="85vh" padding="3rem 3rem" alignItems='center' justifyContent='center' style={{ background: 'linear-gradient(to bottom, transparent 95%, rgba(0, 0, 0, 0.9))' }}>
      {/* <GlassPane>{"we specialize in all formats of analogue and digital mastering, providing high-end audio services to the motor city music industry."}
      </GlassPane> */}
      <SizzleReelContainer clickable  maxWidth="1800px">
          <SizzleReel autoPlay loop muted playsInline>
            <source src="/video/audio_engineering_sizzle.mp4" type="video/mp4" />
          </SizzleReel>
          <CardText>
            <NeonText fontSize="2em" justifyContent='center' animatedHover>We specialize in all formats of analogue and digital mastering, providing high-end audio services to the motor city music industry.</NeonText>
          </CardText>
        </SizzleReelContainer>

      </FlexBox >
      <FlexBox height="100vh" style={{backgroundColor: 'black', opacity: 0.90}} alignItems='center' justifyContent='center' padding='3rem 3rem'>

      </FlexBox>
    
    </FlexBox>
  );
}

export default AudioEngineering;
