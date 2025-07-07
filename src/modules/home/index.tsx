import useHackerText from '../../shared/hooks/useHackerText';
import ContentContainer from './ContentContainer';
import NeonText from '../../shared/styles/NeonText';
import FlexBox from '../../shared/components/FlexBox';
import { ChevronButton } from '../../shared/components/ChevronButton';
// TODO: this feels violating. there should be a cleaner mapping to find the order of available objects, i.e. not from page -> object configurations.
// there should be a central location between the two components that toggles whether or not pages are available.
import { objectConfigurations } from '../../shared/components/background/ShapeConfig';
import { Pages } from '@/shared/interfaces/pages';
 
export interface HomeProps {
  setPage: (page: Pages) => void;
  currentPage: Pages;
}

const pageTitles = {
  [Pages.AudioEngineering]: 'audio engineering',
  [Pages.Software]: 'software prototyping'
}

function Home({ setPage, currentPage }: HomeProps) {

   const handleNextPage = () => {
    const currentIndex = objectConfigurations.findIndex(
      (config) => config.page === currentPage
    );
    const nextIndex = (currentIndex + 1) % objectConfigurations.length;
    setPage(objectConfigurations[nextIndex].page);
  };

  const handlePreviousPage = () => {
    const currentIndex = objectConfigurations.findIndex(
      (config) => config.page === currentPage 
    );
    const prevIndex =
      (currentIndex - 1 + objectConfigurations.length) %
      objectConfigurations.length;
    setPage(objectConfigurations[prevIndex].page);
  };

   const animatedText = useHackerText(pageTitles[currentPage], {
     speed: 10,
   });

   return <ContentContainer id="home" justifyContent={"center"} flexDirection="column" maxWidth="1800px">
     <FlexBox justifyContent='space-between' padding='0 0.1vw' height='50%' alignItems='flex-end'>
       <ChevronButton direction='left' onClick={handlePreviousPage}/>
       <ChevronButton direction='right' onClick={handleNextPage}/>
     </FlexBox>
     {/* this vw isnt bad, but im curious if there is a better way to scale text, as well as other items (like the chevron) depending on screen size.
         since the REM size is not consistent with screen size between phones (i.e. iphone SE has huge default REM,), it seems like pixels is the best option.*/}
     <NeonText fontSize="30px" height="30%" justifyContent="center" alignItems="flex-end" animatedHover>{animatedText}</NeonText>
     </ContentContainer>;
 }
 
 export default Home;
