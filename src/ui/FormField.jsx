// Label + input + error message wrapper used by TaskForm and ProjectForm.
// The input itself is passed as `children`; `id` must match the input's id.
// The input turns red by itself when it has aria-invalid="true" (see controlClass).
export default function FormField({ id, label, required, error, hint, children }) {
  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
        {required && (
          <span className="text-danger" aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className="text-[0.8rem] text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="text-[0.82rem] font-semibold text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}