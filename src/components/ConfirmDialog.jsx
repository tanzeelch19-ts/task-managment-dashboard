import Modal from '../ui/Modal';
import Alert from '../ui/Alert';
import Button from '../ui/Button';

// "Are you sure?" dialog. Used before deleting a project or a task.
export default function ConfirmDialog({
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  busy = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="mb-[22px] [overflow-wrap:anywhere]">{message}</p>
      {error && <Alert>{error}</Alert>}
      <div className="flex flex-wrap justify-end gap-2.5">
        <Button variant="secondary" onClick={onCancel} disabled={busy} className="max-md:flex-1">
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={busy} className="max-md:flex-1">
          {busy ? 'Deleting…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}