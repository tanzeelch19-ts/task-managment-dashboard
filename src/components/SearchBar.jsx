import { controlClass } from '../ui/controlClass';

// Controlled search box. The parent owns the text; we just report changes.
export default function SearchBar({ value, onChange, placeholder = 'Search tasks by title…' }) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="search"
        className={`${controlClass} pl-[42px]`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search tasks by title"
      />
    </div>
  );
}