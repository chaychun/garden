import React, { useState, useEffect, useRef } from 'react';

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canCollapseByScroll, setCanCollapseByScroll] = useState(true);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Find the scroll container (ScrollArea viewport)
  useEffect(() => {
    const findScrollContainer = () => {
      const scrollArea = document.querySelector('[data-scroll-area-id]');
      if (scrollArea) {
        const viewport = scrollArea.querySelector('.scroll-area-viewport');
        if (viewport) {
          scrollContainerRef.current = viewport as HTMLElement;
        }
      }
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', findScrollContainer);
    } else {
      findScrollContainer();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', findScrollContainer);
    };
  }, []);

  // Handle horizontal scroll behavior (desktop only)
  useEffect(() => {
    if (isMobile || !scrollContainerRef.current) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;
      
      // If we're at the start (scrollLeft === 0)
      if (scrollLeft === 0) {
        // Reopen sidebar when back at start
        if (!isExpanded) {
          setIsExpanded(true);
        }
        // Re-enable scroll-based collapse when at start
        setCanCollapseByScroll(true);
      } else {
        // Only collapse if we're allowed to and the sidebar is expanded
        if (canCollapseByScroll && isExpanded) {
          setIsExpanded(false);
          // Disable further scroll-based collapse until back at start
          setCanCollapseByScroll(false);
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener('scroll', handleScroll);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [isExpanded, isMobile, canCollapseByScroll]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    // If manually expanding, only re-enable scroll collapse if at start
    if (!isExpanded) {
      const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;
      setCanCollapseByScroll(scrollLeft === 0);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile hamburger button */}
        <button
          onClick={toggleMobileMenu}
          className="fixed top-6 right-6 z-50 p-2 bg-blue-500 text-white rounded shadow-lg"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile full-screen menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-blue-500 p-6">
            <div className="text-white text-lg">
              Mobile Menu Content
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="w-full">
          {children}
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <>
      {/* Fixed Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-green-500 transition-all duration-300 z-30 shadow-lg ${
          isExpanded ? 'w-[400px]' : 'w-16'
        }`}
      >
        <div className="p-6 text-white h-full">
          {isExpanded ? (
            <div>
              <div className="text-lg font-bold mb-4">Sidebar</div>
              <div className="text-sm mb-4">Expanded content goes here</div>
              <div className="text-sm mb-4">This is a test sidebar with green background</div>
              <button
                onClick={toggleSidebar}
                className="mt-4 px-3 py-1 bg-white text-green-500 rounded text-sm hover:bg-gray-100 transition-colors"
              >
                Collapse
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="writing-mode-vertical text-center">
                <div className="transform -rotate-90 whitespace-nowrap font-bold">
                  Sidebar
                </div>
                <button
                  onClick={toggleSidebar}
                  className="mt-4 px-2 py-1 bg-white text-green-500 rounded text-xs transform -rotate-90 block hover:bg-gray-100 transition-colors"
                >
                  Expand
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content with left margin to account for sidebar */}
      <div 
        className={`transition-all duration-300 bg-gray-50 min-h-screen ${
          isExpanded ? 'ml-[400px]' : 'ml-16'
        }`}
      >
        {children}
      </div>
    </>
  );
}