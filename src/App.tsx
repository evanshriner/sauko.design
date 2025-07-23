import './App.css';
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme/theme';
import CustomCursor from './shared/components/CustomCursor';
import Home from './modules/home';
import Services from './modules/services';
import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
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

function App() {
  const { progress } = useProgress();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [currentPage, setCurrentPage] = useState<Pages>(Pages.AudioEngineering);
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  // Ref for the scroll container element
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  // Ref to store the Locomotive Scroll instance
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);

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

  return (
    <ThemeProvider theme={theme}>
      {showLoadingScreen && (
        <LoadingScreen
          hasLoaded={progress === 100}
          progress={progress}
          isTransitioning={isTransitioning}
          onStarted={handleStarted}
        />
      )}
      <AppContainer isTransitioning={isTransitioning}>
        <MediaPlayerProvider>
          <CustomCursor isHoveringNav={isHoveringNav} />
          <BackgroundContainer>
            <Background currentPage={currentPage} />
          </BackgroundContainer>
          <FlexBox flexDirection="column">
            <NavBar
              onMenuItemClick={() => {}}
              currentPage={currentPage.toString()}
              onHoverChange={setIsHoveringNav}
            />
            <ContentContainer
              ref={scrollContainerRef}
              data-scroll-container
              alignItems="center"
            >
              <Home
                data-scroll-section
                setPage={setCurrentPage}
                currentPage={currentPage}
              />

              <Services data-scroll-section />
            </ContentContainer>
          </FlexBox>
        </MediaPlayerProvider>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
