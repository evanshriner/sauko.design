import React from 'react';
import { useMatrixAnimation } from '@/shared/hooks/useMatrixAnimation';
import {
  LoadingContainer,
  ProgressBar,
  ProgressText,
  EnterMessage,
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
  useMatrixAnimation(canvasRef, 'Noto Sans JP', theme.colors.sepiaText);

  return (
    <LoadingContainer isStarted={isStarted} onClick={handleClick}>
      <canvas ref={canvasRef}>
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
      </canvas>
    </LoadingContainer>
  );
};

export default LoadingScreen;
