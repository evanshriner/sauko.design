import { Canvas } from '@react-three/fiber';
import { EffectComposer, Sepia, Vignette } from '@react-three/postprocessing';

import Shapes from './Shapes';
import { DisplayedObject, objectConfigurations } from './ShapeConfig';
import { Pages } from '@/shared/interfaces/pages';
import { BlendFunction } from 'postprocessing';
import CustomDotScreen from './shaders/CustomDotScreen';

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
        // position is being interpolated in the Shapes component
        position: [0, 0, 0],
      }}
    >
      {/* <Perf position="top-left" /> */}
      {/*

      <OrbitControls makeDefault /> */}

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
