import { describe, expect, it } from 'vitest';
import { daysFromNow } from '../utils/dateHelpers';
import { hasErrors, validateProject, validateTask } from '../utils/validators';

const validTask = {
  title: 'Build login page',
  description: '',
  projectId: 'proj-1',
  priority: 'Medium',
  status: 'Todo',
  dueDate: daysFromNow(5),
  assignee: 'Ayesha Khan',
};

describe('validateTask', () => {
  it('accepts a valid task', () => {
    expect(hasErrors(validateTask(validTask))).toBe(false);
  });

  it('requires title, project, assignee and due date', () => {
    const errors = validateTask({ ...validTask, title: '  ', projectId: '', assignee: '', dueDate: '' });
    expect(Object.keys(errors).sort()).toEqual(['assignee', 'dueDate', 'projectId', 'title']);
  });

  it('checks title length limits', () => {
    expect(validateTask({ ...validTask, title: 'ab' }).title).toBeDefined();
    expect(validateTask({ ...validTask, title: 'a'.repeat(101) }).title).toBeDefined();
  });

  it('rejects impossible dates', () => {
    expect(validateTask({ ...validTask, dueDate: '2030-02-31' }).dueDate).toBe('Please enter a valid date.');
  });

  it('rejects a past due date', () => {
    expect(validateTask({ ...validTask, dueDate: daysFromNow(-2) }).dueDate).toBe('Due date cannot be in the past.');
  });

  it('allows an unchanged past due date when editing', () => {
    const past = daysFromNow(-2);
    expect(validateTask({ ...validTask, dueDate: past }, { originalDueDate: past }).dueDate).toBeUndefined();
  });
});

describe('validateProject', () => {
  const validProject = { name: 'Website', description: '', startDate: '2030-01-01', dueDate: '2030-02-01', status: 'Active' };

  it('accepts a valid project', () => {
    expect(hasErrors(validateProject(validProject))).toBe(false);
  });

  it('rejects a due date before the start date', () => {
    expect(validateProject({ ...validProject, dueDate: '2029-12-31' }).dueDate).toBe(
      'Due date cannot be before the start date.',
    );
  });

  it('rejects an unknown status', () => {
    expect(validateProject({ ...validProject, status: 'Paused' }).status).toBeDefined();
  });
});