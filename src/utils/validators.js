import {
  LIMITS,
  PROJECT_STATUS_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from './constants';
import { isValidISODate, todayISO } from './dateHelpers';

// Every validator returns an object of { fieldName: "error message" }.
// An empty object means the values are valid.

/**
 * Validate task form values.
 *
 * @param {object} values            current form values
 * @param {object} [options]
 * @param {string} [options.originalDueDate]  due date the task had before editing.
 *        A past due date is only rejected when the user *changes* it to a past
 *        day, so an already-overdue task can still be edited.
 */
export function validateTask(values, { originalDueDate } = {}) {
  const errors = {};
  const title = values.title?.trim() ?? '';
  const assignee = values.assignee?.trim() ?? '';
  const description = values.description?.trim() ?? '';

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length < LIMITS.TITLE_MIN) {
    errors.title = `Title must be at least ${LIMITS.TITLE_MIN} characters.`;
  } else if (title.length > LIMITS.TITLE_MAX) {
    errors.title = `Title must be ${LIMITS.TITLE_MAX} characters or fewer.`;
  }

  if (description.length > LIMITS.DESCRIPTION_MAX) {
    errors.description = `Description must be ${LIMITS.DESCRIPTION_MAX} characters or fewer.`;
  }

  if (!values.projectId) {
    errors.projectId = 'Please choose a project.';
  }

  if (!TASK_PRIORITY_OPTIONS.includes(values.priority)) {
    errors.priority = 'Please choose a priority.';
  }

  if (!TASK_STATUS_OPTIONS.includes(values.status)) {
    errors.status = 'Please choose a status.';
  }

  if (!assignee) {
    errors.assignee = 'Assignee is required.';
  } else if (assignee.length < LIMITS.ASSIGNEE_MIN) {
    errors.assignee = `Assignee must be at least ${LIMITS.ASSIGNEE_MIN} characters.`;
  } else if (assignee.length > LIMITS.ASSIGNEE_MAX) {
    errors.assignee = `Assignee must be ${LIMITS.ASSIGNEE_MAX} characters or fewer.`;
  }

  if (!values.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else if (!isValidISODate(values.dueDate)) {
    errors.dueDate = 'Please enter a valid date.';
  } else if (values.dueDate > '2100-12-31') {
    errors.dueDate = 'Due date is too far in the future.';
  } else if (values.dueDate < todayISO() && values.dueDate !== originalDueDate) {
    errors.dueDate = 'Due date cannot be in the past.';
  }

  return errors;
}

/** Validate project form values. */
export function validateProject(values) {
  const errors = {};
  const name = values.name?.trim() ?? '';
  const description = values.description?.trim() ?? '';

  if (!name) {
    errors.name = 'Project name is required.';
  } else if (name.length < LIMITS.NAME_MIN) {
    errors.name = `Name must be at least ${LIMITS.NAME_MIN} characters.`;
  } else if (name.length > LIMITS.NAME_MAX) {
    errors.name = `Name must be ${LIMITS.NAME_MAX} characters or fewer.`;
  }

  if (description.length > LIMITS.DESCRIPTION_MAX) {
    errors.description = `Description must be ${LIMITS.DESCRIPTION_MAX} characters or fewer.`;
  }

  if (!values.startDate) {
    errors.startDate = 'Start date is required.';
  } else if (!isValidISODate(values.startDate)) {
    errors.startDate = 'Please enter a valid date.';
  }

  if (!values.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else if (!isValidISODate(values.dueDate)) {
    errors.dueDate = 'Please enter a valid date.';
  } else if (
    isValidISODate(values.startDate) &&
    values.dueDate < values.startDate
  ) {
    errors.dueDate = 'Due date cannot be before the start date.';
  }

  if (!PROJECT_STATUS_OPTIONS.includes(values.status)) {
    errors.status = 'Please choose a status.';
  }

  return errors;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;