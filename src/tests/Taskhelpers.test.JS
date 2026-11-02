import { describe, expect, it } from 'vitest';
import { ALL, DEFAULT_TASK_FILTERS } from '../utils/constants';
import { daysFromNow, isValidISODate } from '../utils/dateHelpers';
import { filterAndSortTasks, getProjectProgress, getTaskStats, isOverdue } from '../utils/taskHelpers';

const make = (overrides) => ({
  id: 'x',
  title: 'Task',
  projectId: 'p1',
  priority: 'Medium',
  status: 'Todo',
  dueDate: daysFromNow(3),
  createdAt: '2030-01-01T00:00:00.000Z',
  ...overrides,
});

describe('isValidISODate', () => {
  it('accepts real dates and rejects impossible ones', () => {
    expect(isValidISODate('2028-02-29')).toBe(true);
    expect(isValidISODate('2026-02-31')).toBe(false);
    expect(isValidISODate('2026-13-01')).toBe(false);
    expect(isValidISODate('05/01/2026')).toBe(false);
    expect(isValidISODate('')).toBe(false);
  });
});

describe('isOverdue', () => {
  it('is true for an open task with a past due date', () => {
    expect(isOverdue(make({ dueDate: daysFromNow(-1) }))).toBe(true);
  });

  it('is false for a finished task, or one due today or later', () => {
    expect(isOverdue(make({ dueDate: daysFromNow(-5), status: 'Done' }))).toBe(false);
    expect(isOverdue(make({ dueDate: daysFromNow(0) }))).toBe(false);
  });
});

describe('getTaskStats and getProjectProgress', () => {
  const tasks = [make({ status: 'Todo' }), make({ status: 'In Progress' }), make({ status: 'Done' }), make({ status: 'Done' })];

  it('counts tasks by status', () => {
    expect(getTaskStats(tasks)).toEqual({ total: 4, pending: 1, inProgress: 1, completed: 2 });
  });

  it('calculates progress as a rounded percentage', () => {
    expect(getProjectProgress(tasks)).toBe(50);
    expect(getProjectProgress([])).toBe(0);
  });
});

describe('filterAndSortTasks', () => {
  const tasks = [
    make({ id: 'a', title: 'Design login', status: 'Todo', priority: 'High', projectId: 'p1', dueDate: '2030-03-01', createdAt: '2030-01-01' }),
    make({ id: 'b', title: 'Write API docs', status: 'Done', priority: 'Low', projectId: 'p2', dueDate: '2030-01-01', createdAt: '2030-01-02' }),
    make({ id: 'c', title: 'Fix login bug', status: 'Todo', priority: 'High', projectId: 'p2', dueDate: '2030-02-01', createdAt: '2030-01-03' }),
  ];
  const ids = (list) => list.map((task) => task.id);

  it('searches titles without caring about case', () => {
    expect(ids(filterAndSortTasks(tasks, { ...DEFAULT_TASK_FILTERS, search: 'LOGIN' }))).toEqual(['c', 'a']);
  });

  it('combines search, status, priority and project filters', () => {
    const filters = { ...DEFAULT_TASK_FILTERS, search: 'login', status: 'Todo', priority: 'High', projectId: 'p2' };
    expect(ids(filterAndSortTasks(tasks, filters))).toEqual(['c']);
  });

  it('sorts by due date in both directions', () => {
    expect(ids(filterAndSortTasks(tasks, { ...DEFAULT_TASK_FILTERS, sortBy: 'dueDate-asc' }))).toEqual(['b', 'c', 'a']);
    expect(ids(filterAndSortTasks(tasks, { ...DEFAULT_TASK_FILTERS, sortBy: 'dueDate-desc' }))).toEqual(['a', 'c', 'b']);
  });

  it('sorts by creation date', () => {
    expect(ids(filterAndSortTasks(tasks, { ...DEFAULT_TASK_FILTERS, sortBy: 'createdAt-desc' }))).toEqual(['c', 'b', 'a']);
  });

  it('does not change the original array', () => {
    const copy = [...tasks];
    filterAndSortTasks(tasks, { ...DEFAULT_TASK_FILTERS, status: ALL, sortBy: 'dueDate-desc' });
    expect(tasks).toEqual(copy);
  });
});