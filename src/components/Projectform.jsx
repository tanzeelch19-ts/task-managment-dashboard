import { useMemo, useState } from 'react';
import FormField from '../ui/FormField';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { controlClass } from '../ui/controlClass';
import { LIMITS, PROJECT_STATUS, PROJECT_STATUS_OPTIONS } from '../utils/constants';
import { todayISO } from '../utils/dateHelpers';
import { hasErrors, validateProject } from '../utils/validators';

// Create / edit form for a project. Rendered inside a Modal on the Projects page.
export default function ProjectForm({
  initialValues,
  isEdit = false,
  submitting = false,
  submitError = '',
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(() => ({
    name: initialValues?.name ?? '',
    description: initialValues?.description ?? '',
    startDate: initialValues?.startDate ?? todayISO(),
    dueDate: initialValues?.dueDate ?? '',
    status: initialValues?.status ?? PROJECT_STATUS.ACTIVE,
  }));
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = useMemo(() => validateProject(values), [values]);
  const errorFor = (name) => (touched[name] || submitAttempted ? errors[name] : undefined);

  const inputProps = (name) => ({
    id: `project-${name}`,
    className: controlClass,
    name,
    value: values[name],
    onChange: (event) => setValues((prev) => ({ ...prev, [name]: event.target.value })),
    onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    'aria-invalid': errorFor(name) ? 'true' : undefined,
    'aria-describedby': errorFor(name) ? `project-${name}-error` : undefined,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (hasErrors(errors)) {
      const firstInvalid = Object.keys(values).find((name) => errors[name]);
      document.getElementById(`project-${firstInvalid}`)?.focus();
      return;
    }

    onSubmit({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      {submitError && <Alert>{submitError}</Alert>}

      <FormField id="project-name" label="Project name" required error={errorFor('name')}>
        <input type="text" placeholder="e.g. Website Redesign" {...inputProps('name')} />
      </FormField>

      <FormField
        id="project-description"
        label="Description"
        error={errorFor('description')}
        hint={`Optional. Up to ${LIMITS.DESCRIPTION_MAX} characters.`}
      >
        <textarea rows={3} placeholder="What is this project about?" {...inputProps('description')} />
      </FormField>

      <div className="grid gap-[18px] md:grid-cols-3">
        <FormField id="project-startDate" label="Start date" required error={errorFor('startDate')}>
          <input type="date" {...inputProps('startDate')} />
        </FormField>

        <FormField id="project-dueDate" label="Due date" required error={errorFor('dueDate')}>
          <input type="date" {...inputProps('dueDate')} />
        </FormField>

        <FormField id="project-status" label="Status" required error={errorFor('status')}>
          <select {...inputProps('status')}>
            {PROJECT_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="mt-1 flex flex-wrap justify-end gap-2.5">
        <Button variant="secondary" onClick={onCancel} disabled={submitting} className="max-md:flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="max-md:flex-1">
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
        </Button>
      </div>
    </form>
  );
}