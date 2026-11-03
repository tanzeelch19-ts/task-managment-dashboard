import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary';

// Shared shell for every page: top bar + sidebar + the current page (<Outlet />).
// The plum background shows around a light, rounded content panel.
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-shell">
      <Navbar menuOpen={menuOpen} onMenuClick={() => setMenuOpen((open) => !open)} />
      <div className="flex min-h-0 flex-1">
        <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        <main className="min-h-[calc(100vh-4rem)] min-w-0 flex-1 rounded-t-[22px] bg-canvas px-4 pt-[22px] pb-14 lg:rounded-tl-[28px] lg:rounded-tr-none lg:px-9 lg:pt-8 lg:pb-[72px]">
          {/* Centres the page and stops it stretching on very wide screens. */}
          <div className="mx-auto w-full max-w-[1160px]">
            {/* A new key for every page, so an error screen does not follow you to the next page. */}
            <ErrorBoundary key={pathname}>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}