import styled from '@emotion/styled';
import FlexBox from '../../shared/components/FlexBox';
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Title from '@/shared/styles/Title';
import NeonText from '@/shared/styles/NeonText';
import AnimatedText from '@/shared/components/AnimatedText';
import ServiceList from './ServiceList';

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
  opacity: 0.7;
  left: 0;
  filter: grayscale(70%) sepia(20%) saturate(50%) brightness(1.8);
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
    <FlexBox flexDirection="column" id="services">
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
        style={{ backgroundColor: 'black', opacity: 0.9 }}
        height="170vh"
      >
        <FlexBox flexDirection="column">
          <FlexBox width="auto" height="auto" gap="3rem" padding="3rem">
            <AnimatedText>
              <NeonText fontSize="5em" width="auto">
                services
              </NeonText>
            </AnimatedText>
            <AnimatedText>
              <NeonText fontSize="1em" maxWidth="800px" width="auto">
                what do we offer?
              </NeonText>
            </AnimatedText>
          </FlexBox>
          <ServiceList />
        </FlexBox>
      </FlexBox>
      <FlexBox flexDirection="column">
        <FlexBox
          height="auto"
          gap="3rem"
          padding="3rem"
          justifyContent="center"
          alignItems="center"
        >
          <AnimatedText>
            <NeonText fontSize="5em" width="auto">
              projects
            </NeonText>
            <NeonText
              fontSize="1em"
              maxWidth="800px"
              width="auto"
              justifyContent="center"
              alignItems="center"
            >
              {"artists we've worked with"}
            </NeonText>
          </AnimatedText>
        </FlexBox>
        <ServiceList />
      </FlexBox>
    </FlexBox>
  );
}

export default AudioEngineering;
