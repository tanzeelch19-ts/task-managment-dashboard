import { useEffect, useId, useRef } from 'react';

// Generic dialog. Closes on Escape or a click on the dark backdrop.
// Used by ConfirmDialog and by the project create/edit form.
export default function Modal({ title, onClose, children, wide = false }) {
  const titleId = useId();
  const dialogRef = useRef(null);

  // Keep the latest onClose in a ref so the effect below can run only once
  // (on open) instead of re-focusing the dialog every time the parent re-renders.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);

    // Prevent the page behind the dialog from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[rgb(24_8_48/0.6)] p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`max-h-[calc(100vh-2rem)] w-full animate-modal-in overflow-y-auto rounded-hero bg-white shadow-pop focus:outline-none ${
          wide ? 'max-w-[700px]' : 'max-w-[470px]'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-5">
          <h2 id={titleId} className="text-xl font-extrabold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            className="size-[34px] rounded-[10px] p-0 text-2xl leading-none text-muted hover:bg-canvas hover:text-ink"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className="p-[18px] md:p-6">{children}</div>
      </div>
    </div>
  );
}