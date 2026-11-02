import Button from './Button';

// Banner for errors and success messages.
//   type      "error" (default) | "success"
//   onRetry   shows a "Try again" button (for failed data loads)
//   onDismiss shows a close button (for flash messages)
const TONES = {
  error: 'border-[#f6b4c0] bg-danger-soft text-danger',
  success: 'border-[#8fdcba] bg-success-soft text-success',
};

export default function Alert({ type = 'error', children, onRetry, onDismiss }) {
  return (
    <div
      className={`mb-[18px] flex items-center gap-3 rounded-control border px-4 py-[13px] font-medium ${TONES[type]}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <span className="flex-1">{children}</span>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
      {onDismiss && (
        <button
          type="button"
          className="px-1.5 text-2xl leading-none opacity-70 hover:opacity-100"
          onClick={onDismiss}
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
}