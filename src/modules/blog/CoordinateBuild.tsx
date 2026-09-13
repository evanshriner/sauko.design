import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

interface CoordinateBuildProps {
  children: React.ReactNode;
  active?: boolean;
}

const CoordinateBuild: React.FC<CoordinateBuildProps> = ({ children, active = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!active || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const blocks = containerRef.current?.querySelectorAll('.bento-block');
      
      if (blocks && blocks.length > 0) {
        gsap.fromTo(
          blocks,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'all',
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [active]);

  return <div ref={containerRef} style={{ width: '100%' }}>{children}</div>;
};

export default CoordinateBuild;
