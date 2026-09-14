import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { EffectComposer, Sepia, Vignette } from '@react-three/postprocessing';
import { Vector3 } from 'three';

import Shapes from './Shapes';
import { DisplayedObject, objectConfigurations } from './ShapeConfig';
import { Pages } from '@/shared/interfaces/pages';
import {
  BlendFunction,
  type EffectComposer as EffectComposerImpl,
} from 'postprocessing';
import CustomDotScreen from './shaders/CustomDotScreen';
import { cameraConfigurations } from './CameraConfig';
import { useSceneQuality } from '@/shared/hooks/useSceneQuality';

const WEBGL_PARAMETERS = { antialias: false } as const;
const FRAME_INTERVAL_TOLERANCE_MS = 1;

function SceneFrameScheduler({
  active,
  frameRate,
}: {
  active: boolean;
  frameRate: number;
}) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
    if (!active) return undefined;

    const frameInterval = 1000 / frameRate;
    let animationFrameId = 0;
    let previousFrameTime = 0;

    const scheduleFrame = (timestamp: number) => {
      if (
        document.visibilityState === 'visible' &&
        (previousFrameTime === 0 ||
          timestamp - previousFrameTime >=
            frameInterval - FRAME_INTERVAL_TOLERANCE_MS)
      ) {
        const elapsed = timestamp - previousFrameTime;
        previousFrameTime = timestamp - (elapsed % frameInterval);
        invalidate();
      }

      animationFrameId = window.requestAnimationFrame(scheduleFrame);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      previousFrameTime = 0;
      invalidate();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameId = window.requestAnimationFrame(scheduleFrame);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [active, frameRate, invalidate]);

  return null;
}

function SceneEffects({ multisampling }: { multisampling: number }) {
  const composerRef = useRef<EffectComposerImpl>(null);

  useEffect(() => {
    const composer = composerRef.current;
    return () => composer?.dispose();
  }, []);

  return (
    <EffectComposer ref={composerRef} multisampling={multisampling}>
      <CustomDotScreen />
      <Sepia intensity={0.1} blendFunction={BlendFunction.NORMAL} />
      <Vignette
        offset={0.6}
        darkness={0.4}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

function CameraControl({ currentPage }: { currentPage: Pages }) {
  const { camera } = useThree();
  // used to lerp between menu and subpage camera positions
  const currentLookAt = useRef(new Vector3(0, 0, 0));

  useFrame(() => {
    const config = cameraConfigurations.find((c) => c.page === currentPage);

    if (config) {
      camera.position.lerp(config.position, 0.05);
      currentLookAt.current.lerp(config.lookAt, 0.05);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}

export default function Background({
  active,
  currentPage,
  currentSelectableSubPage,
  onObjectClick,
  onObjectHover,
}: {
  active: boolean;
  currentPage: Pages;
  currentSelectableSubPage?: Pages; // this is the subpage that is currently displayed at the menu 'home'
  onObjectClick: (page: Pages) => void;
  onObjectHover: (isHovering: boolean) => void;
}) {
  const quality = useSceneQuality();

  return (
    <Canvas
      frameloop="demand"
      dpr={quality.dpr}
      gl={WEBGL_PARAMETERS}
      data-scene-quality={quality.tier}
      data-scene-multisampling={quality.multisampling}
      data-scene-frame-rate={quality.frameRate}
      data-scene-reflection-resolution={quality.reflectionResolution}
      data-scene-reflection-refresh-rate={quality.reflectionRefreshRate}
      camera={{
        fov: 70,
        near: 0.01,
        far: 100,
      }}
    >
      <SceneFrameScheduler active={active} frameRate={quality.frameRate} />
      <CameraControl currentPage={currentPage} />
      {/* <Perf position="top-left" /> */}

      {/* <OrbitControls makeDefault /> */}

      <group>
        <Shapes
          reflectionResolution={quality.reflectionResolution}
          reflectionRefreshRate={quality.reflectionRefreshRate}
          selectedObjectKey={
            objectConfigurations.find(
              (config) => config.page === currentSelectableSubPage,
            )?.id || DisplayedObject.Boombox
          }
          onObjectClick={(id) => {
            const config = objectConfigurations.find((c) => c.id === id);
            console.log('clicked object:', id, 'config:', config);
            if (config) {
              onObjectClick(config.page);
            }
          }}
          onObjectHover={(id) => {
            console.log('hovered object:', id);
            onObjectHover(id !== null);
          }}
        />
      </group>
      <SceneEffects key={quality.tier} multisampling={quality.multisampling} />
    </Canvas>
  );
}
