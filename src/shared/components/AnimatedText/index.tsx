import { useRef, useLayoutEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


interface AnimatedTextProps {
  children: ReactNode;
}

const AnimatedText = ({ children }: AnimatedTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top bottom',
        toggleActions: 'play reverse play reverse',
      },
    });

    tl.from(textRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
    })
      .to(
        textRef.current,
        {
          color: '#ffffff',
          duration: 0.1,
          ease: 'power1.inOut',
        },
        '-=0.3'
      )
      .to(
        textRef.current,
        {
          color: '#a7a7a7',
          duration: 0.1,
          ease: 'power1.inOut',
        },
        '-=0.2'
      )
      .to(
        textRef.current,
        {
          color: '#ffffff',
          duration: 0.1,
          ease: 'power1.inOut',
        },
        '-=0.1'
      );
  }, []);

  return <div ref={textRef}>{children}</div>;
};

export default AnimatedText;