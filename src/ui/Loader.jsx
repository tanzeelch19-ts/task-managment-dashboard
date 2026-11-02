// Spinner shown while data is being fetched.
export default function Loader({ label = 'Loading…' }) {
  return (
    <div
      className="flex items-center justify-center gap-3 px-4 py-[72px] font-medium text-muted"
      role="status"
      aria-live="polite"
    >
      <span
        className="size-6 animate-spin rounded-full border-[3px] border-[#ddd5f3] border-t-primary"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}