import { useEffect, useRef, useCallback } from 'react';

const LETTERS =
  '!#$%^*()_+-=[]{}|;:,.<>/?`~1234567890アイウエオカキクケコサシスセソタチツテト';
const FONT_SIZE = 8;
const ANIMATION_INTERVAL = 50; // ms

interface MatrixAnimationOptions {
  font?: string;
  color?: string;
}

/**
 * A custom React hook to render a "Matrix" style animation on a canvas element.
 *
 * @param canvasRef - A React ref to the canvas element.
 * @param options - Configuration options for the animation.
 * @param options.font - The font family to use for the characters.
 * @param options.color - The color of the characters.
 */
export const useMatrixAnimation = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options: MatrixAnimationOptions = {},
) => {
  const { font, color = '#0f0' } = options;

  const animationState = useRef({
    animationFrameId: 0,
    lastTime: 0,
    timer: 0,
    drops: [] as number[],
    columns: 0,
  });

  /**
   * Handles resizing the canvas to fill the window and re-initializes the drops.
   */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animationState.current.columns = Math.floor(canvas.width / FONT_SIZE);

    // Re-initialize drops for the new column count
    const { columns } = animationState.current;
    const newDrops: number[] = [];
    for (let i = 0; i < columns; i++) {
      newDrops[i] = Math.floor(-Math.random() * (canvas.height / FONT_SIZE));
    }
    animationState.current.drops = newDrops;
  }, [canvasRef]);

  // Effect for handling window resize
  useEffect(() => {
    handleResize(); // Initial resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  /**
   * The main drawing function that renders each frame of the animation.
   */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Set font dynamically
    ctx.font = `${FONT_SIZE}px ${font || 'monospace'}`;

    // Draw semi-transparent black rectangle to create the fading trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, .1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { drops } = animationState.current;
    const availableLetters = LETTERS.split('');

    ctx.fillStyle = color;

    for (let i = 0; i < drops.length; i++) {
      const text =
        availableLetters[Math.floor(Math.random() * availableLetters.length)];
      ctx.fillText(text, i * FONT_SIZE, drops[i] * FONT_SIZE);

      // Move the drop down
      drops[i]++;

      // Reset drop to the top if it's off-screen and with a random chance
      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.95) {
        drops[i] = 0;
      }
    }
  }, [canvasRef, font, color]);

  /**
   * The animation loop, managed by requestAnimationFrame.
   */
  const animate = useCallback(
    (timeStamp: number) => {
      const { current } = animationState;
      const deltaTime = timeStamp - current.lastTime;
      current.lastTime = timeStamp;

      if (current.timer > ANIMATION_INTERVAL) {
        draw();
        current.timer = 0;
      } else {
        current.timer += deltaTime;
      }

      current.animationFrameId = requestAnimationFrame(animate);
    },
    [draw],
  );

  // Effect for starting and stopping the animation loop
  useEffect(() => {
    // Start the animation
    animationState.current.animationFrameId = requestAnimationFrame(animate);

    // Cleanup function to cancel the animation frame on unmount
    return () => {
      cancelAnimationFrame(animationState.current.animationFrameId);
    };
  }, [animate]);
};
