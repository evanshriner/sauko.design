import { useLayoutEffect, useRef } from 'react';
import styled from '@emotion/styled';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type WaveTone = 'ghost' | 'quiet' | 'soft' | 'clear' | 'signal';

type WaveDefinition = {
  d: string;
  tone: WaveTone;
  duration: number;
  scaleY: number;
  rotation: number;
};

const DESKTOP_PIVOT = '1536 450';
const MOBILE_PIVOT = '568 450';

const DESKTOP_WAVES = [
  {
    d: 'M-240 58C34 4 126 654 432 708C684 752 642 76 904 126C1110 166 1152 358 1324 414C1412 442 1474 449 1496 450H1536',
    tone: 'ghost',
    duration: 7.8,
    scaleY: 1.08,
    rotation: -0.1,
  },
  {
    d: 'M-240 184C-12 64 164 724 452 670C684 626 674 112 900 174C1088 226 1164 350 1310 405C1396 437 1466 449 1496 450H1536',
    tone: 'quiet',
    duration: 6.4,
    scaleY: 0.93,
    rotation: 0.16,
  },
  {
    d: 'M-240 336C18 488 132 34 404 102C642 162 620 782 914 748C1122 724 1142 526 1318 478C1404 455 1468 451 1496 450H1536',
    tone: 'soft',
    duration: 5.2,
    scaleY: 1.07,
    rotation: -0.2,
  },
  {
    d: 'M-240 790C46 872 98 154 398 174C650 190 686 698 930 654C1120 620 1170 500 1320 470C1402 454 1468 450 1496 450H1536',
    tone: 'signal',
    duration: 7.1,
    scaleY: 0.91,
    rotation: 0.12,
  },
  {
    d: 'M-240 522C20 730 174 826 426 746C652 674 650 274 886 246C1088 222 1162 354 1312 410C1398 442 1466 450 1496 450H1536',
    tone: 'clear',
    duration: 5.8,
    scaleY: 1.06,
    rotation: 0.2,
  },
  {
    d: 'M-240 886C4 776 150 286 420 340C650 386 684 816 918 776C1116 742 1156 548 1316 488C1402 456 1468 451 1496 450H1536',
    tone: 'quiet',
    duration: 4.7,
    scaleY: 0.94,
    rotation: -0.16,
  },
  {
    d: 'M-240 104C24 244 152 606 410 618C650 630 704 176 932 216C1118 248 1170 372 1322 418C1406 443 1470 449 1496 450H1536',
    tone: 'signal',
    duration: 7.5,
    scaleY: 1.09,
    rotation: -0.12,
  },
  {
    d: 'M-240 930C-6 876 110 26 392 54C650 80 700 728 942 716C1122 706 1162 520 1320 480C1404 458 1468 451 1496 450H1536',
    tone: 'ghost',
    duration: 6.8,
    scaleY: 0.9,
    rotation: 0.08,
  },
  {
    d: 'M-240 430C14 238 152 82 416 138C650 188 670 760 914 704C1106 660 1160 514 1314 474C1398 453 1468 450 1496 450H1536',
    tone: 'soft',
    duration: 5.5,
    scaleY: 1.05,
    rotation: 0.18,
  },
] as const satisfies readonly WaveDefinition[];

const MOBILE_WAVES = [
  {
    d: 'M-132 42C24 2 72 766 272 716C404 682 398 326 480 390C524 424 542 449 552 450H568',
    tone: 'ghost',
    duration: 7.4,
    scaleY: 1.08,
    rotation: -0.12,
  },
  {
    d: 'M-132 206C14 42 92 626 258 660C392 688 398 278 486 376C526 420 544 448 552 450H568',
    tone: 'clear',
    duration: 5.6,
    scaleY: 0.92,
    rotation: 0.16,
  },
  {
    d: 'M-132 754C28 872 82 112 254 164C392 206 388 612 484 520C526 480 544 452 552 450H568',
    tone: 'signal',
    duration: 6.8,
    scaleY: 1.07,
    rotation: -0.16,
  },
  {
    d: 'M-132 448C20 642 94 814 266 746C400 692 402 334 486 402C526 434 544 449 552 450H568',
    tone: 'quiet',
    duration: 4.8,
    scaleY: 0.93,
    rotation: 0.12,
  },
  {
    d: 'M-132 906C10 796 90 286 260 326C398 358 394 742 486 554C526 494 544 454 552 450H568',
    tone: 'soft',
    duration: 7.9,
    scaleY: 1.06,
    rotation: 0.1,
  },
] as const satisfies readonly WaveDefinition[];

const WaveField = styled.div`
  --wave-ghost-opacity: 0.035;
  --wave-quiet-opacity: 0.09;
  --wave-soft-opacity: 0.14;
  --wave-clear-opacity: 0.19;
  --wave-signal-opacity: 0.22;

  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  .wave-svg {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .wave-mobile {
    display: none;
  }

  .wave {
    fill: none;
    stroke: var(--audio-ivory);
    stroke-width: 1.15;
    stroke-linecap: round;
    stroke-linejoin: round;
    shape-rendering: geometricPrecision;
  }

  .wave--ghost {
    opacity: var(--wave-ghost-opacity);
    stroke-width: 6;
  }

  .wave--quiet {
    opacity: var(--wave-quiet-opacity);
  }

  .wave--soft {
    opacity: var(--wave-soft-opacity);
  }

  .wave--clear {
    opacity: var(--wave-clear-opacity);
  }

  .wave--signal {
    opacity: var(--wave-signal-opacity);
    stroke: var(--audio-sepia-soft);
    stroke-width: 1.35;
  }

  @media (max-width: 40rem) {
    .wave-desktop {
      display: none;
    }

    .wave-mobile {
      display: block;
    }

    .wave {
      stroke-width: 1.05;
    }

    .wave--ghost {
      stroke-width: 5;
    }

    .wave--signal {
      stroke-width: 1.25;
    }
  }
`;

function startWaveMotion(
  field: HTMLDivElement,
  selector: string,
  definitions: readonly WaveDefinition[],
  pivot: string,
) {
  const paths = gsap.utils.toArray<SVGPathElement>(selector, field);
  const tweens = paths.map((path, index) => {
    const wave = definitions[index];

    return gsap.to(path, {
      scaleY: wave.scaleY,
      rotation: wave.rotation,
      svgOrigin: pivot,
      duration: wave.duration,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      paused: true,
    });
  });

  let sectionIsVisible = false;
  const syncPlayback = () => {
    const shouldPlay = sectionIsVisible && !document.hidden;
    tweens.forEach((tween) => {
      if (shouldPlay) tween.resume();
      else tween.pause();
    });
  };

  const visibilityTrigger = ScrollTrigger.create({
    trigger: field,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: ({ isActive }) => {
      sectionIsVisible = isActive;
      syncPlayback();
    },
  });

  sectionIsVisible = visibilityTrigger.isActive;
  document.addEventListener('visibilitychange', syncPlayback);
  syncPlayback();

  return () => {
    document.removeEventListener('visibilitychange', syncPlayback);
    visibilityTrigger.kill();
    tweens.forEach((tween) => tween.kill());
    gsap.set(paths, { clearProps: 'transform,transformOrigin' });
  };
}

export default function MasteringTranslationWaves() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const field = fieldRef.current;
    if (!field) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          mobile: '(max-width: 40rem)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (mediaContext) => {
          const conditions = mediaContext.conditions as {
            mobile: boolean;
            motion: boolean;
          };

          if (!conditions.motion) return;

          return conditions.mobile
            ? startWaveMotion(field, '.wave-mobile .wave', MOBILE_WAVES, MOBILE_PIVOT)
            : startWaveMotion(
                field,
                '.wave-desktop .wave',
                DESKTOP_WAVES,
                DESKTOP_PIVOT,
              );
        },
      );
    }, field);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <WaveField ref={fieldRef} aria-hidden="true">
      <svg
        className="wave-svg wave-desktop"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {DESKTOP_WAVES.map((wave, index) => (
          <path
            key={index}
            className={`wave wave--${wave.tone}`}
            d={wave.d}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <svg
        className="wave-svg wave-mobile"
        viewBox="0 0 600 900"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {MOBILE_WAVES.map((wave, index) => (
          <path
            key={index}
            className={`wave wave--${wave.tone}`}
            d={wave.d}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </WaveField>
  );
}
