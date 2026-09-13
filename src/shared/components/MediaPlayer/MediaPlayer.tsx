import React, { useEffect, useId, useRef, useState } from 'react';
import {
  animate,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { useTheme } from '@emotion/react';
import FlexBox from '../FlexBox';
import { FaPlay, FaPause } from 'react-icons/fa';
import { FaBackwardStep, FaForwardStep } from 'react-icons/fa6';
import { BsBrightnessHighFill } from 'react-icons/bs';
import { PiSpeakerSimpleHighFill } from 'react-icons/pi';

import NeonText from '../../styles/NeonText';
import { useMediaPlayerContext } from '../../context/MediaPlayerContext';
import * as C from './constants';
import {
  ControlButton,
  MediaControlContainer,
  MediaControlFill,
  MediaControlIcon,
  MediaPlayerContainer,
  MobileLevelControl,
  MobileLevelControls,
  MobileLevelMeta,
  MobileScrubberBlock,
  MobileTimeRow,
  MobileTrackArtist,
  MobileTrackInfo,
  MobileTrackTitle,
  MobileTransport,
  PlayPauseButton,
  PlayPauseIcon,
  ScrubberContainer,
  ScrubberHandle,
} from './styles';

export interface MediaPlayerProps {
  variant?: 'desktop' | 'mobile';
}

type PlayerVariant = NonNullable<MediaPlayerProps['variant']>;
type ControlOrientation = 'vertical' | 'horizontal';
type LevelControl = 'intensity' | 'volume';

const clampUnit = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

const clampPercentage = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

const formatTime = (seconds: number) => {
  const finiteSeconds =
    Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const hours = Math.floor(finiteSeconds / 3600);
  const minutes = Math.floor((finiteSeconds % 3600) / 60);
  const remainingSeconds = finiteSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

const MediaPlayer: React.FC<MediaPlayerProps> = ({ variant = 'desktop' }) => {
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const generatedId = useId().replace(/:/g, '');
  const {
    isPlaying,
    progress,
    duration,
    tracks,
    currentTrackIndex,
    play,
    pause,
    skipForward,
    skipBackward,
    seek,
    intensity,
    setIntensity,
    volume,
    setVolume,
  } = useMediaPlayerContext();

  const [scrubberWidth, setScrubberWidth] = useState(0);

  const scrubberRef = useRef<HTMLDivElement>(null);
  const intensityControlRef = useRef<HTMLDivElement>(null);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const handleX = useMotionValue(0);
  const handleY = useMotionValue(0);
  const intensityFill = useMotionValue(intensity / 100);
  const volumeFill = useMotionValue(volume / 100);

  const foregroundWaveRef = useRef<SVGPathElement>(null);
  const backgroundWaveRef = useRef<SVGPathElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const timeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasScrubberDraggedRef = useRef(false);
  const isScrubberAnimatingRef = useRef(false);
  const scrubberAnimationRef = useRef<{ stop: () => void } | null>(null);
  const isIntensityAnimatingRef = useRef(false);
  const intensityAnimationRef = useRef<{ stop: () => void } | null>(null);
  const isVolumeAnimatingRef = useRef(false);
  const volumeAnimationRef = useRef<{ stop: () => void } | null>(null);

  const scrubberTravel = Math.max(0, scrubberWidth - C.SCRUBBER_HANDLE_SIZE_PX);
  const safeProgress = clampUnit(progress);
  const safeDuration =
    Number.isFinite(duration) && duration > 0 ? duration : 0;
  const currentTime = safeDuration * safeProgress;
  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(safeDuration);
  const seekAriaMaximum = Math.max(0, Math.round(safeDuration));
  const seekAriaValue = Math.min(
    seekAriaMaximum,
    Math.max(0, Math.round(currentTime)),
  );
  const clipPathId = `${C.WAVE_CLIP_PATH_ID_PREFIX}-${generatedId}`;
  const intensityLabelId = `visual-response-${generatedId}`;
  const volumeLabelId = `volume-${generatedId}`;

  useAnimationFrame((_, delta) => {
    if (isPlaying && !prefersReducedMotion) {
      timeRef.current += delta / C.WAVE_ANIMATION_SPEED_DIVISOR;
    }

    if (
      scrubberWidth > 0 &&
      !isDraggingRef.current &&
      !isScrubberAnimatingRef.current
    ) {
      handleX.set(safeProgress * scrubberTravel);
    }

    if (
      !foregroundWaveRef.current ||
      !backgroundWaveRef.current ||
      scrubberWidth === 0
    )
      return;

    const amplitude = C.WAVE_AMPLITUDE;
    const frequency = C.WAVE_FREQUENCY;

    let d = 'M 0 0';
    for (let x = 0; x <= scrubberWidth; x++) {
      const angle =
        (x / scrubberWidth) * frequency * Math.PI * 2 + timeRef.current;
      const y = Math.sin(angle) * amplitude;
      d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }

    backgroundWaveRef.current.setAttribute('d', d);
    foregroundWaveRef.current.setAttribute('d', d);

    const visualProgress =
      scrubberTravel > 0 ? handleX.get() / scrubberTravel : 0;
    const handleAngle =
      visualProgress * frequency * Math.PI * 2 + timeRef.current;
    const handleYOffset = prefersReducedMotion
      ? 0
      : Math.sin(handleAngle) * amplitude * C.HANDLE_AMPLITUDE_MULTIPLIER;

    handleY.set(handleYOffset - C.SCRUBBER_HANDLE_Y_OFFSET);
  });

  useEffect(() => {
    const scrubberElement = scrubberRef.current;
    if (!scrubberElement) return;

    const updateWidth = () => {
      setScrubberWidth(scrubberElement.getBoundingClientRect().width);
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(scrubberElement);

    return () => resizeObserver.disconnect();
  }, [variant]);

  useEffect(() => {
    const unsubscribe = handleX.onChange((latestX) => {
      const visualProgress = scrubberTravel > 0 ? latestX / scrubberTravel : 0;
      const boundedProgress = clampUnit(visualProgress);

      if (clipRectRef.current) {
        clipRectRef.current.setAttribute(
          'width',
          String(boundedProgress * scrubberWidth),
        );
      }

      if (isDraggingRef.current) {
        seek(boundedProgress);
      }
    });
    return () => unsubscribe();
  }, [handleX, scrubberTravel, scrubberWidth, seek]);

  useEffect(() => {
    if (!isIntensityAnimatingRef.current) {
      intensityFill.set(clampPercentage(intensity) / 100);
    }
  }, [intensity, intensityFill]);

  useEffect(() => {
    if (!isVolumeAnimatingRef.current) {
      volumeFill.set(clampPercentage(volume) / 100);
    }
  }, [volume, volumeFill]);

  useEffect(
    () => () => {
      scrubberAnimationRef.current?.stop();
      intensityAnimationRef.current?.stop();
      volumeAnimationRef.current?.stop();
    },
    [],
  );

  const animateControlFill = (
    fill: typeof intensityFill,
    animationRef: typeof intensityAnimationRef,
    isAnimatingRef: typeof isIntensityAnimatingRef,
    targetValue: number,
  ) => {
    animationRef.current?.stop();
    const normalizedTarget = clampPercentage(targetValue) / 100;

    if (prefersReducedMotion) {
      isAnimatingRef.current = false;
      animationRef.current = null;
      fill.set(normalizedTarget);
      return;
    }

    isAnimatingRef.current = true;
    animationRef.current = animate(fill.get(), normalizedTarget, {
      duration: C.CONTROL_CLICK_ANIMATION_DURATION,
      ease: C.CONTROL_CLICK_ANIMATION_EASE,
      onUpdate: (latest) => fill.set(latest),
      onComplete: () => {
        isAnimatingRef.current = false;
        animationRef.current = null;
      },
    });
  };

  const moveScrubberTo = (targetProgress: number) => {
    const boundedProgress = clampUnit(targetProgress);
    const targetX = boundedProgress * scrubberTravel;
    seek(boundedProgress);
    scrubberAnimationRef.current?.stop();

    if (prefersReducedMotion || scrubberTravel === 0) {
      isScrubberAnimatingRef.current = false;
      scrubberAnimationRef.current = null;
      handleX.set(targetX);
      if (clipRectRef.current) {
        clipRectRef.current.setAttribute(
          'width',
          String(boundedProgress * scrubberWidth),
        );
      }
      return;
    }

    isScrubberAnimatingRef.current = true;
    scrubberAnimationRef.current = animate(handleX.get(), targetX, {
      duration: C.CONTROL_CLICK_ANIMATION_DURATION,
      ease: C.CONTROL_CLICK_ANIMATION_EASE,
      onUpdate: (latest) => handleX.set(latest),
      onComplete: () => {
        isScrubberAnimatingRef.current = false;
        scrubberAnimationRef.current = null;
      },
    });
  };

  const handleScrubberClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (hasScrubberDraggedRef.current) return;
    if (!scrubberRef.current || scrubberWidth <= 0) return;

    const scrubberRect = scrubberRef.current.getBoundingClientRect();
    const clickX = event.clientX - scrubberRect.left;
    moveScrubberTo(clickX / scrubberWidth);
  };

  const handleScrubberKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (safeDuration <= 0) return;

    const keyboardStep = C.SEEK_KEYBOARD_STEP_SECONDS / safeDuration;
    let targetProgress: number | null = null;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        targetProgress = safeProgress - keyboardStep;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        targetProgress = safeProgress + keyboardStep;
        break;
      case 'Home':
        targetProgress = 0;
        break;
      case 'End':
        targetProgress = 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    moveScrubberTo(targetProgress);
  };

  const createLevelSliderHandler = (
    controlRef: React.RefObject<HTMLDivElement>,
    setter: (value: number) => void,
    fill: typeof intensityFill,
    animationRef: typeof intensityAnimationRef,
    isAnimatingRef: typeof isIntensityAnimatingRef,
    orientation: ControlOrientation,
  ) => {
    return (event: React.PointerEvent<HTMLDivElement>) => {
      if (!event.isPrimary || event.button !== 0) return;

      event.preventDefault();
      event.currentTarget.focus({ preventScroll: true });
      const startCoordinate =
        orientation === 'horizontal' ? event.clientX : event.clientY;
      let hasDragged = false;

      const getValue = (clientX: number, clientY: number) => {
        if (!controlRef.current) return null;
        const rect = controlRef.current.getBoundingClientRect();
        const percentage =
          orientation === 'horizontal'
            ? ((clientX - rect.left) / rect.width) * 100
            : 100 - ((clientY - rect.top) / rect.height) * 100;
        return clampPercentage(percentage);
      };

      const applyDraggedValue = (value: number) => {
        animationRef.current?.stop();
        animationRef.current = null;
        isAnimatingRef.current = false;
        fill.set(value / 100);
        setter(value);
      };

      const removeWindowListeners = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerCancel);
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const currentCoordinate =
          orientation === 'horizontal'
            ? moveEvent.clientX
            : moveEvent.clientY;
        if (
          !hasDragged &&
          Math.abs(currentCoordinate - startCoordinate) <
            C.CONTROL_DRAG_THRESHOLD
        ) {
          return;
        }

        hasDragged = true;
        const value = getValue(moveEvent.clientX, moveEvent.clientY);
        if (value !== null) applyDraggedValue(value);
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        removeWindowListeners();
        const value = getValue(upEvent.clientX, upEvent.clientY);
        if (value === null) return;

        if (hasDragged) {
          applyDraggedValue(value);
          return;
        }

        animateControlFill(fill, animationRef, isAnimatingRef, value);
        setter(value);
      };

      const handlePointerCancel = () => {
        removeWindowListeners();
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerCancel);
    };
  };

  const handleLevelKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    setter: (value: number) => void,
    fill: typeof intensityFill,
    animationRef: typeof intensityAnimationRef,
    isAnimatingRef: typeof isIntensityAnimatingRef,
  ) => {
    const currentValue = clampPercentage(fill.get() * 100);
    let targetValue: number | null = null;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        targetValue = currentValue - C.LEVEL_KEYBOARD_STEP;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        targetValue = currentValue + C.LEVEL_KEYBOARD_STEP;
        break;
      case 'PageDown':
        targetValue = currentValue - C.LEVEL_KEYBOARD_PAGE_STEP;
        break;
      case 'PageUp':
        targetValue = currentValue + C.LEVEL_KEYBOARD_PAGE_STEP;
        break;
      case 'Home':
        targetValue = 0;
        break;
      case 'End':
        targetValue = 100;
        break;
      default:
        return;
    }

    event.preventDefault();
    const boundedValue = clampPercentage(targetValue);
    animateControlFill(fill, animationRef, isAnimatingRef, boundedValue);
    setter(boundedValue);
  };

  const currentTrack =
    currentTrackIndex !== null ? tracks[currentTrackIndex] : null;
  const mobileTrackTitle =
    currentTrack?.title?.trim() ||
    (tracks.length > 0 ? 'Preparing track' : 'Loading audio');
  const mobileTrackArtist =
    currentTrack?.artist?.trim() ||
    (currentTrack ? 'Unknown artist' : 'Track details will appear here');

  const playPauseButton = (
    <PlayPauseButton
      $variant={variant}
      type="button"
      aria-label={isPlaying ? 'Pause current track' : 'Play current track'}
      onClick={isPlaying ? pause : play}
    >
      {isPlaying ? (
        <PlayPauseIcon key="pause">
          <FaPause />
        </PlayPauseIcon>
      ) : (
        <PlayPauseIcon key="play">
          <FaPlay />
        </PlayPauseIcon>
      )}
    </PlayPauseButton>
  );

  const previousButton = (
    <ControlButton
      $variant={variant}
      type="button"
      aria-label="Play previous track"
      onClick={skipBackward}
    >
      <FaBackwardStep />
    </ControlButton>
  );

  const nextButton = (
    <ControlButton
      $variant={variant}
      type="button"
      aria-label="Play next track"
      onClick={skipForward}
    >
      <FaForwardStep />
    </ControlButton>
  );

  const renderScrubber = (playerVariant: PlayerVariant) => (
    <ScrubberContainer
      $variant={playerVariant}
      ref={scrubberRef}
      onClick={handleScrubberClick}
      onKeyDown={handleScrubberKeyDown}
      role="slider"
      tabIndex={0}
      aria-label="Track position"
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={seekAriaMaximum}
      aria-valuenow={seekAriaValue}
      aria-valuetext={`${formattedCurrentTime} of ${formattedDuration}`}
      aria-disabled={safeDuration <= 0}
      clickable
    >
      <svg
        width={scrubberWidth}
        height={C.WAVE_SVG_HEIGHT}
        style={{ overflow: 'visible' }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={clipPathId}>
            <rect
              ref={clipRectRef}
              x="0"
              y={C.WAVE_CLIP_PATH_Y}
              width="0"
              height={C.WAVE_CLIP_PATH_HEIGHT}
            />
          </clipPath>
        </defs>

        <path
          ref={backgroundWaveRef}
          stroke={theme.colors.defaultUnselected}
          strokeWidth={C.WAVE_STROKE_WIDTH}
          strokeLinecap="round"
          fill="none"
        />

        <path
          ref={foregroundWaveRef}
          stroke={theme.colors.defaultSelected}
          strokeWidth={C.WAVE_STROKE_WIDTH}
          strokeLinecap="round"
          fill="none"
          clipPath={`url(#${clipPathId})`}
        />
      </svg>

      <ScrubberHandle
        $variant={playerVariant}
        drag="x"
        dragConstraints={{ left: 0, right: scrubberTravel }}
        dragElastic={0}
        dragMomentum={false}
        style={{ x: handleX, y: handleY }}
        aria-hidden="true"
        onDragStart={() => {
          scrubberAnimationRef.current?.stop();
          scrubberAnimationRef.current = null;
          isScrubberAnimatingRef.current = false;
          isDraggingRef.current = true;
          hasScrubberDraggedRef.current = true;
        }}
        onDragEnd={() => {
          isDraggingRef.current = false;
          window.setTimeout(() => {
            hasScrubberDraggedRef.current = false;
          }, 0);
        }}
      />
    </ScrubberContainer>
  );

  const renderLevelControl = (
    control: LevelControl,
    orientation: ControlOrientation,
  ) => {
    const isIntensity = control === 'intensity';
    const label = isIntensity ? 'Visual response' : 'Volume';
    const labelId = isIntensity ? intensityLabelId : volumeLabelId;
    const controlRef = isIntensity
      ? intensityControlRef
      : volumeControlRef;
    const value = clampPercentage(isIntensity ? intensity : volume);
    const setter = isIntensity ? setIntensity : setVolume;
    const fill = isIntensity ? intensityFill : volumeFill;
    const animationRef = isIntensity
      ? intensityAnimationRef
      : volumeAnimationRef;
    const isAnimatingRef = isIntensity
      ? isIntensityAnimatingRef
      : isVolumeAnimatingRef;

    const slider = (
      <MediaControlContainer
        $orientation={orientation}
        ref={controlRef}
        role="slider"
        tabIndex={0}
        aria-label={orientation === 'vertical' ? `${label} level` : undefined}
        aria-labelledby={orientation === 'horizontal' ? labelId : undefined}
        aria-orientation={orientation}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        aria-valuetext={`${Math.round(value)} percent`}
        clickable
        onPointerDown={createLevelSliderHandler(
          controlRef,
          setter,
          fill,
          animationRef,
          isAnimatingRef,
          orientation,
        )}
        onKeyDown={(event) =>
          handleLevelKeyDown(
            event,
            setter,
            fill,
            animationRef,
            isAnimatingRef,
          )
        }
      >
        <MediaControlFill
          $orientation={orientation}
          style={
            orientation === 'horizontal'
              ? { scaleX: fill }
              : { scaleY: fill }
          }
        />
        <MediaControlIcon>
          {isIntensity ? (
            <BsBrightnessHighFill />
          ) : (
            <PiSpeakerSimpleHighFill />
          )}
        </MediaControlIcon>
      </MediaControlContainer>
    );

    if (orientation === 'vertical') return slider;

    return (
      <MobileLevelControl>
        <MobileLevelMeta id={labelId}>
          <span>{label}</span>
          <span aria-hidden="true">{Math.round(value)}%</span>
        </MobileLevelMeta>
        {slider}
      </MobileLevelControl>
    );
  };

  if (variant === 'mobile') {
    return (
      <MediaPlayerContainer $variant="mobile" clickable>
        <MobileTrackInfo
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-busy={!currentTrack}
        >
          <MobileTrackTitle title={currentTrack ? mobileTrackTitle : undefined}>
            {mobileTrackTitle}
          </MobileTrackTitle>
          <MobileTrackArtist
            title={currentTrack ? mobileTrackArtist : undefined}
          >
            {mobileTrackArtist}
          </MobileTrackArtist>
        </MobileTrackInfo>

        <MobileScrubberBlock>
          {renderScrubber('mobile')}
          <MobileTimeRow>
            <time dateTime={`PT${Math.floor(currentTime)}S`}>
              {formattedCurrentTime}
            </time>
            <time dateTime={`PT${Math.floor(safeDuration)}S`}>
              {formattedDuration}
            </time>
          </MobileTimeRow>
        </MobileScrubberBlock>

        <MobileTransport>
          {previousButton}
          {playPauseButton}
          {nextButton}
        </MobileTransport>

        <MobileLevelControls>
          {renderLevelControl('intensity', 'horizontal')}
          {renderLevelControl('volume', 'horizontal')}
        </MobileLevelControls>
      </MediaPlayerContainer>
    );
  }

  return (
    <MediaPlayerContainer
      $variant="desktop"
      justifyContent="space-around"
      alignItems="center"
      gap={C.MEDIA_PLAYER_GAP}
      clickable
    >
      {playPauseButton}
      <FlexBox width="100%" flexDirection="column">
        <FlexBox>
          <NeonText
            fontSize={C.TRACK_INFO_FONT_SIZE}
            justifyContent="center"
            alignItems="center"
            disableSelection
          >
            {currentTrack
              ? `${currentTrack.title} | ${currentTrack.artist}`
              : 'No track loaded'}
          </NeonText>
        </FlexBox>
        <FlexBox
          justifyContent="space-around"
          width="100%"
          alignItems="center"
          clickable
        >
          {previousButton}
          {renderScrubber('desktop')}
          {nextButton}
        </FlexBox>
      </FlexBox>
      <FlexBox gap="8px" alignItems="center" width="auto" height="100%">
        {renderLevelControl('intensity', 'vertical')}
        {renderLevelControl('volume', 'vertical')}
      </FlexBox>
    </MediaPlayerContainer>
  );
};

export default MediaPlayer;
