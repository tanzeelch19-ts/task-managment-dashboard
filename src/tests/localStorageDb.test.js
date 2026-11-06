import { describe, expect, it } from 'vitest';
import { sanitizeRecord } from '../services/localStorageDb';

const validTask = {
  id: 'task-1',
  title: 'Build login page',
  description: '',
  projectId: 'proj-1',
  priority: 'High',
  status: 'In Progress',
  dueDate: '2030-01-10',
  assignee: 'Ayesha Khan',
};

describe('sanitizeRecord (tasks)', () => {
  it('keeps a valid task unchanged', () => {
    expect(sanitizeRecord('tasks', validTask)).toEqual(validTask);
  });

  it('replaces an object status with the default Todo instead of crashing', () => {
    const result = sanitizeRecord('tasks', { ...validTask, status: {} });
    expect(result.status).toBe('Todo');
    expect(result.title).toBe(validTask.title);
  });

  it('replaces an unknown priority with Medium', () => {
    expect(sanitizeRecord('tasks', { ...validTask, priority: 'Urgent' }).priority).toBe('Medium');
  });

  it('drops a record without an id', () => {
    expect(sanitizeRecord('tasks', { ...validTask, id: undefined })).toBeNull();
  });

  it('drops a record whose title is not text', () => {
    expect(sanitizeRecord('tasks', { ...validTask, title: 42 })).toBeNull();
  });

  it('drops values that are not objects', () => {
    expect(sanitizeRecord('tasks', 'not a task')).toBeNull();
    expect(sanitizeRecord('tasks', null)).toBeNull();
  });
});

describe('sanitizeRecord (projects)', () => {
  it('replaces an invalid project status with Active', () => {
    const project = { id: 'proj-1', name: 'Website', status: 'Archived' };
    expect(sanitizeRecord('projects', project).status).toBe('Active');
  });

  it('keeps a valid project status', () => {
    const project = { id: 'proj-1', name: 'Website', status: 'On Hold' };
    expect(sanitizeRecord('projects', project).status).toBe('On Hold');
  });
});
