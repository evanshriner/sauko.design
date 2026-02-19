import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import styled from '@emotion/styled';
import { useResponsiveScale } from '@/shared/hooks/useResponsiveScale';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 1000px;
  margin: auto;
  overflow: hidden;
  background: transparent;
`;

// Define the ASCII Shader Material
// Character set: 亜哀挨愛曖悪圧
const AsciiShaderMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uMouse: new THREE.Vector2(0, 0),
    uTime: 0,
    uVelocity: 0.0, // New uniform to track movement intensity
    uResolution: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uVelocity;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Calculate distance from mouse to vertex (normalized coordinates)
    float dist = distance(uv * 2.0 - 1.0, uMouse);
    
    // Only apply displacement if the mouse is moving (uVelocity > 0)
    if (dist < 0.8 && uVelocity > 0.01) {
      float strength = (0.8 - dist) * 0.5 * uVelocity;
      pos.x += sin(uTime * 30.0 + pos.y * 15.0) * strength;
      pos.y += cos(uTime * 35.0 + pos.x * 18.0) * strength;
      pos.z += sin(uTime * 40.0 + (pos.x + pos.y) * 10.0) * strength * 0.5;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uVelocity;

  float getChar(float brightness, vec2 uv) {
    vec2 grid = fract(uv * 50.0);
    float char = 0.0;
    if (brightness > 0.8) {
        char = step(0.1, grid.x) * step(grid.x, 0.9) * step(0.1, grid.y) * step(grid.y, 0.9);
        char -= step(0.3, grid.x) * step(grid.x, 0.7) * step(0.3, grid.y) * step(grid.y, 0.7);
    } else if (brightness > 0.6) {
        char = step(0.2, grid.x) * step(grid.x, 0.8) * step(0.4, grid.y) * step(grid.y, 0.6);
        char += step(0.4, grid.x) * step(grid.x, 0.6) * step(0.2, grid.y) * step(grid.y, 0.8);
    } else if (brightness > 0.4) {
        char = step(0.3, grid.x) * step(grid.x, 0.7) * step(0.1, grid.y) * step(grid.y, 0.9);
    } else if (brightness > 0.2) {
        char = step(0.45, grid.x) * step(grid.x, 0.55);
    }
    return char;
  }

  void main() {
    vec2 asciiUv = floor(vUv * 80.0) / 80.0;
    float dist = distance(vUv * 2.0 - 1.0, uMouse);
    
    // Glitch response scaled by velocity
    if (dist < 0.5 && uVelocity > 0.01) {
        float glitch = sin(uTime * 60.0) * 0.05 * (0.5 - dist) * uVelocity;
        asciiUv.x += glitch;
        asciiUv.y += glitch * 0.5;
    }

    vec4 tex = texture2D(uTexture, asciiUv);
    float brightness = (tex.r + tex.g + tex.b) / 3.0;

    if (dist < 0.4 && uVelocity > 0.01) {
        brightness += sin(uTime * 70.0) * 0.2 * (0.4 - dist) * uVelocity;
    }

    float charVisibility = getChar(brightness, vUv);
    vec3 asciiColor = vec3(0.0, 1.0, 0.4) * charVisibility * brightness;
    asciiColor += tex.rgb * 0.1;
    gl_FragColor = vec4(asciiColor, 1.0);
  }
  `
);

extend({ AsciiShaderMaterial });

const ArtistImage = ({ url, position, rotation, scale }: { url: string, position: [number, number, number], rotation: [number, number, number], scale: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const texture = useTexture(url);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const velocity = useRef(0);
  const lastMouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const updateMouse = (x: number, y: number) => {
      mouse.current.x = (x / window.innerWidth) * 2 - 1;
      mouse.current.y = -(y / window.innerHeight) * 2 + 1;
    };

    const handleMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMouse(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      // Calculate mouse velocity for the glitch effect
      const currentDist = mouse.current.distanceTo(lastMouse.current);
      velocity.current = THREE.MathUtils.lerp(velocity.current, currentDist * 50.0, 0.1);
      lastMouse.current.copy(mouse.current);

      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uMouse.lerp(mouse.current, 0.1);
      materialRef.current.uVelocity = THREE.MathUtils.clamp(velocity.current, 0, 1);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[6, 6, 48, 48]} />
      <asciiShaderMaterial 
        ref={materialRef} 
        uTexture={texture} 
        transparent 
      />
    </mesh>
  );
};

const CarouselScene = () => {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Further reduced maxScale to keep images within the 600px container height
  const responsiveScale = useResponsiveScale(
    {
      minScale: 0.4,
      maxScale: 0.7,
      minViewportWidth: 375,
      maxViewportWidth: 1920,
    },
    0.6
  ) as number;
  
  const artistImages = [
    'images/artist1.jpg', 'images/artist2.jpg', 
    'images/artist1.jpg', 'images/artist2.jpg',
    'images/artist1.jpg', 'images/artist2.jpg',
    'images/artist1.jpg', 'images/artist2.jpg'
  ];
  
  // INCREASED: Larger radius to ensure images aren't overlapping too much or out of view
  // Capped at 11 to keep it compact on screens wider than ~900px
  const radius = THREE.MathUtils.clamp(viewport.width * 0.4, 8, 9);
  
  const rotationY = useRef(0);
  const targetRotationY = useRef(0);
  const isDragging = useRef(false);
  const previousMouseX = useRef(0);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMouseX.current = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - previousMouseX.current;
        targetRotationY.current += deltaX * 0.005;
        previousMouseX.current = e.clientX;
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      previousMouseX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) {
        const deltaX = e.touches[0].clientX - previousMouseX.current;
        targetRotationY.current += deltaX * 0.005;
        previousMouseX.current = e.touches[0].clientX;
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (!isDragging.current) {
        targetRotationY.current += delta * 0.1;
      }
      rotationY.current = THREE.MathUtils.damp(rotationY.current, targetRotationY.current, 4, delta);
      groupRef.current.rotation.y = rotationY.current;
    }
  });

  return (
    <group ref={groupRef}>
      {artistImages.map((url, i) => {
        const angle = (i / artistImages.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <ArtistImage 
            key={i} 
            url={url} 
            position={[x, 0, z]} 
            rotation={[0, -angle + Math.PI / 2, 0]}
            scale={responsiveScale}
          />
        );
      })}
    </group>
  );
};

const ArtistCarousel: React.FC = () => {
  return (
    <CarouselContainer>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <CarouselScene />
      </Canvas>
    </CarouselContainer>
  );
};

export default ArtistCarousel;
