import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styled from '@emotion/styled';
import { Theme } from '@emotion/react';
import ContentBox from '@/shared/styles/ContentBox';
import NeonText from '@/shared/styles/NeonText';

const AnimatedContentBox = styled(ContentBox)(({ theme }: { theme: Theme }) => ({
  transition: 'background-color 0.3s, color 0.3s',
  '&:hover': {
    backgroundColor: 'black',
    color: theme.colors.primaryBackground,
    '.neon-text': {
      color: theme.colors.primaryBackground,
      textShadow: 'none',
    },
  },
}));

interface ServiceListItemProps {
  text: string;
}

function ServiceListItem({ text }: ServiceListItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = itemRef.current;

    if (!el) return;

    const animation = gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        paused: true,
      }
    );

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => animation.restart(),
      onLeaveBack: () => animation.reverse(),
    });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, []);

  return (
    <AnimatedContentBox ref={itemRef} height="auto" justifyContent="center" clickable>
      <NeonText
        className="neon-text"
        fontSize="3.2em"
        inverted
        padding="1rem"
        justifyContent="center"
      >
        {text}
      </NeonText>
    </AnimatedContentBox>
  );
}

export default ServiceListItem;