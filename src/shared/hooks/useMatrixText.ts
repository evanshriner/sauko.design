import { useState, useEffect, useRef } from 'react';

// the character set for the scrambling effect
const NON_ALPHABET_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>/?`~1234567890';

// Define the types for our hook's options
interface UseMatrixTextOptions {
  /** The characters to use for the scrambling effect. Defaults to non-alphabetic symbols and numbers. */
  characters?: string;
  /** The speed of the animation in milliseconds per character update. Defaults to 50ms. */
  speed?: number;
  /** A value that, when changed, will re-trigger the animation. */
  trigger?: any;
}

/**
 * A React hook for creating a "hacker" text effect.
 * @param targetText The final text to be displayed.
 * @param options Configuration for the animation.
 * @returns The current state of the animated text.
 */
const useMatrixText = (
  targetText: string,
  options: UseMatrixTextOptions = {},
): string => {
  const { characters = NON_ALPHABET_CHARS, speed = 50, trigger } = options;

  const [displayText, setDisplayText] = useState<string>('');
  const iteration = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | undefined>();

  useEffect(() => {
    // this is the core of the retriggering logic.
    // whenever the targetText or the trigger prop changes, we reset the animation state.
    iteration.current = 0;
    setDisplayText('');
    previousTimeRef.current = undefined;

    const animate = (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }

      const deltaTime = time - previousTimeRef.current;

      if (deltaTime > speed) {
        const newText = targetText
          .split('')
          .map((char, index) => {
            if (index < iteration.current) {
              return targetText[index];
            }
            return char === ' '
              ? ' '
              : characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');

        setDisplayText(newText);

        if (iteration.current < targetText.length) {
          iteration.current += 1 / 3;
        }

        previousTimeRef.current = time;
      }

      if (iteration.current < targetText.length) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(targetText);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [targetText, characters, speed, trigger]);

  return displayText;
};

export default useMatrixText;
