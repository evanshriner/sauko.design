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
import { PiSpeakerHighFill, PiSpeakerSimpleXFill } from 'react-icons/pi';
import { SoundButton } from '../buttons/SoundButton';

interface LoadingScreenProps {
  progress: number;
  isTransitioning: boolean;
  onStarted: (soundPreference: string) => void;
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

  const handleClick = (
    e: React.MouseEvent<HTMLElement>,
    // sound preference should be an enum/type.
    soundPreference: string = 'sound-on',
  ) => {
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
      onStarted(soundPreference);
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
    <LoadingContainer isBlooming={isTransitioning} isFadingOut={isFadingOut}>
      <RippleEffect ripples={ripples} />
      <StyledCanvas ref={canvasRef} />
      <ContentWrapper
        initial="initial"
        animate="animate"
        variants={tvTurnOnVariants}
      >
        <FlexBox
          flexDirection="column"
          alignItems="center"
          id="loading-screen-logo"
          justifyContent="center"
        >
          <FlexBox flexDirection="column">
            <Logo disableSelection fontSize="50px">
              sauko
            </Logo>
            <NeonText darken disableSelection fontSize="15px" padding="5px">
              applied signals
            </NeonText>
          </FlexBox>
          <ProgressBarContainer>
            <BlockyProgressBar progress={throttledProgress} />
            <ProgressText>{`${Math.round(throttledProgress)}`}</ProgressText>
          </ProgressBarContainer>
        </FlexBox>
        <FlexBox
          padding="40px 20px"
          justifyContent="flex-end"
          alignItems="flex-end"
          height="100vh"
          id="loading-screen-sound-selection"
          flexDirection="column"
        >
          <NeonText fontSize="25px" justifyContent="flex-end">
            sound?
          </NeonText>
          <NeonText fontSize="15px" justifyContent="flex-end">
            (its better with it)
          </NeonText>
          <FlexBox gap="15px" justifyContent="flex-end" padding="10px 0">
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e, 'sound-on');
              }}
            >
              <SoundButton
                icon={PiSpeakerHighFill}
                onClick={() => {}}
                label="Sound On"
                selectionKey="sound-on"
              />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e, 'sound-off');
              }}
            >
              <SoundButton
                icon={PiSpeakerSimpleXFill}
                onClick={() => {}}
                label="Sound Off"
                selectionKey="sound-off"
              />
            </div>
          </FlexBox>
        </FlexBox>
      </ContentWrapper>
    </LoadingContainer>
  );
};

export default LoadingScreen;
