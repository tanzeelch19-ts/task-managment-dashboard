// Friendly message shown when a list has nothing to display.
//   action  optional, e.g. a "Create task" button
//   bare    no dashed border and less padding (use it inside a Card)
export default function EmptyState({ title, message, action, bare = false }) {
  return (
    <div
      className={`flex flex-col items-center text-center ${
        bare
          ? 'px-3 py-7'
          : 'rounded-card border-[1.5px] border-dashed border-line-strong bg-white px-5 py-[52px]'
      }`}
    >
      <div
        className="mb-4 grid size-[60px] place-items-center rounded-[20px] bg-primary-soft text-primary"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        </svg>
      </div>
      <h3 className="text-[1.12rem] font-bold tracking-tight">{title}</h3>
      {message && <p className="mt-1.5 max-w-[44ch] text-muted">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}