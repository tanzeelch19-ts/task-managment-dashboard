import { useCallback, useState } from 'react';

/**
 * Handles the "click delete -> confirm dialog -> delete" flow.
 *
 *   const del = useConfirmDelete(async (task) => { await removeTask(task.id); });
 *   <button onClick={() => del.ask(task)}>Delete</button>
 *   {del.target && <ConfirmDialog onConfirm={del.confirm} onCancel={del.cancel}
 *                                 busy={del.busy} error={del.error} ... />}
 *
 * `target` is the item waiting for confirmation (null = dialog closed).
 */
export default function useConfirmDelete(onDelete) {
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const ask = useCallback((item) => {
    setError('');
    setTarget(item);
  }, []);

  const cancel = useCallback(() => {
    if (!busy) setTarget(null);
  }, [busy]);

  const confirm = useCallback(async () => {
    if (!target) return;
    setBusy(true);
    setError('');
    try {
      await onDelete(target);
      setTarget(null);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }, [target, onDelete]);

  return { target, busy, error, ask, cancel, confirm };
}