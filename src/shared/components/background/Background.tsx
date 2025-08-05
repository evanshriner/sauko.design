import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { EffectComposer, Sepia, Vignette } from '@react-three/postprocessing';
import { Vector3 } from 'three';

import Shapes from './Shapes';
import { DisplayedObject, objectConfigurations } from './ShapeConfig';
import { Pages } from '@/shared/interfaces/pages';
import { BlendFunction } from 'postprocessing';
import CustomDotScreen from './shaders/CustomDotScreen';
import { cameraConfigurations } from './CameraConfig';

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
  currentPage,
  currentSelectableSubPage,
  onObjectClick,
  onObjectHover,
}: {
  currentPage: Pages;
  currentSelectableSubPage?: Pages; // this is the subpage that is currently displayed at the menu 'home'
  onObjectClick: (page: Pages) => void;
  onObjectHover: (isHovering: boolean) => void;
}) {
  return (
    <Canvas
      camera={{
        fov: 70,
        near: 0.01,
        far: 100,
      }}
    >
      <CameraControl currentPage={currentPage} />
      {/* <Perf position="top-left" /> */}

      {/* <OrbitControls makeDefault /> */}

      <group>
        <Shapes
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
      <EffectComposer>
        <CustomDotScreen />
        <Sepia
          intensity={0.1} // sepia intensity
          blendFunction={BlendFunction.NORMAL} // blend mode
        />
        <Vignette
          offset={0.6} // vignette offset
          darkness={0.4} // vignette darkness
          eskil={false} // Eskil's vignette technique
          blendFunction={BlendFunction.NORMAL} // blend mode
        />
      </EffectComposer>
    </Canvas>
  );
}
