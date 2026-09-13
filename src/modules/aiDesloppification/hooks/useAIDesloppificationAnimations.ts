import { useEffect, useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function useAIDesloppificationAnimations(
  pageRef: RefObject<HTMLElement>,
  heroContentRef: RefObject<HTMLDivElement>,
  heroVisualRef: RefObject<HTMLDivElement>,
): void {
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const heroContent = heroContentRef.current;
        const heroVisual = heroVisualRef.current;
        const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } });

        if (heroContent) {
          timeline
            .fromTo(
              heroContent,
              { filter: 'blur(10px)' },
              { filter: 'blur(0px)', duration: 1.15 },
              0,
            )
            .fromTo(
              Array.from(heroContent.children),
              { opacity: 0, y: 68 },
              {
                opacity: 1,
                y: 0,
                duration: 1.15,
                stagger: 0.09,
              },
              0,
            );
        }

        if (heroVisual) {
          timeline.fromTo(
            heroVisual,
            { opacity: 0, x: 64, filter: 'blur(12px)' },
            {
              opacity: 0.88,
              x: 0,
              filter: 'blur(0px)',
              duration: 1.4,
            },
            0.18,
          );
        }

        const chapterSections = Array.from(
          pageRef.current?.querySelectorAll<HTMLElement>(
            '[data-chapter-section]',
          ) ?? [],
        );

        chapterSections.forEach((section) => {
          const elements = Array.from(
            section.querySelectorAll<HTMLElement>('[data-chapter-reveal]'),
          );

          gsap.fromTo(
            elements,
            {
              opacity: 0,
              y: 56,
              filter: 'blur(8px)',
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.05,
              stagger: 0.1,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        });
      });
    }, pageRef);

    return () => {
      context.revert();
      media.revert();
    };
  }, [pageRef, heroContentRef, heroVisualRef]);
}
