import FlexBox from '../../shared/components/FlexBox';
import Background from './background/Background';
import BackgroundContainer from './background/BackgroundContainer';
import ContentContainer from './ContentContainer';
import NavBar from './navbar/index';
import Title from './Title';

function Home() {
  return (
    <FlexBox>
      <BackgroundContainer>
        <Background />
      </BackgroundContainer>
      <ContentContainer>
        <NavBar />
        <Title>Creating waves in digital innovation.</Title>
      </ContentContainer>
    </FlexBox>
  );
}

export default Home;
