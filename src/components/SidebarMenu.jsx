import React, { useState, useEffect, useRef } from 'react';

const SIDEBAR_WIDTH_EXPANDED = 400;
const SIDEBAR_WIDTH_COLLAPSED = 48; // enough for vertical text + padding

export default function SidebarMenu() {
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollX = useRef(0);
  const ticking = useRef(false);

  // Responsive check
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop scroll-to-collapse
  useEffect(() => {
    if (isMobile) return;
    function onScroll(e) {
      if (ticking.current) return;
      window.requestAnimationFrame(() => {
        const scrollX = window.scrollX;
        if (expanded && scrollX > 0) {
          setExpanded(false);
        }
        lastScrollX.current = scrollX;
        ticking.current = false;
      });
      ticking.current = true;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [expanded, isMobile]);

  // Expand sidebar even if not at scroll start
  function handleExpand() {
    setExpanded(true);
  }

  // Mobile hamburger
  function handleHamburger() {
    setMobileMenuOpen((v) => !v);
  }

  // Sidebar content
  const sidebarContent = (
    <div className="flex flex-col items-center justify-center h-full w-full text-white">
      <span className="text-lg font-bold">Sidebar/Menu</span>
      {!isMobile && !expanded && (
        <button className="mt-4 text-xs bg-white/20 rounded p-2" onClick={handleExpand}>
          Expand
        </button>
      )}
    </div>
  );

  // Desktop sidebar
  if (!isMobile) {
    return (
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: expanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
          background: expanded ? '#2563eb' : '#1e293b',
          zIndex: expanded ? 30 : 10,
          transition: 'width 0.2s cubic-bezier(.4,0,.2,1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {expanded ? (
          sidebarContent
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full w-full rotate-180"
            style={{ writingMode: 'vertical-rl', padding: 24 }}
          >
            <span className="text-white text-lg font-bold rotate-180">Menu</span>
            <button className="mt-4 text-xs bg-white/20 rounded p-2 rotate-180" onClick={handleExpand}>
              Expand
            </button>
          </div>
        )}
      </div>
    );
  }

  // Mobile top nav
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: '#2563eb',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <span className="text-white text-lg font-bold">Menu</span>
        <button
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={handleHamburger}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: 28 }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#1e293b',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <span className="text-white text-2xl font-bold mb-8">Mobile Menu</span>
          <button className="text-white text-lg bg-blue-700 rounded p-4" onClick={handleHamburger}>
            Close
          </button>
        </div>
      )}
    </>
  );
}