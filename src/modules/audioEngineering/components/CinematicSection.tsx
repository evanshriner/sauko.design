import React, { useRef, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlexBox from '@/shared/components/FlexBox';

interface CinematicSectionProps {
  id: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  content?: string | React.ReactNode;
  image?: string;
  background?: React.ReactNode;
  layout?: 'left' | 'right' | 'center';
  className?: string;
}

const SectionContainer = styled(FlexBox)`
  width: 100%;
  min-height: 100vh;
  position: relative;
  padding: 4rem 10%;
  overflow: hidden;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 4rem 5%;
    flex-direction: column !important;
  }
`;

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const ContentWrapper = styled(FlexBox)<{ layout: string }>`
  flex-direction: column;
  z-index: 2;
  max-width: ${({ layout }) => (layout === 'center' ? '900px' : '50%')};
  text-align: ${({ layout }) => layout};
  align-items: ${({ layout }) => 
    layout === 'left' ? 'flex-start' : 
    layout === 'right' ? 'flex-end' : 'center'};

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
    align-items: center;
  }
`;

const Title = styled.h2`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  line-height: 0.9;
  margin: 0;
  text-transform: uppercase;
  color: #ffffff;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.div`
  margin-top: 1.5rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.6);
`;

const ContentBody = styled.div`
  margin-top: 2rem;
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
`;

const ImageWrapper = styled.div<{ layout: string }>`
  position: absolute;
  top: 50%;
  ${({ layout }) => (layout === 'left' ? 'right: 5%' : 'left: 5%')};
  transform: translateY(-50%);
  width: 35%;
  height: 60vh;
  z-index: 1;
  opacity: 0.4;
  pointer-events: none;
  overflow: hidden;

  display: ${({ layout }) => (layout === 'center' ? 'none' : 'block')};

  @media (max-width: 768px) {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    transform: none;
    width: 100%;
    height: 40vh;
    margin-top: 3rem;
    display: block;
    opacity: 0.6;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 120%; /* Extra height for parallax */
  object-fit: cover;
  filter: grayscale(100%) brightness(0.6);
  transition: filter 0.5s ease;
`;

const CinematicSection: React.FC<CinematicSectionProps> = ({
  id,
  title,
  subtitle,
  content,
  image,
  background,
  layout = 'center',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Title & Text animations
      if (contentRef.current) {
        const elements = contentRef.current.children;
        gsap.fromTo(elements, 
          { 
            y: 100, 
            opacity: 0, 
            filter: 'blur(10px)' 
          },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.1,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }

      // Image Parallax & Filter animation
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });

        gsap.to(imageRef.current, {
          filter: 'grayscale(0%) brightness(0.8)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: 'center center',
            scrub: true,
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionContainer 
      id={id} 
      ref={containerRef} 
      className={`cinematic-section ${className || ''}`}
      flexDirection={layout === 'right' ? 'row-reverse' : 'row'}
    >
      {background && <BackgroundWrapper>{background}</BackgroundWrapper>}
      
      <ContentWrapper ref={contentRef} layout={layout}>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        <Title>{title}</Title>
        {content && <ContentBody>{content}</ContentBody>}
      </ContentWrapper>
      
      {image && (
        <ImageWrapper layout={layout}>
          <StyledImage 
            ref={imageRef} 
            src={image} 
            alt={typeof title === 'string' ? title : 'Section Image'} 
          />
        </ImageWrapper>
      )}
    </SectionContainer>
  );
};

export default CinematicSection;
