import styled from '@emotion/styled';
import FlexBox from '../../shared/components/FlexBox';
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Title from '@/shared/styles/Title';
import ContentBox from '@/shared/styles/ContentBox';
import NeonText from '@/shared/styles/NeonText';

const CardText = styled(FlexBox)(({ theme }) => ({
  padding: '24px',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  textWrap: 'wrap',
  zIndex: '1',
}));

function AudioEngineering() {
  return (
    <FlexBox
      flexDirection="column"
      height="200vh"
      style={{ overflow: 'scroll' }}
      padding="0 3rem"
      id="services"
    >
      <Title>AudioEngineering</Title>
      <FlexBox flexDirection="column" gap="12px" height="100%">
        <ContentBox clickable>
          <CardText>
            <NeonText fontSize="2em">AudioEngineering</NeonText>
          </CardText>
        </ContentBox>
        <ContentBox clickable>
          <CardText>
            <NeonText fontSize="2em">AudioEngineering</NeonText>
          </CardText>
        </ContentBox>
      </FlexBox>
    </FlexBox>
  );
}

export default AudioEngineering;
