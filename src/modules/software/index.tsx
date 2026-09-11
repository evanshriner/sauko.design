import { type KeyboardEvent, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { softwareProjects } from './data';
import {
  ControlButton,
  LabHeader,
  Page,
  ProjectShutter,
  ScreenReaderText,
  ShutterIdentity,
  ShutterImage,
  ShutterIndex,
  ShutterMeta,
  ShutterName,
  ShutterSelect,
  ShutterStage,
  ShutterStatus,
  StageControls,
  VisitLink,
  Workbench,
} from './styles';

function ArrowIcon({
  direction = 'out',
}: {
  direction?: 'left' | 'right' | 'out';
}) {
  if (direction === 'left') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M16 10H4m5-5-5 5 5 5" />
      </svg>
    );
  }

  if (direction === 'right') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4 10h12m-5-5 5 5-5 5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6 14 14 6M8 6h6v6" />
    </svg>
  );
}

export default function Software() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const activeProject = softwareProjects[activeIndex];

  const moveSelection = (step: number) => {
    setActiveIndex(
      (current) =>
        (current + step + softwareProjects.length) % softwareProjects.length,
    );
  };

  const handleShutterKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    let nextIndex: number | undefined;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex =
        (activeIndex - 1 + softwareProjects.length) % softwareProjects.length;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (activeIndex + 1) % softwareProjects.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = softwareProjects.length - 1;
    }

    if (nextIndex === undefined) return;

    event.preventDefault();
    const stage = event.currentTarget;
    setActiveIndex(nextIndex);
    requestAnimationFrame(() => {
      stage
        .querySelectorAll<HTMLButtonElement>('[data-shutter-select]')
        [nextIndex]?.focus();
    });
  };

  return (
    <Page id="software-lab" aria-labelledby="software-lab-title">
      <Workbench aria-describedby="software-lab-instructions">
        <LabHeader>
          <h1 id="software-lab-title">software lab</h1>
          <p>Independent products and selected web design.</p>
          <StageControls>
            <ControlButton
              type="button"
              onClick={() => moveSelection(-1)}
              aria-label="Show previous project"
            >
              <ArrowIcon direction="left" />
            </ControlButton>
            <span aria-hidden="true">
              {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(softwareProjects.length).padStart(2, '0')}
            </span>
            <ControlButton
              type="button"
              onClick={() => moveSelection(1)}
              aria-label="Show next project"
            >
              <ArrowIcon direction="right" />
            </ControlButton>
          </StageControls>
        </LabHeader>

        <ScreenReaderText id="software-lab-instructions">
          Choose a project to open its viewport. Use the arrow keys or the
          previous and next controls to move between projects, then use the
          visit link to open the live website in a new tab.
        </ScreenReaderText>
        <ScreenReaderText aria-live="polite" aria-atomic="true">
          {activeProject.name} selected. {activeProject.category}:{' '}
          {activeProject.descriptor}.
        </ScreenReaderText>

        <ShutterStage
          aria-label="Software Lab projects"
          onKeyDown={handleShutterKeyDown}
        >
          {softwareProjects.map((project, index) => {
            const isActive = activeIndex === index;
            const projectNumber = String(index + 1).padStart(2, '0');

            return (
              <ProjectShutter
                key={project.id}
                data-project={project.id}
                data-active={isActive ? 'true' : 'false'}
                $active={isActive}
                initial={false}
                animate={{ flexGrow: isActive ? 6.2 : 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.52,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <ShutterSelect
                  type="button"
                  data-shutter-select
                  $active={isActive}
                  aria-pressed={isActive}
                  aria-label={`Show ${project.name} project`}
                  onClick={() => setActiveIndex(index)}
                >
                  <ShutterImage
                    src={project.image}
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                    decoding="async"
                    $active={isActive}
                    $position={project.imagePosition}
                  />
                  <ShutterIndex aria-hidden="true" $active={isActive}>
                    {projectNumber}
                  </ShutterIndex>
                  <ShutterIdentity $active={isActive}>
                    <ShutterName $active={isActive}>{project.name}</ShutterName>
                    <ShutterMeta $active={isActive}>
                      {project.category} · {project.descriptor}
                    </ShutterMeta>
                  </ShutterIdentity>
                </ShutterSelect>

                {isActive && (
                  <>
                    <ShutterStatus aria-hidden="true">
                      {projectNumber} /{' '}
                      {String(softwareProjects.length).padStart(2, '0')} · live
                      view
                    </ShutterStatus>
                    <VisitLink
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Visit ${project.name} (opens in a new tab)`}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 5 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: prefersReducedMotion ? 0 : 0.18,
                        duration: prefersReducedMotion ? 0 : 0.24,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      Visit site
                      <ArrowIcon />
                    </VisitLink>
                  </>
                )}
              </ProjectShutter>
            );
          })}
        </ShutterStage>
      </Workbench>
    </Page>
  );
}
