import './App.css';
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme/theme';
import CustomCursor from './shared/components/CustomCursor';
import Home from './modules/home';
import { Suspense, useEffect, useLayoutEffect, useState } from 'react';
import React from 'react';
import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import FlexBox from '@/shared/components/FlexBox';
import Background from '@/shared/components/background/Background';
import BackgroundContainer from '@/shared/components/background/BackgroundContainer';
import NavBar, {
  FLOATING_NAVIGATION_ROOT_ID,
} from '@/shared/components/navbar/index';
import ContentContainer from '@/shared/components/contentContainer';
import LoadingScreen from '@/shared/components/loading/LoadingScreen';

import { MediaPlayerProvider } from './shared/context/MediaPlayerContext';
import { Pages } from './shared/interfaces/pages';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { getPageFromPath, getPathForPage } from './shared/utils/routing';
import { usePageSEO } from './shared/hooks/usePageSEO';

import AudioEngineering from "./modules/audioEngineering"
import Software from "./modules/software"
import AIDesloppification from "./modules/aiDesloppification"

function App() {
  const { progress } = useProgress();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [initialRoute] = useState(() => getPageFromPath());
  const [currentSelectableSubPage, setCurrentSelectableSubPage] =
    useState<Pages>(
      initialRoute === Pages.Home ? Pages.AudioEngineering : initialRoute,
    );
  const [currentPage, setCurrentPage] = useState<Pages>(initialRoute);
  const [isHoveringNav, setIsHoveringNav] = useState(false);

  usePageSEO(currentPage);

  const pageComponents: { [key in Pages]: React.ReactElement } = {
    [Pages.Home]: (
      <Home
        setPage={setCurrentSelectableSubPage}
        currentPage={currentSelectableSubPage}
      />
    ),
    [Pages.AudioEngineering]: <AudioEngineering />,
    [Pages.Software]: <Software />,
    [Pages.AIDesloppification]: <AIDesloppification />,
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    // This effect runs once on mount to set the initial page
    ScrollSmoother.create({
      smooth: 1.5,
      effects: true,
    });
  }, []);

  useEffect(() => {
    console.log('Current Page:', currentPage);
    // Refresh ScrollTrigger when page changes to recalculate heights for ScrollSmoother
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    const handlePopState = () => {
      const pageFromUrl = getPageFromPath();
      setCurrentPage(pageFromUrl);
      if (pageFromUrl !== Pages.Home) {
        setCurrentSelectableSubPage(pageFromUrl);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // effect to handle transition between loading screen and main content
  const handleStarted = () => {
    setIsTransitioning(true);

    // cancel animations after they complete
    setTimeout(() => {
      setShowLoadingScreen(false);
      setIsTransitioning(false);
      ScrollTrigger.refresh();
    }, 1000); // this matches the bloom animation durations found in the wrapping components
  };

  const handlePageChange = (page: Pages) => {
    if (page !== Pages.Home) {
      setCurrentSelectableSubPage(page);
    }
    setCurrentPage(page);
    // this is necessary since the raycaster is not updated until the mouse moves (just an aesthetic improvement)
    setIsHoveringNav(false);

    if (typeof window !== 'undefined') {
      const targetPath = getPathForPage(page);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page }, '', targetPath);
      }
    }
  };

  const isHome = currentPage === Pages.Home;

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
        {/* <AppContainer isTransitioning={isTransitioning}> */}
        <CustomCursor isHoveringNav={isHoveringNav} />
        <BackgroundContainer>
          <Background
            active={!showLoadingScreen || isTransitioning}
            interactive={!showLoadingScreen}
            currentPage={currentPage}
            currentSelectableSubPage={currentSelectableSubPage}
            onObjectClick={handlePageChange}
            onObjectHover={setIsHoveringNav}
          />
        </BackgroundContainer>
        <div id={FLOATING_NAVIGATION_ROOT_ID} />
        <div
          id="smooth-wrapper"
          style={{ pointerEvents: isHome ? 'none' : 'auto' }}
        >
          <div
            id="smooth-content"
            style={{ pointerEvents: isHome ? 'none' : 'auto' }}
          >
            <FlexBox flexDirection="column" id="dom-content" minHeight="100vh">
              <NavBar
                onMenuItemClick={(page) => {
                  handlePageChange(page);
                }}
                onHoverChange={setIsHoveringNav}
              />
              <ContentContainer
                // ref={scrollContainerRef}
                // data-scroll-container
                alignItems="center"
                // this will need to be dynamic, based on whether or not we are scrolling (currently only subpages scroll)
                style={{
                  pointerEvents: isHome ? 'none' : 'auto',
                  flexGrow: 1,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    style={{
                      width: '100%',
                      minHeight: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flexGrow: 1,
                      pointerEvents: isHome ? 'none' : 'auto',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Suspense fallback={null}>
                      {pageComponents[currentPage]}
                    </Suspense>
                  </motion.div>
                </AnimatePresence>
              </ContentContainer>
            </FlexBox>
          </div>
        </div>
        {/* </AppContainer> */}
      </MediaPlayerProvider>
    </ThemeProvider>
  );
}

export default App;
