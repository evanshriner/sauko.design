import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, Preload } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';

import {
  fragmentShader as wavesFragment,
  vertexShader as wavesVertex,
} from './shaders/BackgroundWaves'; // Adjust path if needed
import {
  fragmentShader as reflectiveFragment,
  vertexShader as reflectiveVertex,
} from './shaders/FresnelReflection'; // Adjust path if needed

import {
  DisplayedObject,
  ObjectConfig,
  objectConfigurations,
} from './ShapeConfig'; // Adjust path if needed
import { useMediaPlayerContext } from '@/shared/context/MediaPlayerContext';
import { useResponsiveScale } from '@/shared/hooks/useResponsiveScale';

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  format: THREE.RGBAFormat,
  generateMipmaps: false,
  // minFilter: THREE.LinearMipmapLinearFilter,
  minFilter: THREE.LinearFilter, // Use LinearFilter for better performance
  colorSpace: THREE.SRGBColorSpace,
});

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

interface ShapesSwitcherProps {
  selectedObjectKey: DisplayedObject;
}

const X_OFFSET_SPACING = 5.5;

// Component to render a single model instance
// eslint-disable-next-line react/display-name
const ModelInstance = React.forwardRef<
  THREE.Group,
  {
    config: ObjectConfig;
    gltf: GLTF;
    reflectiveMaterial: THREE.ShaderMaterial | null;
  }
>(({ config, gltf, reflectiveMaterial }, ref) => {
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
      ref={ref} // Attach the ref here
      object={modelScene}
      scale={responsiveScale} // Pass scale declaratively
    />
  );
});

export default function Shapes({
  selectedObjectKey = DisplayedObject.Boombox,
}: ShapesSwitcherProps) {
  const { amplitude } = useMediaPlayerContext();
  const outerSphereRef = useRef<THREE.ShaderMaterial>(null);
  const modelRefs = useRef(
    objectConfigurations.map(() => React.createRef<THREE.Group>()),
  );

  const gltfPaths = objectConfigurations.map((config) => config.gltfPath);
  const gltfs = useGLTF(gltfPaths) as GLTF[];

  const gltfMap = useMemo(() => {
    const map: Record<string, GLTF> = {};
    objectConfigurations.forEach((config, index) => {
      map[config.id] = gltfs[index];
    });
    return map;
  }, [gltfs]);

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
      const initialPos = config.basePosition.clone();
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

      const basePos = config.basePosition.clone();

      // Update the entire target position vector
      state.targetPos.copy(basePos);
      state.targetPos.x = carouselOffsetX;
    });
  }, [selectedObjectKey]);

  // This effect sets the initial position for each model to prevent a flicker
  // from [0,0,0] on the first frame.
  useEffect(() => {
    modelRefs.current.forEach((ref, index) => {
      if (ref.current) {
        ref.current.position.copy(animationStates.current[index].currentPos);
      }
    });
  }, []);

  useEffect(() => {
    console.log(modelRefs.current);
  }, [modelRefs.current]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (outerSphereRef.current) {
      outerSphereRef.current.uniforms.time.value += delta * 0.2;
      outerSphereRef.current.uniforms.uAmplitude.value = amplitude;
    }

    const { gl, scene, camera } = state; // Get gl, scene, camera from state

    ///////////// camera adjustments /////////////

    const radius = 1.3; // Distance from center
    const speed = 0.06; // Radians per second
    const t = time * speed;

    camera.position.x = Math.cos(t) * radius;
    camera.position.z = Math.sin(t) * radius;
    camera.position.y = 0.3; // Keep your scroll effect if needed

    camera.lookAt(0, 0.3, 0); // Always look at the center

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
    reflectiveMeshesInScene.forEach((mesh) => (mesh.visible = false));
    cubeCamera.update(gl, scene);
    reflectiveMeshesInScene.forEach((mesh) => (mesh.visible = true));

    // Handle model transitions and animations
    // if (transitionState.isTransitioning) {
    //   const newProgress = Math.min(transitionState.progress + delta / ANIMATION_DURATION, 1);
    //   setTransitionState((prev) => ({ ...prev, progress: newProgress }));

    //   if (newProgress >= 1) {
    //     setTransitionState((prev) => ({
    //       ...prev,
    //       isTransitioning: false,
    //       previousKey: undefined, // Clear previous key once transition is complete
    //     }));
    //   }
    // }

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

    objectConfigurations.forEach((key, idx) => {
      // Get the ref to the root group of the model
      const groupRef = modelRefs.current[idx]?.current;

      // If the ref isn't available yet, skip
      if (!groupRef) return;

      // Apply animations directly to the entire group object
      key.rotationAnimation(groupRef, time);
      key.floatAnimation(groupRef, time);
    });

    // // Orbit parameters
    // const radius = 1.3; // Distance from center
    // const speed = 0.06; // Radians per second
    // const t = time * speed;

    // camera.position.x = Math.cos(t) * radius;
    // camera.position.z = Math.sin(t) * radius;
    // camera.position.y = 0.3; // Keep your scroll effect if needed

    // camera.lookAt(0, 0.3, 0); // Always look at the center

    // if (reflectiveShapeRef.current) {
    //   // Temporarily hide all objects that use the reflective material before updating the cube camera
    //   // to prevent a visual feedback loop.
    //   const meshesToHide: THREE.Mesh[] = [];
    //   if (
    //     boomboxMeshRef.current &&
    //     boomboxMeshRef.current.material === reflectiveShapeRef.current
    //   ) {
    //     meshesToHide.push(boomboxMeshRef.current);
    //   }
    //   if (
    //     laptopMeshRef.current &&
    //     laptopMeshRef.current.material === reflectiveShapeRef.current
    //   ) {
    //     meshesToHide.push(laptopMeshRef.current);
    //   }

    //   meshesToHide.forEach((mesh) => (mesh.visible = false));

    //   cubeCamera.update(gl, scene);

    //   meshesToHide.forEach((mesh) => (mesh.visible = true));
    //   reflectiveShapeRef.current.uniforms.tCube.value =
    //     cubeRenderTarget.texture;
    // }
    // const orbitCenter = new THREE.Vector3(0, 0, 0); // --- Boombox Animation: Orbit, Rotation, Floating ---

    // const orbitRadius = 1;

    // if (boomboxMeshRef.current) {
    //   boomboxMeshRef.current.position.y =
    //     orbitCenter.y + Math.sin(time * 0.7) * 0.02; // Rotation

    //   boomboxMeshRef.current.rotation.y = -t - (4.73 + Math.sin(time * 2) * 0.01); // 4.73 is the initial rotation offset
    //   // boomboxMeshRef.current.position.z = Math.sin(t) * radius;
    // }

    // if (laptopMeshRef.current) {
    //   laptopMeshRef.current.position.y =
    //     orbitCenter.y + Math.sin(time * 0.6 + Math.PI / 2) * 0.12; // Rotation
    // }
  });

  return (
    <>
      {/* render background / surrounding sphere */}
      <mesh geometry={sphereGeometry}>
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
        const gltf = gltfMap[config.id];
        if (!gltf) {
          console.warn(`GLTF data not found for ${config.id}`);
          return null;
        }
        // The object's visibility is controlled within the useFrame loop now
        return (
          <ModelInstance
            key={config.id}
            ref={modelRefs.current[index]}
            config={config}
            gltf={gltf}
            reflectiveMaterial={reflectiveMaterial}
          />
        );
      })}

      {/* Render previous model during transition */}
      <Preload all />
    </>
  );
}
