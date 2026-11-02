import { Link } from 'react-router-dom';
import Button from '../ui/Button';

// Top bar: menu button (mobile only), brand name and a quick "New task" button.
export default function Navbar({ onMenuClick, menuOpen }) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-3 bg-shell pr-4 pl-4 text-white lg:pr-6 lg:pl-5">
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-control border border-white/10 bg-transparent p-0 text-white hover:bg-white/8 lg:hidden"
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="sidebar"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <Link
        to="/"
        className="mr-auto inline-flex items-center gap-[11px] text-xl font-extrabold tracking-[-0.03em] text-white no-underline hover:text-white"
      >
        <span
          className="inline-flex size-[34px] items-center justify-center rounded-[11px] bg-linear-to-br from-[#8b5cf6] to-[#d946ef] text-white shadow-[0_6px_16px_-4px_rgb(217_70_239/0.55)]"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        TaskFlow
      </Link>

      <Button to="/tasks/new" variant="onDark" size="sm">
        + New task
      </Button>
    </header>
  );
}