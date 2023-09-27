/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import './App.css';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import LocomotiveScroll from 'locomotive-scroll';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const tail = keyframes`
  0% {
    width: 0;
  }
  30% {
    width: 100px;
  }
  100% {
    width: 0;
  }
`;

const shining = keyframes`
  0% {
    width: 0;
  }
  50% {
    width: 30px;
  }
  100% {
    width: 0;
  }
`;

const shooting = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(600px);
  }
`;

const shootingTime = 2000; // in ms

const generateShootingStars = (count: number) => {
  let styles = '';
  for (let i = 1; i <= count; i++) {
    const delay = Math.random() * 20000;
    const top = Math.random() * 800 - 400;
    const left = Math.random() * 500;
    const opacity = Math.random() * 0.5 + 0.5;
    styles += `
      &:nth-of-type(${i}) {
        top: calc(50% + ${top}px);
        left: calc(0% + ${left}px);
        animation-delay: ${delay}ms;
        opacity: ${opacity};
        &::before,
        &::after {
          animation-delay: ${delay}ms;
        }
      }
    `;
  }
  return css([styles]);
};

const Night = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform: rotateZ(45deg);
`;

const ShootingStar = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  height: 2px;
  background: linear-gradient(-45deg, #fff, rgba(0, 0, 255, 0));
  border-radius: 999px;
  filter: drop-shadow(0 0 6px #fff);
  animation:
    ${tail} ${shootingTime}ms ease-in-out infinite,
    ${shooting} ${shootingTime}ms ease-in-out infinite;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: calc(50% - 1px);
    right: 0;
    height: 2px;
    background: linear-gradient(
      -45deg,
      rgba(0, 0, 255, 0),
      #fff,
      rgba(0, 0, 255, 0)
    );
    transform: translateX(50%) rotateZ(45deg);
    border-radius: 100%;
    animation: ${shining} ${shootingTime}ms ease-in-out infinite;
  }
  &::after {
    transform: translateX(50%) rotateZ(-45deg);
  }
  ${generateShootingStars(5)}
`;

const StarFieldWithShootingStars = () => {
  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
      `}
    >
      <Night>
        {Array.from({ length: 5 }).map((_, i) => (
          <ShootingStar key={i} />
        ))}
      </Night>
    </div>
  );
};

const generateStars = (count: number, color: string) => {
  let stars = '';
  for (let i = 0; i < count; i++) {
    stars += `${Math.floor(Math.random() * 2000)}px ${Math.floor(
      Math.random() * 2000,
    )}px ${color}, `;
  }
  return stars.slice(0, -2);
};

const commonStarStyles = css`
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Stars = styled.div`
  ${commonStarStyles};
  width: 1px;
  height: 1px;
  box-shadow: ${generateStars(200, '#FFF')};
  animation-duration: 2s;
  animation-name: ${fadeIn};
  animation-fill-mode: forwards;
`;

const Stars2 = styled.div`
  ${commonStarStyles};
  width: 1px;
  height: 1px;
  box-shadow: ${generateStars(500, '#939393')};
  animation-duration: 2s;
  animation-name: ${fadeIn};
  animation-fill-mode: forwards;
`;

const Stars3 = styled.div`
  ${commonStarStyles};
  width: 2px;
  height: 2px;
  box-shadow: ${generateStars(25, '#FFF')};
  animation-duration: 3s;
  animation-name: ${fadeIn};
  animation-fill-mode: forwards;
`;

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, []);

  return (
    <>
      <Stars />
      <Stars2 />
      <Stars3 />
      <StarFieldWithShootingStars />
      <h1>Sauko Design</h1>
    </>
  );
}

export default App;
