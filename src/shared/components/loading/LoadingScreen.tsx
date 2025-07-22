import React from 'react';
import { useMatrixAnimation } from '@/shared/hooks/useMatrixAnimation';
import {
  LoadingContainer,
  ProgressBar,
  ProgressText,
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
        {hasLoaded ? (
          <EnterMessage>Click to enter</EnterMessage>
        ) : (
          <>
            <ProgressBar>
              <div style={{ width: `${progress}%` }} />
            </ProgressBar>
            <ProgressText>{Math.round(progress)}%</ProgressText>
          </>
        )}
      </ContentWrapper>
    </LoadingContainer>
  );
};

export default LoadingScreen;
