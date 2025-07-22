import { useState, useEffect, useRef } from 'react';

interface UseThrottledProgressOptions {
  progress: number;
  minDuration: number;
  staggered?: boolean;
}

/**
 * provides a smooth or staggered animation for progress bars.
 *
 * @param {UseThrottledProgressOptions} options - The options for the hook.
 * @param {number} options.progress - The actual progress value (a number between 0 and 100).
 * @param {number} options.minDuration - The minimum time in milliseconds the throttled progress should take to reach 100.
 * @param {boolean} [options.staggered=true] - If true, the progress animation will be staggered (good for computers that are too fast, making the animation look too quick).
 * @returns {number} The throttled progress value.
 */
export const useThrottledProgress = ({
  progress,
  minDuration,
  staggered = true,
}: UseThrottledProgressOptions): number => {
  const [throttledProgress, setThrottledProgress] = useState(0);
  const [checkpoints, setCheckpoints] = useState<number[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (staggered) {
      const numCheckpoints = Math.floor(Math.random() * 6) + 5; // random amount of 'checkpoints' to create a unique loading pattern each time
      const points = new Set<number>();
      while (points.size < numCheckpoints - 1) {
        points.add(Math.random() * 100);
      }
      const sortedPoints = Array.from(points).sort((a, b) => a - b);
      setCheckpoints([...sortedPoints, 100]);
    }
  }, [staggered]);

  useEffect(() => {
    if (progress > 0 && startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    if (progress === 0) {
      startTimeRef.current = null;
      setThrottledProgress(0);
    }

    const animate = () => {
      if (startTimeRef.current === null) {
        return;
      }

      const elapsedTime = Date.now() - startTimeRef.current;

      let currentThrottledProgress = 0;

      if (staggered && checkpoints.length > 0) {
        const checkpointInterval = minDuration / checkpoints.length;
        const currentCheckpointIndex = Math.floor(
          elapsedTime / checkpointInterval,
        );

        // why would the current checkpoint index be greater than the number of checkpoints?
        if (currentCheckpointIndex >= checkpoints.length) {
          currentThrottledProgress =
            progress === 100 ? 100 : Math.max(throttledProgress, progress);
        } else {
          currentThrottledProgress = checkpoints[currentCheckpointIndex];
        }

        if (elapsedTime >= minDuration) {
          currentThrottledProgress = Math.max(
            currentThrottledProgress,
            progress,
          );
        }
      } else {
        const timeBasedProgress = Math.min(
          (elapsedTime / minDuration) * 100,
          100,
        );
        if (progress === 100) {
          currentThrottledProgress = timeBasedProgress;
        } else if (elapsedTime >= minDuration) {
          currentThrottledProgress = progress;
        } else {
          currentThrottledProgress = Math.min(progress, timeBasedProgress);
        }
      }

      setThrottledProgress(currentThrottledProgress);

      if (currentThrottledProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [progress, minDuration, staggered, checkpoints, throttledProgress]);

  return throttledProgress;
};
