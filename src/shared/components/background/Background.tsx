import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Sepia, Vignette } from '@react-three/postprocessing';
import { Vector3 } from 'three';

import Shapes from './Shapes';
import { DisplayedObject, objectConfigurations } from './ShapeConfig';
import { Pages } from '@/shared/interfaces/pages';
import { BlendFunction } from 'postprocessing';
import CustomDotScreen from './shaders/CustomDotScreen';

// Define target positions
const mainPageCameraPosition = new Vector3(0, 0.3, 1.3);
const subPageCameraPosition = new Vector3(0, -1, 1.3); // Lowered position

function CameraControl({ currentPage }: { currentPage?: Pages }) {
  const { camera } = useThree();

  useFrame(() => {
    const targetPosition =
      currentPage === Pages.Home || currentPage === undefined
        ? mainPageCameraPosition
        : subPageCameraPosition;

    // Smoothly interpolate the camera's position
    camera.position.lerp(targetPosition, 0.1); // Adjust the lerp factor (0.1) for speed
    camera.lookAt(0, camera.position.y, 0); // Keep looking at the center, but adjust for y change
  });

  return null;
}

export default function Background({
  currentPage,
  onObjectClick,
  onObjectHover,
}: {
  currentPage?: Pages;
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
            objectConfigurations.find((config) => config.page === currentPage)
              ?.id || DisplayedObject.Boombox
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
