import { ALL, DEFAULT_TASK_FILTERS, TASK_STATUS } from './constants';
import { daysUntil, todayISO } from './dateHelpers';

// Pure functions: given data in, they return data out and never touch React
// state. That makes them easy to test and easy to explain.

/** Counts used by the dashboard cards. */
export function getTaskStats(tasks) {
  const countBy = (status) => tasks.filter((t) => t.status === status).length;
  return {
    total: tasks.length,
    pending: countBy(TASK_STATUS.TODO),
    inProgress: countBy(TASK_STATUS.IN_PROGRESS),
    completed: countBy(TASK_STATUS.DONE),
  };
}

/** { Todo: [...], "In Progress": [...], Done: [...] } */
export function groupTasksByStatus(tasks) {
  const groups = {
    [TASK_STATUS.TODO]: [],
    [TASK_STATUS.IN_PROGRESS]: [],
    [TASK_STATUS.DONE]: [],
  };
  tasks.forEach((task) => {
    if (groups[task.status]) groups[task.status].push(task);
  });
  return groups;
}

/** Most recently updated tasks first. */
export function getRecentTasks(tasks, limit = 5) {
  return [...tasks]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit);
}

/** A task is overdue when it is not done and its due date is before today. */
export function isOverdue(task) {
  return task.status !== TASK_STATUS.DONE && task.dueDate < todayISO();
}

/**
 * What needs attention right now (used by the dashboard hero):
 *   overdue     open tasks whose due date has passed
 *   dueSoon     open tasks due from today up to 7 days ahead
 *   completion  % of all tasks that are Done
 */
export function getAttentionSummary(tasks) {
  const open = tasks.filter((task) => task.status !== TASK_STATUS.DONE);
  const overdue = open.filter((task) => isOverdue(task)).length;
  const dueSoon = open.filter((task) => {
    const days = daysUntil(task.dueDate);
    return days !== null && days >= 0 && days <= 7;
  }).length;
  const completion = tasks.length
    ? Math.round(((tasks.length - open.length) / tasks.length) * 100)
    : 0;
  return { overdue, dueSoon, completion };
}

/** Percentage (0-100) of a project's tasks that are Done. */
export function getProjectProgress(tasks) {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === TASK_STATUS.DONE).length;
  return Math.round((done / tasks.length) * 100);
}

/** Tasks that belong to one project. */
export function getTasksForProject(tasks, projectId) {
  return tasks.filter((task) => String(task.projectId) === String(projectId));
}

/** Turn a list of projects into an { id: project } lookup for O(1) access. */
export function indexById(items) {
  return items.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});
}

/** True when any filter differs from its default value. */
export function hasActiveFilters(filters) {
  return Object.keys(DEFAULT_TASK_FILTERS).some(
    (key) => filters[key] !== DEFAULT_TASK_FILTERS[key],
  );
}

/**
 * Search + filter + sort in one pass so all controls work together.
 *
 * 1. search     -> title contains the text (case-insensitive)
 * 2. status     -> exact match, or ALL
 * 3. priority   -> exact match, or ALL
 * 4. projectId  -> exact match, or ALL
 * 5. sortBy     -> "<field>-<asc|desc>" e.g. "dueDate-asc"
 */
export function filterAndSortTasks(tasks, filters) {
  const query = filters.search.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    if (query && !task.title.toLowerCase().includes(query)) return false;
    if (filters.status !== ALL && task.status !== filters.status) return false;
    if (filters.priority !== ALL && task.priority !== filters.priority) return false;
    // String() on both sides: the <select> gives a string, but a backend may use numeric ids.
    if (filters.projectId !== ALL && String(task.projectId) !== String(filters.projectId)) return false;
    return true;
  });

  const [field, direction] = filters.sortBy.split('-');
  const factor = direction === 'desc' ? -1 : 1;

  return filtered.sort((a, b) => {
    const valueA = a[field] ?? '';
    const valueB = b[field] ?? '';
    if (valueA < valueB) return -1 * factor;
    if (valueA > valueB) return 1 * factor;
    return 0;
  });
}