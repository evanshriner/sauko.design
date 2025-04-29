import './App.css';
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme/theme';
import Home from './modules/home';
import Blog from './modules/blog';
import { useEffect, useRef, useState } from 'react';
import FlexBox from './shared/components/FlexBox';
import Background from './shared/components/background/Background';
import BackgroundContainer from './shared/components/background/BackgroundContainer';
import NavBar, { Page } from './shared/components/navbar/index';
import ContentContainer from './shared/components/contentContainer';

// Import Locomotive Scroll CSS and JS directly
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  // Ref for the scroll container element
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  // Ref to store the Locomotive Scroll instance
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);

  const handleMenuItemClick = (menuItem: Page) => {
    console.log(`Clicked on ${menuItem}`);
    setCurrentPage(menuItem);
    // locomotiveScrollRef.current?.scrollTo(0, {
    //   duration: 0,
    //   disableLerp: true,
    // });
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
  }, []); // Run only once on mount

  return (
    <ThemeProvider theme={theme}>
      <BackgroundContainer>
        <Background />
      </BackgroundContainer>
      <FlexBox flexDirection="column">
        <NavBar
          onMenuItemClick={handleMenuItemClick}
          currentPage={currentPage}
        />
        <ContentContainer ref={scrollContainerRef} data-scroll-container>
          <Home data-scroll-section />

          <Blog data-scroll-section />

          <Blog data-scroll-section />
        </ContentContainer>
      </FlexBox>
    </ThemeProvider>
  );
}

export default App;
