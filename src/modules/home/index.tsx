import useHackerText from '@/shared/hooks/useHackerText';
import ContentContainer from './ContentContainer';
import Title from '@/shared/styles/Title';
import NeonText from '@/shared/styles/NeonText';
import { useState } from 'react';

function Home() {

  const [animationTrigger, setAnimationTrigger] = useState(0);

  const handleNext = () => {
    // Incrementing the trigger tells the hook to restart the animation
    setAnimationTrigger(prevTrigger => prevTrigger + 1);
  };

  const animatedText = useHackerText("Audio Engineering", {
    speed: 10,
    trigger: animationTrigger, // Pass the trigger to the hook
  });

  return <ContentContainer id="home" justifyContent={"center"} alignItems={"center"}><NeonText>{animatedText}</NeonText><button onClick={handleNext}></button></ContentContainer>;
}

export default Home;
