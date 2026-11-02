import { useMemo, useState } from 'react';
import FormField from '../ui/FormField';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { controlClass } from '../ui/controlClass';
import {
  LIMITS,
  TASK_PRIORITY,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS,
  TASK_STATUS_OPTIONS,
} from '../utils/constants';
import { hasErrors, validateTask } from '../utils/validators';

const EMPTY_TASK = {
  title: '',
  description: '',
  projectId: '',
  priority: TASK_PRIORITY.MEDIUM,
  status: TASK_STATUS.TODO,
  dueDate: '',
  assignee: '',
};

/**
 * One form for BOTH creating and editing a task.
 *
 *   Create: <TaskForm projects={...} onSubmit={...} />
 *   Edit:   <TaskForm projects={...} initialValues={task} isEdit onSubmit={...} />
 *
 * In edit mode the existing values are pre-filled. Errors are only shown for
 * fields the user has touched (or after pressing Save), so the form does not
 * shout at people before they start typing.
 */
export default function TaskForm({
  projects,
  initialValues,
  isEdit = false,
  submitting = false,
  submitError = '',
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState({ ...EMPTY_TASK, ...pickFormFields(initialValues) });
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Recomputed from the current values on every change.
  const errors = useMemo(
    () => validateTask(values, { originalDueDate: isEdit ? initialValues?.dueDate : undefined }),
    [values, isEdit, initialValues],
  );

  const errorFor = (name) => (touched[name] || submitAttempted ? errors[name] : undefined);

  // Props shared by every input: value, change/blur handlers and ARIA wiring.
  const inputProps = (name) => ({
    id: `task-${name}`,
    className: controlClass,
    name,
    value: values[name],
    onChange: (event) => setValues((prev) => ({ ...prev, [name]: event.target.value })),
    onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    'aria-invalid': errorFor(name) ? 'true' : undefined,
    'aria-describedby': errorFor(name) ? `task-${name}-error` : undefined,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (hasErrors(errors)) {
      // Move focus to the first field with a problem.
      const firstInvalid = Object.keys(EMPTY_TASK).find((name) => errors[name]);
      document.getElementById(`task-${firstInvalid}`)?.focus();
      return;
    }

    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      assignee: values.assignee.trim(),
    });
  };

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      {submitError && <Alert>{submitError}</Alert>}

      <FormField id="task-title" label="Title" required error={errorFor('title')}>
        <input
          type="text"
          maxLength={LIMITS.TITLE_MAX + 20}
          placeholder="e.g. Build login page"
          {...inputProps('title')}
        />
      </FormField>

      <FormField
        id="task-description"
        label="Description"
        error={errorFor('description')}
        hint={`Optional. Up to ${LIMITS.DESCRIPTION_MAX} characters.`}
      >
        <textarea rows={4} placeholder="What needs to be done?" {...inputProps('description')} />
      </FormField>

      <div className="grid gap-[18px] md:grid-cols-2">
        <FormField id="task-projectId" label="Project" required error={errorFor('projectId')}>
          <select {...inputProps('projectId')}>
            <option value="">Select a project…</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="task-assignee" label="Assignee" required error={errorFor('assignee')}>
          <input type="text" placeholder="e.g. Ayesha Khan" {...inputProps('assignee')} />
        </FormField>
      </div>

      <div className="grid gap-[18px] md:grid-cols-3">
        <FormField id="task-priority" label="Priority" required error={errorFor('priority')}>
          <select {...inputProps('priority')}>
            {TASK_PRIORITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="task-status" label="Status" required error={errorFor('status')}>
          <select {...inputProps('status')}>
            {TASK_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="task-dueDate" label="Due date" required error={errorFor('dueDate')}>
          <input type="date" {...inputProps('dueDate')} />
        </FormField>
      </div>

      <div className="mt-1 flex flex-wrap justify-end gap-2.5">
        <Button variant="secondary" onClick={onCancel} disabled={submitting} className="max-md:flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="max-md:flex-1">
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  );
}

// Keep only the fields the form edits (drops id, createdAt, updatedAt).
function pickFormFields(task) {
  if (!task) return {};
  return Object.fromEntries(Object.keys(EMPTY_TASK).map((key) => [key, task[key] ?? EMPTY_TASK[key]]));
}