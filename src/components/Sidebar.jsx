import { NavLink } from 'react-router-dom';
import { resetLocalData } from '../services/localStorageDb';
import { USE_API } from '../services/apiClient';

const LINKS = [
  { to: '/', label: 'Dashboard', end: true, icon: 'M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 13h7v8H3z' },
  { to: '/projects', label: 'Projects', icon: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { to: '/tasks', label: 'Tasks', icon: 'M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9' },
];

// The active link gets a lighter background and a short accent bar on the left edge.
const LINK_BASE =
  'relative flex items-center gap-3 rounded-xl px-3.5 py-[11px] font-semibold no-underline transition-colors';
const LINK_ACTIVE =
  "bg-white/13 text-white before:absolute before:inset-y-2.5 before:-left-4 before:w-1 before:rounded-r-[4px] before:bg-linear-to-b before:from-[#c084fc] before:to-[#f0abfc] before:content-['']";
const LINK_IDLE = 'text-white/70 hover:bg-white/7 hover:text-white';

// Left navigation. On small screens it slides in over the page; `open` controls that.
export default function Sidebar({ open, onNavigate }) {
  const handleReset = () => {
    if (window.confirm('Reset all projects and tasks back to the sample data?')) {
      resetLocalData();
      window.location.assign('/');
    }
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`z-40 flex shrink-0 flex-col justify-between overflow-y-auto bg-shell pt-2 pr-3.5 pb-[18px] pl-4 text-white/70 transition-transform max-lg:fixed max-lg:top-16 max-lg:bottom-0 max-lg:left-0 max-lg:w-[min(290px,84vw)] lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-61 ${
          open ? '' : 'max-lg:-translate-x-full'
        }`}
      >
        <nav aria-label="Main navigation">
          <ul className="grid gap-1">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={onNavigate}
                  className={({ isActive }) => `${LINK_BASE} ${isActive ? LINK_ACTIVE : LINK_IDLE}`}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={link.icon} />
                  </svg>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-2 rounded-[14px] bg-white/6 p-3.5 text-[0.8rem] text-white/70">
          <p>
            Data source: <strong className="text-white">{USE_API ? 'REST API' : 'localStorage'}</strong>
          </p>
          {!USE_API && (
            <button
              type="button"
              className="justify-self-start bg-transparent p-0 text-[0.8rem] font-semibold text-[#e9d5ff] underline underline-offset-[3px] hover:text-white"
              onClick={handleReset}
            >
              Reset sample data
            </button>
          )}
        </div>
      </aside>

      {/* Dark overlay behind the mobile menu; tapping it closes the menu. */}
      {open && (
        <div
          className="fixed inset-x-0 top-16 bottom-0 z-30 bg-[rgb(18_6_36/0.55)] lg:hidden"
          onClick={onNavigate}
          aria-hidden="true"
        />
      )}
    </>
  );
}