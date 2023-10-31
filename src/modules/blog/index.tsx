import styled from '@emotion/styled';
import FlexBox from '../../shared/components/FlexBox';
import wireframe from '../../assets/wireframe.webp';
import porsche from '../../assets/porsche2.webp';
import grain from '../../assets/grain.png';
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const Title = styled(FlexBox)(({ theme }) => ({
  boxSizing: 'border-box',
  padding: '3rem',
  height: '100%',
  fontSize: '4.5vw',
  fontWeight: '500',
  color: theme.colors.primaryText,
  justifyContent: 'center',
  alignItems: 'center',
}));

const CardBackground = styled(FlexBox)(({ theme }) => ({
  position: 'absolute',
  background: `url(${wireframe})`,
  backgroundSize: 'cover',
  backgroundPosition: 'bottom',
  boxSizing: 'border-box',
  transform: 'scale(1)',
  transition: 'transform 0.4s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  width: '100%',
  height: '100%',
  cursor: 'pointer',
}));

const CardText = styled(FlexBox)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: '500',
  color: theme.colors.primaryText,
  padding: '24px',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  zIndex: '1',
  pointerEvents: 'none',
}));

const Card = styled(FlexBox)(({ theme }) => ({
  backgroundColor: 'black',
  borderRadius: '32px',
  overflow: 'hidden',
  width: '100%',
  padding: 0,
  position: 'relative',
  aspectRatio: '1 / 1',
}));

function Blog() {
  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      const x = Math.floor(Math.random() * 50);
      const y = Math.floor(Math.random() * 50);
      controls.start({ backgroundPosition: `${x}% ${y}%` });
    }, 100);

    return () => clearInterval(interval);
  }, [controls]);

  const CardGrain = () => (
    <motion.div
      initial={{ backgroundPosition: '0% 0%' }}
      animate={controls}
      transition={{ duration: 0 }}
      style={{
        position: 'absolute',
        inset: '-200%',
        width: '400%',
        height: '400%',
        backgroundImage: `url(${grain})`,
        backgroundSize: 'initial',
        backgroundRepeat: 'repeat',
        zIndex: 1,
        opacity: 0.1,
        pointerEvents: 'none',
      }}
    />
  );

  return (
    <FlexBox flexDirection="column">
      <Title>Our Values</Title>
      <FlexBox flexDirection="row" gap="12px" padding="12px">
        <Card>
          <CardBackground />
          <CardGrain />
          <CardText>The Importance of UX</CardText>
        </Card>
        <Card>
          <CardBackground
            style={{
              background: `url(${porsche})`,
              backgroundSize: 'contain',
            }}
          />
          <CardGrain />
          <CardText>Lightning Fast Web Applications</CardText>
        </Card>
      </FlexBox>
    </FlexBox>
  );
}

export default Blog;
