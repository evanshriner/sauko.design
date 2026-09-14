import React, {
  Suspense,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';
import { useReducedMotion } from 'framer-motion';

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
  ObjectConfig,
} from './ShapeConfig';
import { useMediaPlayerContext } from '@/shared/context/MediaPlayerContext';
import { useResponsiveScale } from '@/shared/hooks/useResponsiveScale';

interface ShapesSwitcherProps {
  selectedObjectKey: DisplayedObject;
  interactive: boolean;
  reflectionResolution: number;
  reflectionRefreshRate: number;
  onObjectClick?: (objectId: DisplayedObject) => void;
  onObjectHover?: (objectId: DisplayedObject | null) => void;
}

const X_OFFSET_SPACING = 5.5;
const REFLECTION_INTERVAL_TOLERANCE_SECONDS = 0.001;
const COMPACT_MODEL_BREAKPOINT = 558;
const IDLE_PREFETCH_TIMEOUT_MS = 1500;
const AUDIO_RESPONSE_ATTACK_SECONDS = 0.025;
const AUDIO_RESPONSE_DECAY_SECONDS = 0.2;
const IDLE_WAVE_SPEED = 0.3;
const PEAK_WAVE_SPEED = 0.65;
const MAX_POINTER_ROTATION_RADIANS = THREE.MathUtils.degToRad(12);
const POINTER_ROTATION_DAMPING = 5;

const getActiveModelConfig = (
  config: ObjectConfig,
  isCompact: boolean,
): ObjectModelConfig =>
  isCompact
    ? config.models.mobile ?? config.models.desktop
    : config.models.desktop;

interface ModelInstanceProps {
  config: ObjectModelConfig;
  gltf: GLTF;
  initialPosition: THREE.Vector3;
  modelIndex: number;
  reflectiveMaterial: THREE.ShaderMaterial;
  registerModelInstance: (
    modelIndex: number,
    modelScene: THREE.Group,
    config: ObjectModelConfig,
  ) => () => void;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerOut?: (event: ThreeEvent<MouseEvent>) => void;
}

const ModelInstance = React.forwardRef<THREE.Group, ModelInstanceProps>(
  (
    {
      config,
      gltf,
      initialPosition,
      modelIndex,
      reflectiveMaterial,
      registerModelInstance,
      onClick,
      onPointerOver,
      onPointerOut,
    },
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
            child.geometry.computeVertexNormals();
          }

          child.material = reflectiveMaterial;
        }
      });

      clonedScene.position.copy(initialPosition);
      if (config.initialRotationOffset !== undefined) {
        clonedScene.rotation.y = config.initialRotationOffset;
      }
      return clonedScene;
    }, [
      config.initialRotationOffset,
      gltf,
      initialPosition,
      reflectiveMaterial,
    ]);

    useLayoutEffect(
      () => registerModelInstance(modelIndex, modelScene, config),
      [config, modelIndex, modelScene, registerModelInstance],
    );

    return (
      <primitive
        ref={ref}
        object={modelScene}
        scale={responsiveScale}
        onClick={
          onClick
            ? (event: ThreeEvent<MouseEvent>) => {
                event.stopPropagation();
                onClick(event);
              }
            : undefined
        }
        onPointerOver={
          onPointerOver
            ? (event: ThreeEvent<MouseEvent>) => {
                event.stopPropagation();
                onPointerOver(event);
              }
            : undefined
        }
        onPointerOut={
          onPointerOut
            ? (event: ThreeEvent<MouseEvent>) => {
                event.stopPropagation();
                onPointerOut(event);
              }
            : undefined
        }
      />
    );
  },
);
ModelInstance.displayName = 'ModelInstance';

type LazyModelInstanceProps = Omit<ModelInstanceProps, 'gltf'>;

const LazyModelInstance = React.forwardRef<THREE.Group, LazyModelInstanceProps>(
  ({ config, ...props }, ref) => {
    const gltf = useGLTF(config.gltfPath);
    return <ModelInstance ref={ref} config={config} gltf={gltf} {...props} />;
  },
);
LazyModelInstance.displayName = 'LazyModelInstance';

export default function Shapes({
  reflectionResolution,
  reflectionRefreshRate,
  selectedObjectKey = DisplayedObject.Boombox,
  onObjectClick,
  interactive,
  onObjectHover,
}: ShapesSwitcherProps) {
  const { amplitudeRef, currentTrackIndex, intensity, isPlaying } =
    useMediaPlayerContext();
  const prefersReducedMotion = useReducedMotion();
  const audioEnvelopeRef = useRef(0);
  const pointerRotationTargetRef = useRef(new THREE.Vector2());
  const [isCompact, setIsCompact] = useState(
    () => window.innerWidth < COMPACT_MODEL_BREAKPOINT,
  );
  const [renderedObjectIds, setRenderedObjectIds] = useState(
    () => new Set<DisplayedObject>([selectedObjectKey]),
  );
  const [displayedObjectKey, setDisplayedObjectKey] =
    useState<DisplayedObject>(selectedObjectKey);
  const [hasInteracted, setHasInteracted] = useState(false);
  const initialSelectedObjectKeyRef = useRef(selectedObjectKey);
  const selectedObjectKeyRef = useRef(selectedObjectKey);
  const requestedCompactModeRef = useRef(isCompact);
  const prefetchedPathsRef = useRef(new Set<string>());
  selectedObjectKeyRef.current = selectedObjectKey;

  useEffect(() => {
    if (!interactive) onObjectHover?.(null);
  }, [interactive, onObjectHover]);

  useEffect(() => {
    const handleResize = () => {
      const nextIsCompact = window.innerWidth < COMPACT_MODEL_BREAKPOINT;
      if (nextIsCompact === requestedCompactModeRef.current) return;

      requestedCompactModeRef.current = nextIsCompact;
      startTransition(() => {
        setIsCompact(nextIsCompact);
        setRenderedObjectIds(
          new Set<DisplayedObject>([selectedObjectKeyRef.current]),
        );
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const pointerTarget = pointerRotationTargetRef.current;
    if (prefersReducedMotion) {
      pointerTarget.set(0, 0);
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      pointerTarget.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        1 - (event.clientY / window.innerHeight) * 2,
      );
    };
    const resetPointerTarget = () => pointerTarget.set(0, 0);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('blur', resetPointerTarget);
    document.documentElement.addEventListener('mouseleave', resetPointerTarget);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('blur', resetPointerTarget);
      document.documentElement.removeEventListener(
        'mouseleave',
        resetPointerTarget,
      );
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    setRenderedObjectIds((currentIds) => {
      if (currentIds.has(selectedObjectKey)) return currentIds;
      const nextIds = new Set(currentIds);
      nextIds.add(selectedObjectKey);
      return nextIds;
    });

    if (selectedObjectKey !== initialSelectedObjectKeyRef.current) {
      setHasInteracted(true);
    }
  }, [selectedObjectKey]);

  useEffect(() => {
    if (!hasInteracted || objectConfigurations.length === 0) return;

    const selectedIndex = objectConfigurations.findIndex(
      (config) => config.id === selectedObjectKey,
    );
    if (selectedIndex < 0) return;

    const nextConfig =
      objectConfigurations[(selectedIndex + 1) % objectConfigurations.length];
    const nextPath = getActiveModelConfig(nextConfig, isCompact).gltfPath;
    if (prefetchedPathsRef.current.has(nextPath)) return;

    let cancelled = false;
    const preloadNextModel = () => {
      if (cancelled) return;
      prefetchedPathsRef.current.add(nextPath);
      useGLTF.preload(nextPath);
    };

    if (typeof window.requestIdleCallback === 'function') {
      const idleCallbackId = window.requestIdleCallback(preloadNextModel, {
        timeout: IDLE_PREFETCH_TIMEOUT_MS,
      });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleCallbackId);
      };
    }

    const timeoutId = window.setTimeout(
      preloadNextModel,
      IDLE_PREFETCH_TIMEOUT_MS,
    );
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [hasInteracted, isCompact, selectedObjectKey]);

  const outerSphereRef = useRef<THREE.ShaderMaterial>(null);
  const outerSphereMeshRef = useRef<THREE.Mesh>(null);
  const modelRefs = useRef(
    objectConfigurations.map(() => React.createRef<THREE.Group>()),
  );
  const reflectiveMeshesByModelRef = useRef(
    objectConfigurations.map(() => [] as THREE.Mesh[]),
  );
  const mountedModelConfigsRef = useRef(
    objectConfigurations.map(() => null as ObjectModelConfig | null),
  );
  const mountedModelScenesRef = useRef(
    objectConfigurations.map(() => null as THREE.Group | null),
  );
  const reflectiveMeshesRef = useRef<THREE.Mesh[]>([]);
  const reflectiveVisibilityRef = useRef<boolean[]>([]);
  const reflectionAccumulatorRef = useRef(0);
  const hasCapturedReflectionRef = useRef(false);

  const reflectionResources = useMemo(() => {
    const renderTarget = new THREE.WebGLCubeRenderTarget(reflectionResolution, {
      format: THREE.RGBAFormat,
      generateMipmaps: false,
      minFilter: THREE.LinearFilter,
      colorSpace: THREE.SRGBColorSpace,
    });

    return {
      renderTarget,
      camera: new THREE.CubeCamera(0.1, 100, renderTarget),
    };
  }, [reflectionResolution]);

  useEffect(() => {
    const { renderTarget } = reflectionResources;
    return () => renderTarget.dispose();
  }, [reflectionResources]);

  const reflectionIntervalSeconds = 1 / Math.max(1, reflectionRefreshRate);

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(4, 32, 32), []);

  // This ref will hold the animation state for each object
  const animationStates = useRef(
    objectConfigurations.map((config, index) => {
      const initialSelectedIndex = objectConfigurations.findIndex(
        (c) => c.id === selectedObjectKey,
      );
      const carouselOffsetX = (index - initialSelectedIndex) * X_OFFSET_SPACING;

      // Use the object's basePosition from the config as the starting point
      const modelConfig = getActiveModelConfig(config, isCompact);
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
      uVisualResponse: { value: 0.0 },
      uWaveEnergy: { value: 0.0 },
    }),
    [],
  );

  useLayoutEffect(() => {
    audioEnvelopeRef.current = 0;
    outerUniforms.uAmplitude.value = 0;
    outerUniforms.uWaveEnergy.value = 0;
  }, [currentTrackIndex, outerUniforms]);

  useLayoutEffect(() => {
    outerUniforms.uVisualResponse.value =
      THREE.MathUtils.clamp(intensity, 0, 100) / 100;
  }, [intensity, outerUniforms]);

  const reflectiveUniforms = useMemo(
    () => ({
      time: { value: 0 },
      tCube: { value: reflectionResources.renderTarget.texture },
      resolution: { value: new THREE.Vector4() },
    }),
    [reflectionResources],
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
    return () => reflectiveMaterial.dispose();
  }, [reflectiveMaterial]);

  const rebuildReflectiveMeshCache = useCallback(() => {
    const reflectiveMeshes = reflectiveMeshesRef.current;
    reflectiveMeshes.length = 0;

    for (const modelMeshes of reflectiveMeshesByModelRef.current) {
      for (const mesh of modelMeshes) reflectiveMeshes.push(mesh);
    }

    reflectiveVisibilityRef.current.length = reflectiveMeshes.length;
    reflectionAccumulatorRef.current = 0;
    hasCapturedReflectionRef.current = false;
  }, []);

  const registerModelInstance = useCallback(
    (
      modelIndex: number,
      modelScene: THREE.Group,
      config: ObjectModelConfig,
    ) => {
      const modelMeshes = reflectiveMeshesByModelRef.current[modelIndex];
      modelMeshes.length = 0;

      modelScene.position.copy(animationStates.current[modelIndex].currentPos);
      modelScene.traverse((object) => {
        if (
          object instanceof THREE.Mesh &&
          object.material === reflectiveMaterial
        ) {
          modelMeshes.push(object);
        }
      });

      mountedModelScenesRef.current[modelIndex] = modelScene;
      mountedModelConfigsRef.current[modelIndex] = config;
      rebuildReflectiveMeshCache();

      const objectConfig = objectConfigurations[modelIndex];
      if (
        objectConfig?.id === selectedObjectKeyRef.current &&
        getActiveModelConfig(objectConfig, requestedCompactModeRef.current)
          .gltfPath === config.gltfPath
      ) {
        setDisplayedObjectKey(objectConfig.id);
      }

      return () => {
        if (mountedModelScenesRef.current[modelIndex] !== modelScene) return;

        mountedModelScenesRef.current[modelIndex] = null;
        mountedModelConfigsRef.current[modelIndex] = null;
        modelMeshes.length = 0;
        rebuildReflectiveMeshCache();
      };
    },
    [rebuildReflectiveMeshCache, reflectiveMaterial],
  );

  useLayoutEffect(() => {
    const selectedIndex = objectConfigurations.findIndex(
      (config) => config.id === selectedObjectKey,
    );
    if (selectedIndex < 0) return;

    const objectConfig = objectConfigurations[selectedIndex];
    const mountedConfig = mountedModelConfigsRef.current[selectedIndex];
    if (
      mountedModelScenesRef.current[selectedIndex] &&
      mountedConfig?.gltfPath ===
        getActiveModelConfig(objectConfig, isCompact).gltfPath
    ) {
      setDisplayedObjectKey(selectedObjectKey);
    }
  }, [isCompact, selectedObjectKey]);

  useEffect(() => {
    const newSelectedIndex = objectConfigurations.findIndex(
      (c) => c.id === displayedObjectKey,
    );

    animationStates.current.forEach((state, index) => {
      const config = objectConfigurations[index];
      const carouselOffsetX = (index - newSelectedIndex) * X_OFFSET_SPACING;

      const modelConfig = getActiveModelConfig(config, isCompact);
      const basePos = modelConfig.basePosition.clone();

      // Update the entire target position vector
      state.targetPos.copy(basePos);
      state.targetPos.x = carouselOffsetX;
    });
  }, [displayedObjectKey, isCompact]);

  useLayoutEffect(() => {
    reflectionAccumulatorRef.current = 0;
    hasCapturedReflectionRef.current = false;
  }, [reflectionResources, selectedObjectKey]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    // controls the speed of the wave animation
    if (outerSphereRef.current) {
      const targetAmplitude = isPlaying
        ? Math.max(0, Math.min(1, amplitudeRef.current))
        : 0;
      const envelopeSeconds =
        targetAmplitude > audioEnvelopeRef.current
          ? AUDIO_RESPONSE_ATTACK_SECONDS
          : AUDIO_RESPONSE_DECAY_SECONDS;
      const envelopeBlend = 1 - Math.exp(-delta / envelopeSeconds);
      const nextAmplitude = THREE.MathUtils.lerp(
        audioEnvelopeRef.current,
        targetAmplitude,
        envelopeBlend,
      );

      audioEnvelopeRef.current = nextAmplitude < 0.0001 ? 0 : nextAmplitude;
      const waveEnergy = prefersReducedMotion ? 0 : audioEnvelopeRef.current;
      const waveSpeed = THREE.MathUtils.lerp(
        IDLE_WAVE_SPEED,
        PEAK_WAVE_SPEED,
        waveEnergy,
      );

      outerSphereRef.current.uniforms.time.value += delta * waveSpeed;
      outerSphereRef.current.uniforms.uAmplitude.value =
        audioEnvelopeRef.current;
      outerSphereRef.current.uniforms.uWaveEnergy.value = waveEnergy;
    }

    // Rotate the outer sphere independently of the reflection capture cadence.
    if (outerSphereMeshRef.current) {
      const speed = 0.03;
      outerSphereMeshRef.current.rotation.y = -time * speed;
    }

    reflectionAccumulatorRef.current += delta;
    const shouldUpdateReflection =
      !hasCapturedReflectionRef.current ||
      reflectionAccumulatorRef.current +
        REFLECTION_INTERVAL_TOLERANCE_SECONDS >=
        reflectionIntervalSeconds;

    if (shouldUpdateReflection) {
      if (
        hasCapturedReflectionRef.current &&
        reflectionAccumulatorRef.current >= reflectionIntervalSeconds
      ) {
        reflectionAccumulatorRef.current %= reflectionIntervalSeconds;
      } else {
        reflectionAccumulatorRef.current = 0;
      }

      const reflectiveMeshes = reflectiveMeshesRef.current;
      const previousVisibility = reflectiveVisibilityRef.current;
      previousVisibility.length = reflectiveMeshes.length;

      for (let index = 0; index < reflectiveMeshes.length; index += 1) {
        const mesh = reflectiveMeshes[index];
        previousVisibility[index] = mesh.visible;
        mesh.visible = false;
      }

      const sphere = outerSphereMeshRef.current;
      const originalRotationY = sphere?.rotation.y;

      try {
        if (sphere) sphere.rotation.y = 0;
        reflectionResources.camera.update(state.gl, state.scene);
        hasCapturedReflectionRef.current = true;
      } finally {
        if (sphere && originalRotationY !== undefined) {
          sphere.rotation.y = originalRotationY;
        }

        for (let index = 0; index < reflectiveMeshes.length; index += 1) {
          reflectiveMeshes[index].visible = previousVisibility[index];
        }
      }
    }

    // Animate objects
    animationStates.current.forEach((animState, idx) => {
      const groupRef = modelRefs.current[idx];
      if (groupRef?.current) {
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

    mountedModelConfigsRef.current.forEach((modelConfig, idx) => {
      const groupRef = modelRefs.current[idx]?.current;
      if (!groupRef || !modelConfig) return;

      const baseRotationY = modelConfig.initialRotationOffset ?? 0;

      if (prefersReducedMotion) {
        groupRef.rotation.x = 0;
        groupRef.rotation.y = baseRotationY;
      } else {
        // Counter-rotate across the screen axes so the model mirrors the cursor.
        groupRef.rotation.x = THREE.MathUtils.damp(
          groupRef.rotation.x,
          pointerRotationTargetRef.current.y * MAX_POINTER_ROTATION_RADIANS,
          POINTER_ROTATION_DAMPING,
          delta,
        );
        groupRef.rotation.y = THREE.MathUtils.damp(
          groupRef.rotation.y,
          baseRotationY -
            pointerRotationTargetRef.current.x * MAX_POINTER_ROTATION_RADIANS,
          POINTER_ROTATION_DAMPING,
          delta,
        );
      }

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

      {/* Render only the selected and previously visited models for this asset tier. */}
      {objectConfigurations.map((config, index) => {
        const shouldRenderModel =
          renderedObjectIds.has(config.id) || config.id === selectedObjectKey;
        if (!shouldRenderModel) return null;

        const modelConfig = getActiveModelConfig(config, isCompact);
        return (
          <Suspense key={config.id} fallback={null}>
            <LazyModelInstance
              ref={modelRefs.current[index]}
              config={modelConfig}
              initialPosition={animationStates.current[index].currentPos}
              modelIndex={index}
              reflectiveMaterial={reflectiveMaterial}
              registerModelInstance={registerModelInstance}
              onClick={
                interactive ? () => onObjectClick?.(config.id) : undefined
              }
              onPointerOver={
                interactive ? () => onObjectHover?.(config.id) : undefined
              }
              onPointerOut={
                interactive ? () => onObjectHover?.(null) : undefined
              }
            />
          </Suspense>
        );
      })}
    </>
  );
}
