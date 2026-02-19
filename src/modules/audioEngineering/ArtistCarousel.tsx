import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import styled from '@emotion/styled';

const CarouselContainer = styled.div`
  position: relative;
  width: 800px;
  height: 600px;
  margin: auto;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;

  &.prev {
    left: 10px;
  }

  &.next {
    right: 10px;
  }
`;

const artistImages = ['images/artist1.jpg', 'images/artist2.jpg'];

const ArtistCarousel: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const texturesRef = useRef<PIXI.Texture[]>([]);
  const spriteRef = useRef<PIXI.Sprite | null>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const initPixi = async () => {
      if (!canvasRef.current) return;

      const app = new PIXI.Application();
      await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0xffffff,
      });
      appRef.current = app;
      canvasRef.current.appendChild(app.canvas);

      const textureMap = await PIXI.Assets.load(artistImages);
      texturesRef.current = artistImages.map((url) => textureMap[url]);

      console.log('Loaded textures:', texturesRef.current);
      if (texturesRef.current.length > 0) {
        const sprite = new PIXI.Sprite(texturesRef.current[0]);
        sprite.width = 800;
        sprite.height = 600;
        sprite.anchor.set(0.5);
        sprite.x = 400;
        sprite.y = 300;
        app.stage.addChild(sprite);
        spriteRef.current = sprite;
      }

      const fragmentSrc = `
        varying vec2 vTextureCoord;
        uniform sampler2D uTexture;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        const float charSize = 8.0;

        float luminance(vec3 color) {
          return dot(color, vec3(0.299, 0.587, 0.114));
        }

        void main() {
          float mouseFactor = 1.0 + u_mouse.x * 2.0;
          vec2 cellSize = vec2(charSize * mouseFactor, charSize * mouseFactor);

          vec2 cellCoord = floor(vTextureCoord * u_resolution / cellSize);
          vec2 cellCenter = (cellCoord + 0.5) * cellSize / u_resolution;
          vec3 cellColor = texture2D(uTexture, cellCenter).rgb;

          float lum = luminance(cellColor);

          // Simple character selection
          vec3 asciiColor;
          if (lum > 0.8) {
            asciiColor = vec3(1.0); // @
          } else if (lum > 0.6) {
            asciiColor = vec3(0.8); // #
          } else if (lum > 0.4) {
            asciiColor = vec3(0.6); // &
          } else if (lum > 0.2) {
            asciiColor = vec3(0.4); // :
          } else {
            asciiColor = vec3(0.2); // .
          }

          finalColor = vec4(asciiColor * cellColor, 1.0);
        }
      `;

                          const vertexSrc = `
                            attribute vec2 aPosition;
                            varying vec2 vTextureCoord;
                    
                            void main(void) {
                              gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
                              vTextureCoord = aPosition;
                            }
                          `;              
            
                 
              
                    const asciiFilter = PIXI.Filter.from({
                      gl: {
                        vertex: vertexSrc,
                        fragment: fragmentSrc,
                      },
                      resources: {
                        filterUniforms: new PIXI.UniformGroup({
                          u_resolution: { value: [800, 600], type: 'vec2<f32>' },
                          u_mouse: { value: [0, 0], type: 'vec2<f32>' },
                        }),
                      },
                    });
              
                    if (spriteRef.current) {
                      spriteRef.current.filters = [asciiFilter];
                    }
              
                    app.stage.eventMode = 'static';
                    app.stage.on('pointermove', (event) => {
                      if (asciiFilter) {
                        const { x, y } = event.global;
                        gsap.to(asciiFilter.resources.filterUniforms.uniforms.u_mouse, {
                          duration: 0.5,
                          0: x / 800,
                          1: y / 600,
                        });
                      }
                    });
              
                    app.stage.on('pointerout', () => {
                      if (asciiFilter) {
                        gsap.to(asciiFilter.resources.filterUniforms.uniforms.u_mouse, {
                          duration: 0.5,
                          0: 0,
                          1: 0,
                        });
                      }
                    });
    };

    initPixi();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, [canvasRef]);

  const moveCarousel = (direction: 'next' | 'prev') => {
    const textures = texturesRef.current;
    if (!spriteRef.current || textures.length === 0) return;

    const oldIndex = currentIndexRef.current;
    let newIndex = oldIndex;

    if (direction === 'next') {
      newIndex = (oldIndex + 1) % textures.length;
    } else {
      newIndex = (oldIndex - 1 + textures.length) % textures.length;
    }

    currentIndexRef.current = newIndex;
    const sprite = spriteRef.current;
    gsap.to(sprite, {
      alpha: 0,
      duration: 0.5,
      onComplete: () => {
        sprite.texture = textures[newIndex];
        gsap.to(sprite, { alpha: 1, duration: 0.5 });
      },
    });
  };

  return (
    <CarouselContainer>
      <CanvasContainer ref={canvasRef} />
      <NavButton className="prev" onClick={() => moveCarousel('prev')}>
        Prev
      </NavButton>
      <NavButton className="next" onClick={() => moveCarousel('next')}>
        Next
      </NavButton>
    </CarouselContainer>
  );
};

export default ArtistCarousel;
