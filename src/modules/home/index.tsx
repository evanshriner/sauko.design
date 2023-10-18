import FlexBox from '../../shared/components/FlexBox';
import Background from './background/Background';
import BackgroundContainer from './background/BackgroundContainer';
import NavBar from './navbar';
import Title from './Title';

function Home() {
  return (
    <FlexBox>
      <BackgroundContainer>
        <Background />
      </BackgroundContainer>
      <FlexBox flexDirection="column">
        <NavBar />
        <Title>Creating waves in digital innovation.</Title>
      </FlexBox>
    </FlexBox>
  );
}

export default Home;
