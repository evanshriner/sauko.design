import { useEffect } from 'react';

export const useMatrixAnimation = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  font?: string,
  color?: string,
) => {
  useEffect(() => {
    if (canvasRef.current === null) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let animationFrameId: number;
    let lastTime = 0;
    const interval = 50;
    let timer = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const letters =
      '!#$%^*()_+-=[]{}|;:,.<>/?`~1234567890アイウエオカキクケコサシスセソタチツテト';
    const availableLetters = letters.split('');
    const fontSize = 8;
    if (ctx && font) {
      ctx.font = `${fontSize}px ${font}`;
    }
    const columns = canvas.width / fontSize;

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      // Initialize drops at random y-positions off-screen to create a staggered effect
      drops[i] = Math.floor(-Math.random() * (canvas.height / fontSize));
    }

    const draw = () => {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < drops.length; i++) {
        const text =
          availableLetters[Math.floor(Math.random() * availableLetters.length)];
        ctx.fillStyle = color || '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
      }
    };

    const animate = (timeStamp: number) => {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;

      if (timer > interval) {
        draw();
        timer = 0;
      } else {
        timer += deltaTime;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef, font, color]);
};
