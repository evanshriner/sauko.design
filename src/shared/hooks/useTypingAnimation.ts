import { useState, useEffect, useRef } from 'react';

// Define the types for our hook's options
interface UseTypingAnimationOptions {
  /** The speed of the animation in milliseconds per character. Defaults to 50ms. */
  speed?: number;
  /** A value that, when changed, will re-trigger the animation. */
  trigger?: unknown;
}

/**
 * A React hook for creating a typing animation effect.
 * @param targetText The final text to be displayed.
 * @param options Configuration for the animation.
 * @returns The current state of the animated text.
 */
const useTypingAnimation = (
  targetText: string,
  options: UseTypingAnimationOptions = {},
): string => {
  const { speed = 50, trigger } = options;

  const [displayText, setDisplayText] = useState<string>('');
  const currentIndex = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | undefined>();

  useEffect(() => {
    // Reset animation state whenever targetText or trigger changes
    currentIndex.current = 0;
    setDisplayText('');
    previousTimeRef.current = undefined;

    const animate = (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }

      const deltaTime = time - previousTimeRef.current;

      if (deltaTime > speed) {
        if (currentIndex.current < targetText.length) {
          currentIndex.current += 1;
          setDisplayText(targetText.substring(0, currentIndex.current));
        }

        previousTimeRef.current = time;
      }

      if (currentIndex.current < targetText.length) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(targetText); // Ensure the final text is exactly the target
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [targetText, speed, trigger]);

  return displayText;
};

export default useTypingAnimation;
