// Single source of truth for every fixed value used in the app.
// Forms, filters, badges and validators all read from here, so a label
// only has to be changed in one place.

export const PROJECT_STATUS = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
};

export const TASK_STATUS = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const PROJECT_STATUS_OPTIONS = Object.values(PROJECT_STATUS);
export const TASK_STATUS_OPTIONS = Object.values(TASK_STATUS);
export const TASK_PRIORITY_OPTIONS = Object.values(TASK_PRIORITY);

export const SORT_OPTIONS = [
  { value: 'dueDate-asc', label: 'Earliest due date' },
  { value: 'dueDate-desc', label: 'Latest due date' },
  { value: 'createdAt-desc', label: 'Newest created' },
  { value: 'createdAt-asc', label: 'Oldest created' },
];

export const ALL = 'all';

// Filters used by the task list. "all" means "do not filter on this field".
export const DEFAULT_TASK_FILTERS = {
  search: '',
  status: ALL,
  priority: ALL,
  projectId: ALL,
  sortBy: 'dueDate-asc',
};

// Field length limits shared by the validators and the form inputs.
export const LIMITS = {
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  NAME_MIN: 3,
  NAME_MAX: 80,
  DESCRIPTION_MAX: 500,
  ASSIGNEE_MIN: 2,
  ASSIGNEE_MAX: 60,
};