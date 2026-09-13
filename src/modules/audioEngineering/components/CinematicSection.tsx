import React, { useId, useLayoutEffect, useRef } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlexBox from '@/shared/components/FlexBox';

interface CinematicSectionProps {
  id: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  content?: string | React.ReactNode;
  imageAlt?: string;
  image?: string;
  background?: React.ReactNode;
  layout?: 'left' | 'right' | 'center';
  className?: string;
}
type ImageTreatment = 'restoration' | 'modular';

const imageTreatments = {
  restoration: {
    entryFilter:
      'grayscale(100%) sepia(30%) saturate(64%) contrast(1.48) brightness(0.7)',
    restingFilter:
      'grayscale(100%) sepia(40%) saturate(68%) contrast(1.34) brightness(0.96)',
    entryOpacity: 0.76,
    restingOpacity: 0.9,
    bleedOpacity: 0.38,
    objectPosition: '52% 50%',
  },
  modular: {
    entryFilter:
      'grayscale(100%) sepia(28%) saturate(60%) contrast(1.58) brightness(0.6)',
    restingFilter:
      'grayscale(100%) sepia(36%) saturate(64%) contrast(1.46) brightness(0.84)',
    entryOpacity: 0.7,
    restingOpacity: 0.84,
    bleedOpacity: 0.31,
    objectPosition: '62% 50%',
  },
} as const;

const SectionContainer = styled(FlexBox)`
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  position: relative;
  padding: 4rem 10%;
  overflow: hidden;
  justify-content: center;
  align-items: center;

  @media (max-width: 64rem) {
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
    layout === 'left'
      ? 'flex-start'
      : layout === 'right'
      ? 'flex-end'
      : 'center'};

  @media (max-width: 64rem) {
    max-width: 100%;
    text-align: center;
    align-items: center;
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  line-height: 0.9;
  margin: 0;
  letter-spacing: -0.02em;
`;

const TitleInner = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  color: var(--audio-heading);
  filter: url(#neonGlow);
  display: block;
`;
const Subtitle = styled.p`
  margin-top: 1.5rem;
  font-family: 'Orbit', sans-serif;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--audio-technical);
`;

const ContentBody = styled.div`
  margin-top: 2rem;
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  line-height: 1.6;
  color: var(--audio-copy);
  max-width: 600px;
`;
const ImageWrapper = styled.div<{ layout: string }>`
  --display-tone: 224 207 173;
  --display-highlight: 247 240 222;
  --display-black: 10 10 8;
  --display-ink: 5 5 4;
  --display-edge: 211 205 198;

  position: absolute;
  top: 50%;
  ${({ layout }) => (layout === 'left' ? 'right: 5%' : 'left: 5%')};
  transform: translateY(-50%) perspective(1000px)
    rotateY(${({ layout }) => (layout === 'left' ? '-3deg' : '3deg')});
  width: min(40rem, 38vw);
  height: auto;
  aspect-ratio: 4 / 3;
  z-index: 1;
  opacity: 1;
  pointer-events: none;
  overflow: hidden;
  isolation: isolate;
  display: ${({ layout }) => (layout === 'center' ? 'none' : 'block')};
  clip-path: polygon(
    18px 0,
    calc(100% - 8px) 0,
    100% 8px,
    100% calc(100% - 18px),
    calc(100% - 18px) 100%,
    8px 100%,
    0 calc(100% - 8px),
    0 18px
  );
  background: rgb(var(--display-black) / 0.94);
  filter: drop-shadow(0 18px 36px rgb(var(--display-ink) / 0.4));

  @media (max-width: 64rem) {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    transform: none;
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    margin-top: 3rem;
    display: block;
    clip-path: polygon(
      12px 0,
      calc(100% - 6px) 0,
      100% 6px,
      100% calc(100% - 12px),
      calc(100% - 12px) 100%,
      6px 100%,
      0 calc(100% - 6px),
      0 12px
    );
    filter: drop-shadow(0 12px 24px rgb(var(--display-ink) / 0.34));
  }
`;

const DisplayFilterSvg = styled.svg`
  position: absolute;
  width: 0;
  height: 0;
`;

const ImageField = styled.div`
  position: absolute;
  z-index: 1;
  inset-inline: 0;
  top: -10%;
  width: 100%;
  height: 120%;
  transform: translateZ(0);
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    transform: translate3d(0, 0, 0);
  }
`;

const StyledImage = styled.img<{
  $asset: ImageTreatment;
  $filterId: string;
}>`
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${({ $asset }) => imageTreatments[$asset].objectPosition};
  image-rendering: pixelated;
  opacity: ${({ $asset }) => imageTreatments[$asset].restingOpacity};
  filter: ${({ $asset, $filterId }) =>
    `url(#${$filterId}) ${imageTreatments[$asset].restingFilter}`};
  transform: translateZ(0);
  will-change: filter, opacity;

  @media (max-width: 64rem) {
    object-position: ${({ $asset }) =>
      $asset === 'modular'
        ? '60% 50%'
        : imageTreatments[$asset].objectPosition};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const PlateLayer = styled.span`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const DisplayWash = styled(PlateLayer)`
  z-index: 3;
  background: radial-gradient(
      circle at 50% 46%,
      rgb(var(--display-highlight) / 0.16),
      transparent 58%
    ),
    linear-gradient(
      180deg,
      rgb(var(--display-highlight) / 0.08),
      rgb(var(--display-tone) / 0.16) 58%,
      rgb(var(--display-black) / 0.22)
    );
  mix-blend-mode: soft-light;
  opacity: 0.52;
`;

const PixelGrid = styled(PlateLayer)`
  z-index: 4;
  background: repeating-linear-gradient(
      180deg,
      rgb(var(--display-ink) / 0.48) 0 1px,
      transparent 1px 4px
    ),
    repeating-linear-gradient(
      90deg,
      rgb(var(--display-ink) / 0.34) 0 1px,
      transparent 1px 4px
    );
  mix-blend-mode: multiply;
  opacity: 0.6;

  @media (max-width: 768px) {
    background: repeating-linear-gradient(
        180deg,
        rgb(var(--display-ink) / 0.42) 0 1px,
        transparent 1px 5px
      ),
      repeating-linear-gradient(
        90deg,
        rgb(var(--display-ink) / 0.3) 0 1px,
        transparent 1px 5px
      );
    opacity: 0.54;
  }
`;

const EmitterGrid = styled(PlateLayer)`
  z-index: 5;
  background-image: radial-gradient(
    circle,
    rgb(var(--display-highlight) / 0.25) 0 0.55px,
    transparent 0.8px
  );
  background-size: 4px 4px;
  mix-blend-mode: screen;
  opacity: 0.34;

  @media (max-width: 768px) {
    background-size: 5px 5px;
    opacity: 0.26;
  }
`;

const PlateLight = styled(PlateLayer)`
  z-index: 6;
  inset: -38% -18%;
  background: linear-gradient(
    112deg,
    transparent 38%,
    rgb(var(--display-highlight) / 0) 44%,
    rgb(var(--display-highlight) / 0.22) 49%,
    rgb(var(--display-highlight) / 0.08) 52%,
    transparent 59%
  );
  mix-blend-mode: screen;
  opacity: 0.68;
  transform: translate3d(0, 0, 0);
  will-change: transform;

  @media (max-width: 768px) {
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 0.36;
    transform: translate3d(0, 0, 0);
  }
`;

const PlateFrame = styled(PlateLayer)`
  z-index: 7;
  background:
    linear-gradient(
        90deg,
        transparent 0 9%,
        rgb(var(--display-highlight) / 0.58) 9% 23%,
        transparent 23%
      )
      top / 100% 1px no-repeat,
    linear-gradient(
        90deg,
        transparent 0 68%,
        rgb(var(--display-edge) / 0.42) 68% 92%,
        transparent 92%
      )
      bottom / 100% 1px no-repeat;
  box-shadow:
    inset 0 0 0 1px rgb(var(--display-edge) / 0.58),
    inset 0 0 0 4px rgb(var(--display-black) / 0.34),
    inset 0 -30px 44px rgb(var(--display-ink) / 0.22),
    inset 0 22px 30px rgb(var(--display-highlight) / 0.05);

  @media (max-width: 420px) {
    box-shadow:
      inset 0 0 0 1px rgb(var(--display-edge) / 0.58),
      inset 0 0 0 3px rgb(var(--display-black) / 0.34),
      inset 0 -24px 36px rgb(var(--display-ink) / 0.22),
      inset 0 18px 24px rgb(var(--display-highlight) / 0.05);
  }
`;

const CinematicSection: React.FC<CinematicSectionProps> = ({
  id,
  title,
  subtitle,
  content,
  image,
  imageAlt,
  background,
  layout = 'center',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const lightRef = useRef<HTMLSpanElement>(null);
  const displayFilterId = `display-posterize-${useId().replace(/:/g, '')}`;
  const imageTreatment: ImageTreatment = image?.includes('modular_rack')
    ? 'modular'
    : 'restoration';

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (contentRef.current) {
        const elements = contentRef.current.children;
        gsap.fromTo(
          elements,
          {
            y: 100,
            opacity: 0,
            filter: 'blur(10px)',
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
            },
          },
        );
      }

      if (fieldRef.current && imageRef.current) {
        const treatment = imageTreatments[imageTreatment];
        const parallaxTravel = window.matchMedia('(max-width: 768px)').matches
          ? 4
          : 8;

        gsap.fromTo(
          fieldRef.current,
          { yPercent: -parallaxTravel },
          {
            yPercent: parallaxTravel,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );

        gsap.fromTo(
          imageRef.current,
          {
            filter: `url(#${displayFilterId}) ${treatment.entryFilter}`,
            opacity: treatment.entryOpacity,
          },
          {
            filter: `url(#${displayFilterId}) ${treatment.restingFilter}`,
            opacity: treatment.restingOpacity,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 60%',
              end: 'center center',
              scrub: true,
            },
          },
        );
      }

      if (lightRef.current) {
        gsap.fromTo(
          lightRef.current,
          { xPercent: -12, yPercent: -8 },
          {
            xPercent: 12,
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    });

    return () => media.revert();
  }, [displayFilterId, imageTreatment]);

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
        <Title as={id === 'source' ? 'h1' : undefined}>
          <TitleInner>{title}</TitleInner>
        </Title>
        {content && <ContentBody>{content}</ContentBody>}
      </ContentWrapper>

      {image && (
        <ImageWrapper layout={layout}>
          <DisplayFilterSvg aria-hidden="true" focusable="false">
            <defs>
              <filter
                id={displayFilterId}
                x="-2%"
                y="-2%"
                width="104%"
                height="104%"
                colorInterpolationFilters="sRGB"
              >
                <feComponentTransfer>
                  <feFuncR
                    type="discrete"
                    tableValues="0 0.1 0.22 0.36 0.52 0.7 0.86 1"
                  />
                  <feFuncG
                    type="discrete"
                    tableValues="0 0.1 0.22 0.36 0.52 0.7 0.86 1"
                  />
                  <feFuncB
                    type="discrete"
                    tableValues="0 0.1 0.22 0.36 0.52 0.7 0.86 1"
                  />
                </feComponentTransfer>
              </filter>
            </defs>
          </DisplayFilterSvg>
          <ImageField ref={fieldRef}>
            <StyledImage
              ref={imageRef}
              src={image}
              alt={imageAlt ?? ''}
              $asset={imageTreatment}
              $filterId={displayFilterId}
            />
          </ImageField>
          <DisplayWash aria-hidden="true" />
          <PixelGrid aria-hidden="true" />
          <EmitterGrid aria-hidden="true" />
          <PlateLight ref={lightRef} aria-hidden="true" />
          <PlateFrame aria-hidden="true" />
        </ImageWrapper>
      )}
    </SectionContainer>
  );
};

export default CinematicSection;
