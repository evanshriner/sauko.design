import './App.css';
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme/theme';
import Home from './modules/home';
import Blog from './modules/blog';
import { useState } from 'react';
import FlexBox from './shared/components/FlexBox';
import Background from './shared/components/background/Background';
import BackgroundContainer from './shared/components/background/BackgroundContainer';
import NavBar from './shared/components/navbar/index';

function App() {
  const [currentPage, setCurrentPage] = useState('Blog');

  const handleMenuItemClick = (menuItem) => {
    console.log(`Clicked on ${menuItem}`);
    setCurrentPage(menuItem);
  };

  return (
    <ThemeProvider theme={theme}>
      <NavBar onMenuItemClick={handleMenuItemClick} />
      <FlexBox>
        <BackgroundContainer>
          <Background />
        </BackgroundContainer>
        {currentPage === 'Home' && <Home />}
        {currentPage === 'Blog' && <Blog />}
      </FlexBox>
    </ThemeProvider>
  );
}

export default App;
