import FlexBox from '../../shared/components/FlexBox';
import Background from './background/Background';
import BackgroundContainer from './background/BackgroundContainer';
import Title from './Title';

function Home() {
  return (
    <FlexBox>
      <BackgroundContainer>
        <Background />
      </BackgroundContainer>
      <Title>Building brands that reach new heights.</Title>
    </FlexBox>
  );
}

export default Home;
