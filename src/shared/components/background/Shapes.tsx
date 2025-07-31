import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, Preload } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';

import {
  fragmentShader as wavesFragment,
  vertexShader as wavesVertex,
} from './shaders/BackgroundWaves';
import {
  fragmentShader as reflectiveFragment,
  vertexShader as reflectiveVertex,
} from './shaders/FresnelReflection';

import {
  DisplayedObject,
  objectConfigurations,
  ObjectModelConfig,
} from './ShapeConfig';
import { useMediaPlayerContext } from '@/shared/context/MediaPlayerContext';
import { useResponsiveScale } from '@/shared/hooks/useResponsiveScale';

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  format: THREE.RGBAFormat,
  generateMipmaps: false,
  minFilter: THREE.LinearFilter,
  colorSpace: THREE.SRGBColorSpace,
});

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

interface ShapesSwitcherProps {
  selectedObjectKey: DisplayedObject;
  onObjectClick?: (objectId: DisplayedObject) => void;
  onObjectHover?: (objectId: DisplayedObject | null) => void;
}

const X_OFFSET_SPACING = 5.5;

// Component to render a single model instance
// eslint-disable-next-line react/display-name
const ModelInstance = React.forwardRef<
  THREE.Group,
  {
    config: ObjectModelConfig;
    gltf: GLTF;
    reflectiveMaterial: THREE.ShaderMaterial | null;
    onClick?: (event: ThreeEvent<MouseEvent>) => void;
    onPointerOver?: (event: ThreeEvent<MouseEvent>) => void;
    onPointerOut?: (event: ThreeEvent<MouseEvent>) => void;
  }
>(
  (
    { config, gltf, reflectiveMaterial, onClick, onPointerOver, onPointerOut },
    ref,
  ) => {
    const responsiveScale = useResponsiveScale(
      config.responsiveScale,
      config.scale,
    );

    const modelScene = useMemo(() => {
      const clonedScene = gltf.scene.clone();
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (!child.geometry.attributes.normal) {
            // this needs to be done for some models that
            // done have pre-calculated normals.
            child.geometry.computeVertexNormals();
          }

          if (reflectiveMaterial) {
            child.material = reflectiveMaterial;
          }
        }
      });
      return clonedScene;
    }, [gltf, reflectiveMaterial]);

    return (
      <primitive
        ref={ref}
        object={modelScene}
        scale={responsiveScale}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        onPointerOver={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onPointerOver?.(e);
        }}
        onPointerOut={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onPointerOut?.(e);
        }}
      />
    );
  },
);

export default function Shapes({
  selectedObjectKey = DisplayedObject.Boombox,
  onObjectClick,
  onObjectHover,
}: ShapesSwitcherProps) {
  const { amplitude } = useMediaPlayerContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 558);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 558);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const outerSphereRef = useRef<THREE.ShaderMaterial>(null);
  const outerSphereMeshRef = useRef<THREE.Mesh>(null);
  const modelRefs = useRef(
    objectConfigurations.map(() => React.createRef<THREE.Group>()),
  );

  const gltfPaths = useMemo(() => {
    const paths = new Set<string>();
    objectConfigurations.forEach((config) => {
      paths.add(config.models.desktop.gltfPath);
      if (config.models.mobile) {
        paths.add(config.models.mobile.gltfPath);
      }
    });
    return Array.from(paths);
  }, []);

  const gltfs = useGLTF(gltfPaths) as GLTF[];

  const gltfMap = useMemo(() => {
    const map: Record<string, GLTF> = {};
    gltfs.forEach((gltf, index) => {
      // This mapping assumes the order of gltfPaths matches the order of gltfs.
      // It's better to map by path.
      const path = gltfPaths[index];
      map[path] = gltf;
    });
    return map;
  }, [gltfs, gltfPaths]);

  useEffect(() => {
    console.log('gltf map:', gltfMap);
  }, [gltfMap]);

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(4, 32, 32), []);

  // This ref will hold the animation state for each object
  const animationStates = useRef(
    objectConfigurations.map((config, index) => {
      const initialSelectedIndex = objectConfigurations.findIndex(
        (c) => c.id === selectedObjectKey,
      );
      const carouselOffsetX = (index - initialSelectedIndex) * X_OFFSET_SPACING;

      // Use the object's basePosition from the config as the starting point
      const modelConfig = config.models.mobile ?? config.models.desktop;
      const initialPos = modelConfig.basePosition.clone();
      initialPos.x += carouselOffsetX;

      return {
        id: config.id,
        // Store the full Vector3 for current and target positions
        currentPos: initialPos,
        targetPos: initialPos.clone(),
      };
    }),
  );

  // Memoized shader uniforms and materials
  const outerUniforms = useMemo(
    () => ({
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uAmplitude: { value: 0.0 },
    }),
    [],
  );

  const reflectiveUniforms = useMemo(
    () => ({
      time: { value: 0 },
      tCube: { value: cubeRenderTarget.texture },
      resolution: { value: new THREE.Vector4() },
      // Add any other uniforms your FresnelReflection shader needs
    }),
    [],
  );

  const reflectiveMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: reflectiveUniforms,
        vertexShader: reflectiveVertex,
        fragmentShader: reflectiveFragment,
      }),
    [reflectiveUniforms], // Vertex/Fragment shaders are static strings
  );

  useEffect(() => {
    const newSelectedIndex = objectConfigurations.findIndex(
      (c) => c.id === selectedObjectKey,
    );

    animationStates.current.forEach((state, index) => {
      const config = objectConfigurations[index];
      const carouselOffsetX = (index - newSelectedIndex) * X_OFFSET_SPACING;

      const modelConfig =
        isMobile && config.models.mobile
          ? config.models.mobile
          : config.models.desktop;
      const basePos = modelConfig.basePosition.clone();

      // Update the entire target position vector
      state.targetPos.copy(basePos);
      state.targetPos.x = carouselOffsetX;
    });
  }, [selectedObjectKey, isMobile]);

  // This effect sets the initial position for each model to prevent a flicker
  // from [0,0,0] on the first frame.
  useEffect(() => {
    modelRefs.current.forEach((ref, index) => {
      if (ref.current) {
        const config = objectConfigurations[index];
        const modelConfig =
          isMobile && config.models.mobile
            ? config.models.mobile
            : config.models.desktop;

        ref.current.position.copy(animationStates.current[index].currentPos);

        if (modelConfig.initialRotationOffset) {
          ref.current.rotation.y = modelConfig.initialRotationOffset;
        }
      }
    });
  }, [isMobile]);

  useEffect(() => {
    console.log(modelRefs.current);
  }, [modelRefs.current]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    // controls the speed of the wave animation
    if (outerSphereRef.current) {
      outerSphereRef.current.uniforms.time.value += delta * 0.2;
      outerSphereRef.current.uniforms.uAmplitude.value = amplitude;
    }

    const { gl, scene, camera } = state; // Get gl, scene, camera from state

    ///////////// camera adjustments /////////////

    // Set a fixed position for the camera
    camera.position.set(0, 0.3, 1.3);
    camera.lookAt(0, 0.3, 0); // Always look at the center

    // Rotate the outer sphere
    if (outerSphereMeshRef.current) {
      const speed = 0.03;
      outerSphereMeshRef.current.rotation.y = -time * speed;
    }

    ///////////// ensure reflections on shapes are updated /////////////
    const reflectiveMeshesInScene: THREE.Mesh[] = [];
    scene.traverse((object) => {
      if (
        object instanceof THREE.Mesh &&
        object.material === reflectiveMaterial &&
        object.visible // Only consider visible meshes for reflection
      ) {
        reflectiveMeshesInScene.push(object);
      }
    });

    // Hide the objects that will receive the reflection
    reflectiveMeshesInScene.forEach((mesh) => (mesh.visible = false));

    // To capture a static reflection, we temporarily reset the sphere's rotation,
    // render the reflection, and then restore the rotation.
    const sphere = outerSphereMeshRef.current;
    if (sphere) {
      const originalRotationY = sphere.rotation.y;
      sphere.rotation.y = 0; // Reset rotation for capture
      cubeCamera.update(gl, scene);
      sphere.rotation.y = originalRotationY; // Restore rotation
    } else {
      cubeCamera.update(gl, scene);
    }

    // Restore visibility for the main render
    reflectiveMeshesInScene.forEach((mesh) => (mesh.visible = true));

    // Animate objects
    animationStates.current.forEach((animState, idx) => {
      const groupRef = modelRefs.current[idx];
      if (groupRef?.current) {
        // Animate the x position using an easing function
        groupRef.current.position.x = THREE.MathUtils.damp(
          groupRef.current.position.x,
          animState.targetPos.x,
          6,
          delta,
        );
        groupRef.current.position.y = THREE.MathUtils.damp(
          groupRef.current.position.y,
          animState.targetPos.y,
          6,
          delta,
        );
        groupRef.current.position.z = THREE.MathUtils.damp(
          groupRef.current.position.z,
          animState.targetPos.z,
          6,
          delta,
        );

        // Keep our state in sync with the current position for the next frame
        animState.currentPos.copy(groupRef.current.position);
      }
    });

    objectConfigurations.forEach((config, idx) => {
      const groupRef = modelRefs.current[idx]?.current;
      if (!groupRef) return;

      const modelConfig =
        isMobile && config.models.mobile
          ? config.models.mobile
          : config.models.desktop;

      // Apply animations directly to the entire group object
      // modelConfig.rotationAnimation(groupRef, time);
      modelConfig.floatAnimation(groupRef, time);
    });
  });

  return (
    <>
      {/* render background / surrounding sphere */}
      <mesh ref={outerSphereMeshRef} geometry={sphereGeometry}>
        <shaderMaterial
          ref={outerSphereRef}
          side={THREE.BackSide}
          uniforms={outerUniforms}
          vertexShader={wavesVertex}
          fragmentShader={wavesFragment}
        />
      </mesh>

      {/* Render current model */}
      {objectConfigurations.map((config, index) => {
        const modelConfig =
          isMobile && config.models.mobile
            ? config.models.mobile
            : config.models.desktop;

        const gltf = gltfMap[modelConfig.gltfPath];
        if (!gltf) {
          console.warn(`GLTF data not found for ${modelConfig.gltfPath}`);
          return null;
        }
        return (
          <ModelInstance
            key={config.id}
            ref={modelRefs.current[index]}
            config={modelConfig}
            gltf={gltf}
            reflectiveMaterial={reflectiveMaterial}
            onClick={() => onObjectClick?.(config.id)}
            onPointerOver={() => onObjectHover?.(config.id)}
            onPointerOut={() => onObjectHover?.(null)}
          />
        );
      })}

      {/* Render previous model during transition */}
      <Preload all />
    </>
  );
}
