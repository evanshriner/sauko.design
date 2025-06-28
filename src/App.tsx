import './App.css';
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme/theme';
import CustomCursor from './shared/components/CustomCursor';
import Home from './modules/home';
import Services from './modules/services';
import { useEffect, useRef, useState } from 'react';
import FlexBox from '@/shared/components/FlexBox';
import Background from '@/shared/components/background/Background';
import BackgroundContainer from '@/shared/components/background/BackgroundContainer';
import NavBar, { Page } from '@/shared/components/navbar/index';
import ContentContainer from '@/shared/components/contentContainer';

// Import Locomotive Scroll CSS and JS directly
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { Pages } from './shared/interfaces/pages';

function App() {
  const [currentPage, setCurrentPage] = useState<Pages>(Pages.AudioEngineering);
  const [scrollY, setScrollY] = useState(0);
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
         scroll.on('scroll', (obj: { scroll: { y: number } }) => {
           setScrollY(obj.scroll.y);
         });
   
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
         <CustomCursor isHoveringNav={isHoveringNav} />
         <BackgroundContainer>
         <Background scrollY={scrollY} currentPage={currentPage} />
         </BackgroundContainer>
         <FlexBox flexDirection="column">
           <NavBar
             onMenuItemClick={() => {}}
             currentPage={currentPage}
             onHoverChange={setIsHoveringNav}
           />
           <ContentContainer ref={scrollContainerRef} data-scroll-container alignItems="center">
             <Home data-scroll-section setPage={setCurrentPage} currentPage={currentPage}/>
   
             <Services data-scroll-section />
           </ContentContainer>
         </FlexBox>
       </ThemeProvider>
     );
   }

export default App;
