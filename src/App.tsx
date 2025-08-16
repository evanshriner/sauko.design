import './App.css';
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme/theme';
import CustomCursor from './shared/components/CustomCursor';
import Home from './modules/home';
import { useEffect, useLayoutEffect, useState } from 'react';
import React from 'react';
import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import FlexBox from '@/shared/components/FlexBox';
import Background from '@/shared/components/background/Background';
import BackgroundContainer from '@/shared/components/background/BackgroundContainer';
import NavBar from '@/shared/components/navbar/index';
import ContentContainer from '@/shared/components/contentContainer';
import LoadingScreen from '@/shared/components/loading/LoadingScreen';

import { MediaPlayerProvider } from './shared/context/MediaPlayerContext';
import { Pages } from './shared/interfaces/pages';
import { AppContainer } from './App.styles';
import AudioEngineering from './modules/audioEngineering';
import Software from './modules/software';
import AIAugmentation from './modules/aiAugmentation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

function App() {
  const { progress } = useProgress();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [currentSelectableSubPage, setCurrentSelectableSubPage] =
    useState<Pages>(Pages.AudioEngineering);
  const [currentPage, setCurrentPage] = useState<Pages>(Pages.Home);
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  // Ref to store the Locomotive Scroll instance

  const pageComponents: { [key in Pages]: React.ReactElement } = {
    [Pages.Home]: (
      <Home
        setPage={setCurrentSelectableSubPage}
        currentPage={currentSelectableSubPage}
      />
    ),
    [Pages.AudioEngineering]: <AudioEngineering />,
    [Pages.Software]: <Software />,
    [Pages.AIAugmentation]: <AIAugmentation />,
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    // This effect runs once on mount to set the initial page
    ScrollSmoother.create({
      smooth: 3,
      effects: true,
    });
  }, []);

  useEffect(() => {
    console.log('Current Page:', currentPage);
  }, [currentPage]);

  // effect to handle transition between loading screen and main content
  const handleStarted = () => {
    setIsTransitioning(true);

    // cancel animations after they complete
    setTimeout(() => {
      setShowLoadingScreen(false);
      setIsTransitioning(false);
    }, 1000); // this matches the bloom animation durations found in the wrapping components
  };

  const handlePageChange = (page: Pages) => {
    setCurrentSelectableSubPage(page);
    setCurrentPage(page);
    // this is necessary since the raycaster is not updated until the mouse moves (just an aesthetic improvement)
    setIsHoveringNav(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <MediaPlayerProvider>
        {showLoadingScreen && (
          <LoadingScreen
            progress={progress}
            isTransitioning={isTransitioning}
            onStarted={handleStarted}
          />
        )}
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <AppContainer isTransitioning={isTransitioning}>
              <CustomCursor isHoveringNav={isHoveringNav} />
              <BackgroundContainer>
                <Background
                  currentPage={currentPage}
                  currentSelectableSubPage={currentSelectableSubPage}
                  onObjectClick={handlePageChange}
                  onObjectHover={setIsHoveringNav}
                />
              </BackgroundContainer>
              <FlexBox flexDirection="column" id="dom-content">
                <NavBar
                  onMenuItemClick={(page) => {
                    // this will always be home for now
                    setCurrentPage(page);
                  }}
                  onHoverChange={setIsHoveringNav}
                />
                <ContentContainer
                  // ref={scrollContainerRef}
                  // data-scroll-container
                  alignItems="center"
                  // this will need to be dynamic, based on whether or not we are scrolling (currently only subpages scroll)
                  style={{
                    pointerEvents: currentPage === Pages.Home ? 'none' : 'auto',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      style={{
                        width: '100%',
                        height: '100%',
                        pointerEvents:
                          currentPage === Pages.Home ? 'none' : 'auto',
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {pageComponents[currentPage]}
                    </motion.div>
                  </AnimatePresence>
                </ContentContainer>
              </FlexBox>
            </AppContainer>
          </div>
        </div>
      </MediaPlayerProvider>
    </ThemeProvider>
  );
}

export default App;
