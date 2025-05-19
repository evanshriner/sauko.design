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

function Services() {
  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      const x = Math.floor(Math.random() * 50);
      const y = Math.floor(Math.random() * 50);
      controls.start({ backgroundPosition: `${x}% ${y}%` });
    }, 100);

    return () => clearInterval(interval);
  }, [controls]);

  return (
    <FlexBox
      flexDirection="column"
      height="100vh"
      padding="1rem 3rem"
      id="services"
    >
      <Title>services</Title>
      <FlexBox flexDirection="row" gap="12px" height="100%">
        <ContentBox>
          <CardText>
            <NeonText fontSize="2em">audio engineering</NeonText>
          </CardText>
        </ContentBox>
        <ContentBox>
          <CardText>
            <NeonText fontSize="2em">prototyping / mvp development</NeonText>
          </CardText>
        </ContentBox>
      </FlexBox>
    </FlexBox>
  );
}

export default Services;
