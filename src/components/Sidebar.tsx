import React, { useState, useEffect, useRef } from 'react';

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  // Handle horizontal scroll to collapse sidebar (desktop only)
  useEffect(() => {
    if (isMobile || !scrollContainerRef.current) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;
      
      // If we start scrolling horizontally, collapse the sidebar
      if (scrollLeft > 0 && isExpanded) {
        setIsExpanded(false);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener('scroll', handleScroll);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [isExpanded, isMobile]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
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
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <div
        className={`sticky top-0 h-screen bg-green-500 transition-all duration-300 flex-shrink-0 shadow-lg ${
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

      {/* Main content */}
      <div className="flex-1 min-w-0 bg-gray-50">
        {children}
      </div>
    </div>
  );
}