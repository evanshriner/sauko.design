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

const artistImages = [
  'images/artist1.jpg',
  'images/artist2.jpg',
];

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
        // TODO: should be transparent
        backgroundColor: 0xffffff,
      });
      appRef.current = app;
      canvasRef.current.appendChild(app.view as unknown as Node);

      const textureMap = await PIXI.Assets.load(artistImages);
      texturesRef.current = artistImages.map(url => textureMap[url]);

      // texturesRef.current = await PIXI.Assets.load('https://i.imgur.com/2yYayZk.png');
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

      const displacementSprite = await PIXI.Sprite.from('images/displacement_smoke.png');
      displacementSprite.texture.source.addressMode = 'repeat';
      displacementSprite.width = 800;
      displacementSprite.height = 600;
      displacementSprite.anchor.set(0.5);
      displacementSprite.x = 400;
      displacementSprite.y = 300;
      app.stage.addChild(displacementSprite);
      displacementSprite.visible = false;

      const displacementFilter = new PIXI.DisplacementFilter(displacementSprite);
      displacementFilter.scale.x = 10;
      displacementFilter.scale.y = 10;

      if (spriteRef.current) {
        spriteRef.current.filters = [displacementFilter];
      }

      app.stage.interactive = true;
      app.stage.on('pointermove', (event) => {
        gsap.to(displacementFilter.scale, {
          duration: 0.5,
          x: Math.abs(event.global.x - 400) / 40,
          y: Math.abs(event.global.y - 300) / 30,
        });
      });
      app.stage.on('pointerout', () => {
        gsap.to(displacementFilter.scale, {
          duration: 0.5,
          x: 0,
          y: 0,
        });
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