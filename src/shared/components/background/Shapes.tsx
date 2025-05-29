import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
  ANIMATION_DURATION,
  FLY_OUT_Y_POSITION,
  FLY_IN_Y_START_POSITION,
} from './ShapeConfig'; // Adjust path if needed

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
  scrollY?: number; // Retained if needed for other effects, e.g. camera adjustments
}

interface TransitionState {
  currentKey: DisplayedObject;
  previousKey?: DisplayedObject;
  progress: number; // 0 to 1 for transition
  isTransitioning: boolean;
}


// Component to render a single model instance
const ModelInstance = React.forwardRef<
  THREE.Group,
  {
    config: ObjectConfig;
    gltf: GLTF;
    reflectiveMaterial: THREE.ShaderMaterial | null; // Allow null if not reflective
  }
>(({ config, gltf, reflectiveMaterial }, ref) => {
  const modelScene = useMemo(() => {
    const clonedScene = gltf.scene.clone();
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Apply reflective material if configured and available
        if (config.isReflective && reflectiveMaterial) {
          child.material = reflectiveMaterial;
        } 
        // You might need more sophisticated material handling based on your GLTF structure
      }
    });
    return clonedScene;
  }, [gltf, config.isReflective, reflectiveMaterial]);

  useEffect(() => {
    const group = (ref as React.RefObject<THREE.Group>)?.current;
    if (group) {
      if (typeof config.scale === 'number') {
        group.scale.setScalar(config.scale);
      } else {
        group.scale.copy(config.scale);
      }
    }
  }, [ref, config.scale]);

  return (
    <group ref={ref} position={config.basePosition}>
      <primitive object={modelScene} />
    </group>
  );
});

export default function Shapes({ scrollY = 0, selectedObjectKey = DisplayedObject.Boombox}: ShapesSwitcherProps) {
  const outerSphereRef = useRef<THREE.ShaderMaterial>(null);
  const currentModelGroupRef = useRef<THREE.Group>(null);
  const previousModelGroupRef = useRef<THREE.Group>(null);
  const reflectiveShapeRef = useRef<THREE.ShaderMaterial | null>(null);
  const boomboxMeshRef = useRef<THREE.Mesh | null>(null);
  const laptopMeshRef = useRef<THREE.Mesh | null>(null);

  const gltfDataArray = objectConfigurations.map(config => ({
    id: config.id,
    data: useGLTF(config.gltfPath) as GLTF,
  }));

  const gltfMap = useMemo(() => {
    const map: Record<DisplayedObject, GLTF> = {} as any;
    gltfDataArray.forEach(item => {
      map[item.id] = item.data;
    });
    return map;
  }, [gltfDataArray]);


 
  // useEffect(() => {
  //   console.log('Boombox Scene:', postedLetterScene);
  //   console.log('Boombox Materials:', postedLetterMaterials);
  //   console.log('Boombox Nodes:', postedLetterNodes);
  // }, []);

  // Memoize the geometry so it's created only once
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(4, 32, 32), []);
  // const reflectiveGeometry = useMemo(
  //   () => new THREE.SphereGeometry(0.5, 42, 32),
  //   [],
  // );
  // Clone the scene if you intend to modify it or use it multiple times
  // to avoid issues with React re-rendering and Three.js object identity.
  // For just displaying, this might not be strictly necessary but is good practice.
  // const boomboxModel = useMemo(() => boomboxScene.clone(), [boomboxScene]);

  const [transitionState, setTransitionState] = useState<TransitionState>({
    currentKey: selectedObjectKey,
    progress: 1,
    isTransitioning: false,
  });

  // Memoized shader uniforms and materials
  const outerUniforms = useMemo(
    () => ({
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
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
        extensions: { derivatives: '#extension GL_OES_standard_derivatives : enable' },
        side: THREE.DoubleSide,
        uniforms: reflectiveUniforms,
        vertexShader: reflectiveVertex,
        fragmentShader: reflectiveFragment,
      }),
    [reflectiveUniforms], // Vertex/Fragment shaders are static strings
  );

  useEffect(() => {
    setTransitionState((prev) => {
      if (prev.currentKey === selectedObjectKey && !prev.isTransitioning) return prev;
      // If already transitioning to the target key, don't restart
      if (prev.isTransitioning && prev.currentKey === selectedObjectKey) return prev;

      return {
        currentKey: selectedObjectKey,
        previousKey: prev.currentKey,
        progress: 0, // Start transition
        isTransitioning: true,
      };
    });
  }, [selectedObjectKey]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (outerSphereRef.current) {
      // TODO: possibly use delta here?
      outerSphereRef.current.uniforms.time.value += 0.001;
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

    if (reflectiveMeshesInScene.length > 0) {
        // Determine the center of the reflective object for cubeCamera position
        // For simplicity, using the current active model's base position if it's reflective
        const currentConfig = objectConfigurations.find(c => c.id === transitionState.currentKey);
        if (currentConfig && currentConfig.isReflective && currentModelGroupRef.current) {
            cubeCamera.position.copy(currentModelGroupRef.current.position);
        } else {
            cubeCamera.position.set(0,0.3,0); // Default position if no specific reflective obj
        }

      reflectiveMeshesInScene.forEach((mesh) => (mesh.visible = false));
      cubeCamera.update(gl, scene);
      reflectiveMeshesInScene.forEach((mesh) => (mesh.visible = true));
      // tCube uniform is already linked via reflectiveUniforms
    }


    // Handle model transitions and animations
    if (transitionState.isTransitioning) {
      const newProgress = Math.min(transitionState.progress + delta / ANIMATION_DURATION, 1);
      setTransitionState((prev) => ({ ...prev, progress: newProgress }));

      if (newProgress >= 1) {
        setTransitionState((prev) => ({
          ...prev,
          isTransitioning: false,
          previousKey: undefined, // Clear previous key once transition is complete
        }));
      }
    }

    // Animate current and previous models (if transitioning)
    const keysToAnimate = [transitionState.currentKey, transitionState.previousKey].filter(Boolean);

    keysToAnimate.forEach((key) => {
      const isCurrent = key === transitionState.currentKey;
      const groupRef = isCurrent ? currentModelGroupRef : previousModelGroupRef;
      const config = objectConfigurations.find((c) => c.id === key);

      if (!groupRef.current || !config || !groupRef.current.children[0]) return;

      // Find the first actual mesh within the loaded GLTF scene for detailed animations
      let animatedMesh: THREE.Mesh | undefined;
      groupRef.current.children[0].traverse((child) => {
        if (child instanceof THREE.Mesh && !animatedMesh) {
          animatedMesh = child;
        }
      });
      if (!animatedMesh) return;


      let groupYPosition = config.basePosition.y;
      let applyIndividualAnimations = false;

      if (transitionState.isTransitioning) {
        if (isCurrent) { // Incoming model
          groupYPosition = config.basePosition.y + FLY_IN_Y_START_POSITION * (1 - transitionState.progress);
          groupRef.current.visible = transitionState.progress > 0.01; // Fade in
          if (transitionState.progress > 0.5) applyIndividualAnimations = true;
        } else { // Outgoing model (key === transitionState.previousKey)
          groupYPosition = config.basePosition.y + FLY_OUT_Y_POSITION * transitionState.progress;
          if (transitionState.progress > 0.99) groupRef.current.visible = false; // Fade out
          if (transitionState.progress < 0.5) applyIndividualAnimations = true;
        }
      } else if (isCurrent) { // Stable state, only current model
        groupRef.current.visible = true;
        applyIndividualAnimations = true;
      } else { // Stable state, ensure non-current are hidden
        groupRef.current.visible = false;
        return;
      }

      groupRef.current.position.set(config.basePosition.x, groupYPosition, config.basePosition.z);

      if (applyIndividualAnimations) {
        config.rotationAnimation(animatedMesh, time, config.initialRotationOffset);
        config.floatAnimation(animatedMesh, time);
      }
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

  const currentConfig = objectConfigurations.find(c => c.id === transitionState.currentKey);
  const previousConfig = transitionState.previousKey ? objectConfigurations.find(c => c.id === transitionState.previousKey) : undefined;

  return (
    <>
      {/* render background / surrounding sphere */}
      <mesh geometry={sphereGeometry}>
        <shaderMaterial
          ref={outerSphereRef}
          extensions={{ derivatives: '#extension GL_OES_standard_derivatives : enable' }}
          side={THREE.BackSide}
          uniforms={outerUniforms}
          vertexShader={wavesVertex}
          fragmentShader={wavesFragment}
        />
      </mesh>

      {/* Render current model */}
      {currentConfig && gltfMap[transitionState.currentKey] && (
        <ModelInstance
          key={transitionState.currentKey + '-current'}
          ref={currentModelGroupRef}
          config={currentConfig}
          gltf={gltfMap[transitionState.currentKey]}
          reflectiveMaterial={currentConfig.isReflective ? reflectiveMaterial : null}
        />
      )}

      {/* Render previous model during transition */}
      {transitionState.isTransitioning && previousConfig && transitionState.previousKey && gltfMap[transitionState.previousKey] && (
          <ModelInstance
            key={transitionState.previousKey + '-previous'}
            ref={previousModelGroupRef}
            config={previousConfig}
            gltf={gltfMap[transitionState.previousKey]}
            reflectiveMaterial={previousConfig.isReflective ? reflectiveMaterial : null}
          />
        )}
        <Preload all /> {/* Preloads assets from useGLTF calls */}
    </>
  );
}
