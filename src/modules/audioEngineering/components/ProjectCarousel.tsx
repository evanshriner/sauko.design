import React, { useRef, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Project {
  artist: string;
  title: string;
  year: string;
  description: string;
  image: string;
  type: string;
}

const projects: Project[] = [
  {
    artist: "DETROIT TECHNO COLLECTIVE",
    title: "VIBRATIONS FROM THE UNDERGROUND",
    year: "2024",
    description: "Meticulous stem mastering for a 12-track vinyl release. Focused on maintaining sub-bass integrity while achieving commercial loudness.",
    image: "/images/artist1.jpg",
    type: "STEM_MASTERING"
  },
  {
    artist: "SARAH LUV",
    title: "ETHEREAL ECHOES",
    year: "2023",
    description: "Full production and mixing. Blending organic vocal textures with industrial modular synthesis.",
    image: "/images/artist2.jpg",
    type: "PRODUCTION // MIXING"
  },
  {
    artist: "THE ARCHIVIST",
    title: "REEL-TO-REEL RESTORATION",
    year: "2023",
    description: "Restoration of lost 1970s jazz tapes. Noise floor reduction and frequency balancing for digital archival.",
    image: "/images/artist1.jpg",
    type: "RESTORATION"
  },
  {
    artist: "URBAN RHYTHM",
    title: "CONCRETE JUNGLE",
    year: "2022",
    description: "Stereo mastering for global streaming. Optimized for maximum translation across club systems and mobile devices.",
    image: "/images/artist2.jpg",
    type: "STEREO_MASTERING"
  }
];

const SectionContainer = styled.section`
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align to top so pinning is more predictable */
  padding: 15vh 5vw;
  z-index: 2;
  background: transparent;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 10vh 20px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 5vw;
  align-items: flex-start;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 3rem;
  }
`;

const TitleColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 2rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding-top: 0;
  }
`;

const ProjectsColumn = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  line-height: 0.9;
  margin: 0;
  filter: url(#neonGlow);
`;

const TechnicalLabel = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
`;

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  cursor: pointer;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-sizing: border-box;

  &:hover .project-image-wrapper {
    filter: grayscale(0%) contrast(1.1) brightness(0.9);
  }

  &:hover .project-image {
    transform: scale(1.05);
  }

  &:hover .hover-content {
    max-height: 250px;
    opacity: 1;
    margin-top: 1rem;
  }

  @media (max-width: 480px) {
    height: 350px;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  filter: grayscale(100%) contrast(1.2) brightness(0.7);
  transition: filter 0.5s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.95));
    pointer-events: none;
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.15);
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
`;

const InfoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  z-index: 3;
  color: white;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const ProjectArtist = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectTitle = styled.h3`
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 800;
  margin: 0.5rem 0;
  text-transform: uppercase;
  line-height: 1;
`;

const HoverContent = styled.div`
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Description = styled.p`
  font-size: 0.85rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const TechnicalMeta = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.55rem;
  margin-top: 1rem;
  color: #00ff66;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <CardContainer className="project-card">
      <ImageWrapper className="project-image-wrapper">
        <ProjectImage src={project.image} alt={project.title} className="project-image" />
      </ImageWrapper>
      <InfoOverlay>
        <ProjectArtist>{project.artist} {"//"} {project.year}</ProjectArtist>
        <ProjectTitle>{project.title}</ProjectTitle>
        <HoverContent className="hover-content">
          <Description>{project.description}</Description>
          <TechnicalMeta>
            <span>[TYPE: {project.type}]</span>
            <span>[STATUS: DELIVERED]</span>
          </TechnicalMeta>
        </HoverContent>
      </InfoOverlay>
    </CardContainer>
  );
};

const ProjectCarousel: React.FC<{ id: string }> = ({ id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Reveal project cards on scroll
      const cards = gsap.utils.toArray('.project-card') as HTMLElement[];
      cards.forEach((card) => {
        gsap.fromTo(card,
          { y: 50, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Pin the title column on desktop
      const mm = gsap.matchMedia();
      mm.add("(min-width: 769px)", () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 15%", // Pin 15% from top of viewport
          end: "bottom 85%", // Unpin 15% from bottom of viewport
          pin: titleRef.current,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionContainer id={id} ref={containerRef} className="pin-section">
      <ContentWrapper>
        <TitleColumn ref={titleRef}>
          <TechnicalLabel>CLIENT_HISTORY // ARCHIVE</TechnicalLabel>
          <SectionTitle>SELECTED<br/>PROJECTS.</SectionTitle>
        </TitleColumn>
        <ProjectsColumn>
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </ProjectsColumn>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default ProjectCarousel;
