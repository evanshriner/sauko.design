import React, { useState } from 'react';
import BlockyProgressBar from './BlockyProgressBar';
import { useMatrixAnimation } from '@/shared/hooks/useMatrixAnimation';
import { useThrottledProgress } from '@/shared/hooks/useThrottledProgress';
import {
  LoadingContainer,
  ContentWrapper,
  StyledCanvas,
  ProgressBarContainer,
  ProgressText,
} from './styles';
import { useTheme } from '@emotion/react';
import NeonText from '@/shared/styles/NeonText';
import { Logo } from '../navbar/Logo';
import FlexBox from '../FlexBox';
import { Ripple, RippleEffect } from '@/shared/components/effects/Ripple';

interface LoadingScreenProps {
  progress: number;
  isTransitioning: boolean;
  onStarted: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  isTransitioning,
  onStarted,
}) => {
  const theme = useTheme();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const throttledProgress = useThrottledProgress({
    progress,
    minDuration: 4000,
    staggered: true,
  });

  const hasLoaded = throttledProgress >= 100;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (hasLoaded && !isTransitioning) {
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        size: 100,
        id: Date.now(),
      };
      setRipples([...ripples, newRipple]);
      setTimeout(() => {
        setIsFadingOut(true);
      }, 500);
      onStarted();
    }
  };

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  useMatrixAnimation(canvasRef, {
    font: 'Noto Sans JP',
    color: theme.colors.sepiaText,
  });

  const tvTurnOnVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  return (
    <LoadingContainer
      isBlooming={isTransitioning}
      isFadingOut={isFadingOut}
      onClick={handleClick}
    >
      <RippleEffect ripples={ripples} />
      <StyledCanvas ref={canvasRef} />
      <ContentWrapper
        initial="initial"
        animate="animate"
        variants={tvTurnOnVariants}
      >
        <FlexBox flexDirection="column">
          <Logo disableSelection fontSize="50px">
            sauko
          </Logo>
          <NeonText
            darken
            disableSelection
            fontSize="15px"
            padding="0 0px 10px 5px"
          >
            the signals agency
          </NeonText>
        </FlexBox>
        <ProgressBarContainer>
          <BlockyProgressBar progress={throttledProgress} />
          <ProgressText>{`${Math.round(throttledProgress)}`}</ProgressText>
        </ProgressBarContainer>
        {/* <EnterMessage>{hasLoaded && 'Click to enter'}</EnterMessage> */}
      </ContentWrapper>
    </LoadingContainer>
  );
};

export default LoadingScreen;
