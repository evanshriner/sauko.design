import React, { useState, useEffect } from 'react';
import BlockyProgressBar from './ProgressBar';
import { useMatrixAnimation } from '@/shared/hooks/useMatrixAnimation';
import { useThrottledProgress } from '@/shared/hooks/useThrottledProgress';
import useTypingAnimation from '@/shared/hooks/useTypingAnimation';
import {
  LoadingContainer,
  ContentWrapper,
  StyledCanvas,
  ProgressBarContainer,
} from './styles';
import { useTheme } from '@emotion/react';
import NeonText from '@/shared/styles/NeonText';
import { Logo } from '../navbar/Logo';
import FlexBox from '../FlexBox';
import { motion } from 'framer-motion';
import { Ripple, RippleEffect } from '@/shared/components/effects/Ripple';
import { PiSpeakerHighFill, PiSpeakerSimpleXFill } from 'react-icons/pi';
import { SoundButton } from '../buttons/SoundButton';
import { useMediaPlayerContext } from '@/shared/context/MediaPlayerContext';

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
  const {
    play,
  } = useMediaPlayerContext();

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
      if (soundPreference === 'sound-on') {
        play();
      }
      onStarted();
    }
  };

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  useMatrixAnimation(canvasRef, {
    font: 'Noto Sans JP',
    color: theme.colors.sepiaText,
  });

  const [startSoundSubtext, setStartSoundSubtext] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (hasLoaded) {
      const subtextTimer = setTimeout(() => {
        setStartSoundSubtext(true);
      }, 700);
      const buttonsTimer = setTimeout(() => {
        setShowButtons(true);
      }, 2300);

      return () => {
        clearTimeout(subtextTimer);
        clearTimeout(buttonsTimer);
      };
    }
  }, [hasLoaded]);

  const soundQuestionText = useTypingAnimation('sound?', {
    trigger: hasLoaded,
  });
  const soundSubtext = useTypingAnimation("(it's better with it...)", {
    trigger: startSoundSubtext,
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
          height="50%"
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
            <NeonText disableSelection fontSize='10px' padding='0 0 0 10px'>{`${Math.round(throttledProgress)}`}</NeonText>
          </ProgressBarContainer>
        </FlexBox>
        <FlexBox
          padding="40px 20px"
          justifyContent="flex-end"
          alignItems="flex-end"
          height="100vh"
          clickable
          id="loading-screen-sound-selection"
          flexDirection="column"
        >
          <div style={{ minHeight: '120px' }}>
            {hasLoaded && (
              <>
                <NeonText
                  fontSize="25px"
                  disableSelection
                  justifyContent="flex-end"
                  style={{ opacity: soundQuestionText ? 1 : 0 }}
                >
                  {soundQuestionText || ' '}
                </NeonText>
                <NeonText
                  fontSize="15px"
                  disableSelection
                  justifyContent="flex-end"
                  style={{ opacity: startSoundSubtext ? 1 : 0 }}
                >
                  {soundSubtext || ' '}
                </NeonText>
                <motion.div
                  style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'flex-end',
                    padding: '10px 0',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showButtons ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SoundButton
                    icon={PiSpeakerHighFill}
                    onClick={(e) => handleClick(e, 'sound-on')}
                    label="Sound On"
                    selectionKey="sound-on"
                  />
                  <SoundButton
                    icon={PiSpeakerSimpleXFill}
                    onClick={(e) => handleClick(e, 'sound-off')}
                    label="Sound Off"
                    selectionKey="sound-off"
                  />
                </motion.div>
              </>
            )}
          </div>
        </FlexBox>
      </ContentWrapper>
    </LoadingContainer>
  );
};

export default LoadingScreen;
