// useHackerText.ts
import { useState, useEffect, useRef } from 'react';

// Define the character set for the scrambling effect
const NON_ALPHABET_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>/?`~1234567890';

// Define the types for our hook's options
interface UseHackerTextOptions {
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
const useHackerText = (
  targetText: string,
  options: UseHackerTextOptions = {}
): string => {
  const {
    characters = NON_ALPHABET_CHARS,
    speed = 50,
    trigger,
  } = options;

  const [displayText, setDisplayText] = useState<string>('');
  const iteration = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | undefined>();

  useEffect(() => {
    // This is the core of the retriggering logic.
    // Whenever the targetText or the trigger prop changes, we reset the animation state.
    iteration.current = 0;
    setDisplayText(''); // Start with a blank or placeholder state if you prefer
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
            // Return a space for spaces, otherwise a random char
            return char === ' ' ? ' ' : characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');

        setDisplayText(newText);

        // This controls the "reveal" speed. A smaller increment makes the reveal sweep slower.
        if (iteration.current < targetText.length) {
            iteration.current += 1 / 3;
        }

        previousTimeRef.current = time;
      }

      if (iteration.current < targetText.length) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(targetText); // Ensure the final text is perfect
      }
    };

    // Start the animation
    requestRef.current = requestAnimationFrame(animate);

    // Cleanup function to cancel the animation frame when the component unmounts or effect re-runs
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [targetText, characters, speed, trigger]); // Effect re-runs if these change

  return displayText;
};

export default useHackerText;