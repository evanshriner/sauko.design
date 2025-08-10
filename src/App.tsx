import './App.css';
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme/theme';
import CustomCursor from './shared/components/CustomCursor';
import Home from './modules/home';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import FlexBox from '@/shared/components/FlexBox';
import Background from '@/shared/components/background/Background';
import BackgroundContainer from '@/shared/components/background/BackgroundContainer';
import NavBar from '@/shared/components/navbar/index';
import ContentContainer from '@/shared/components/contentContainer';
import LoadingScreen from '@/shared/components/loading/LoadingScreen';

// Import Locomotive Scroll CSS and JS directly
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { MediaPlayerProvider } from './shared/context/MediaPlayerContext';
import { Pages } from './shared/interfaces/pages';
import { AppContainer } from './App.styles';
import AudioEngineering from './modules/audioEngineering';
import Software from './modules/software';
import AIAugmentation from './modules/aiAugmentation';

function App() {
  const { progress } = useProgress();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [currentSelectableSubPage, setCurrentSelectableSubPage] =
    useState<Pages>(Pages.AudioEngineering);
  const [currentPage, setCurrentPage] = useState<Pages>(Pages.Home);
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  // Ref for the scroll container element
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  // Ref to store the Locomotive Scroll instance
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);

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

  // Effect for Initialization and Cleanup
  useEffect(() => {
    let scroll: LocomotiveScroll | null = null;
    let resizeObserver: ResizeObserver | null = null;

    if (scrollContainerRef.current) {
      // Initialize Locomotive Scroll
      scroll = new LocomotiveScroll({
        el: scrollContainerRef.current,
        smooth: true,
        // Add other options as needed
      });

      locomotiveScrollRef.current = scroll; // Store instance

      // forces navigation to only be clickable items
      // locomotiveScrollRef.current.stop();

      // Listen for scroll events
      scroll.on('scroll', () => {});

      // --- Update on Resize ---
      resizeObserver = new ResizeObserver(() => {
        scroll?.update();
      });
      resizeObserver.observe(scrollContainerRef.current);

      console.log('Locomotive Scroll initialized');
    }

    // --- Cleanup function ---
    return () => {
      resizeObserver?.disconnect(); // Stop observing
      scroll?.destroy(); // Use the 'scroll' variable captured in the closure
      locomotiveScrollRef.current = null; // Clear the ref
      console.log('Locomotive Scroll destroyed');
    };
  }, []);

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
              ref={scrollContainerRef}
              data-scroll-container
              alignItems="center"
              // this will need to be dynamic, based on whether or not we are scrolling (currently only subpages scroll)
              style={{
                pointerEvents: currentPage === Pages.Home ? 'none' : 'all',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  style={{ width: '100%' }}
                  data-scroll-section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {React.cloneElement(pageComponents[currentPage], {
                    'data-scroll-section': true,
                  })}
                </motion.div>
              </AnimatePresence>
            </ContentContainer>
          </FlexBox>
        </AppContainer>
      </MediaPlayerProvider>
    </ThemeProvider>
  );
}

export default App;
