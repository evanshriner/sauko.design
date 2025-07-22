import React from 'react';
import SvgLogo from '@/shared/components/navbar/SvgLogo';
import { useMatrixAnimation } from '@/shared/hooks/useMatrixAnimation';
import { useThrottledProgress } from '@/shared/hooks/useThrottledProgress';
import {
  LoadingContainer,
  EnterMessage,
  ContentWrapper,
  StyledCanvas,
} from './styles';
import { useTheme } from '@emotion/react';

interface LoadingScreenProps {
  progress: number;
  hasLoaded: boolean;
  isStarted: boolean;
  onStarted: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  hasLoaded,
  isStarted,
  onStarted,
}) => {
  const theme = useTheme();
  const throttledProgress = useThrottledProgress({
    progress,
    minDuration: 4000,
    staggered: true,
  });

  const handleClick = () => {
    if (hasLoaded) {
      onStarted();
    }
  };

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  useMatrixAnimation(canvasRef, {
    font: 'Noto Sans JP',
    color: theme.colors.sepiaText,
  });

  return (
    <LoadingContainer isStarted={isStarted} onClick={handleClick}>
      <StyledCanvas ref={canvasRef} />
      <ContentWrapper>
        {hasLoaded && <EnterMessage>Click to enter</EnterMessage>}
        <SvgLogo progress={throttledProgress} />
      </ContentWrapper>
    </LoadingContainer>
  );
};

export default LoadingScreen;
