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

const SizzleReelContainer = styled(FlexBox)`
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: 100%;
`;

function AudioEngineering() {
  return (
    <FlexBox flexDirection="column" height="auto" id="services">
      <FlexBox
        gap="12px"
        height="135vh"
        flexDirection="column"
        padding="3rem 0rem 0rem"
        alignItems="center"
        justifyContent="center"
        style={{
          background:
            'linear-gradient(to bottom, transparent 95%, rgba(0, 0, 0, 0.9))',
        }}
      >
        {/* <GlassPane>{"we specialize in all formats of analogue and digital mastering, providing high-end audio services to the motor city music industry."}
      </GlassPane> */}
        <NeonText
          fontSize="2em"
          justifyContent="center"
          animatedHover
          padding="3rem 5rem 8rem"
        >
          We specialize in all formats of analogue and digital mastering,
          providing high-end audio services to the motor city music industry.
        </NeonText>
        <SizzleReelContainer>
          <SizzleReel autoPlay loop muted playsInline>
            <source
              src="/video/audio_engineering_sizzle.mp4"
              type="video/mp4"
            />
          </SizzleReel>
          {/* <CardText>
            <NeonText fontSize="2em" justifyContent="center" animatedHover>
              We specialize in all formats of analogue and digital mastering,
              providing high-end audio services to the motor city music
              industry.
            </NeonText>
          </CardText> */}
        </SizzleReelContainer>
      </FlexBox>
      <FlexBox
        height="100vh"
        style={{ backgroundColor: 'black', opacity: 0.9 }}
        alignItems="center"
        justifyContent="center"
        padding="3rem 3rem"
      >
        <FlexBox>
          <Title fontSize="3em" padding="0 0 1rem">
            Our Services
          </Title>
          <NeonText fontSize="1.5em" maxWidth="800px">
            We offer a range of audio engineering services to meet your needs,
            including:
          </NeonText>
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem' }}>
            <li>
              <NeonText fontSize="1.2em">
                - Analog and Digital Mastering
              </NeonText>
            </li>
            <li>
              <NeonText fontSize="1.2em">- Mixing and Remixing</NeonText>
            </li>
            <li>
              <NeonText fontSize="1.2em">
                - Audio Restoration and Enhancement
              </NeonText>
            </li>
            <li>
              <NeonText fontSize="1.2em">- Vinyl Cutting and Lacquers</NeonText>
            </li>
            <li>
              <NeonText fontSize="1.2em">- Custom Audio Solutions</NeonText>
            </li>
          </ul>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
}

export default AudioEngineering;
