import { getSeedProjects, getSeedTasks } from '../data/seedData';
import {
  PROJECT_STATUS,
  PROJECT_STATUS_OPTIONS,
  TASK_PRIORITY,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS,
  TASK_STATUS_OPTIONS,
} from '../utils/constants';

// A tiny "database" on top of localStorage. It is used when no backend is
// configured, so projects and tasks survive a browser refresh.
//
// Each collection is stored as a JSON array under its own key. A short fake
// delay is added so loading indicators are visible, like with a real API.

const STORAGE_KEYS = {
  projects: 'taskflow.projects',
  tasks: 'taskflow.tasks',
};

const SEEDS = {
  projects: getSeedProjects,
  tasks: getSeedTasks,
};

// Allowed values for the fields that have a fixed list (see utils/constants.js).
const ALLOWED_VALUES = {
  projects: { status: PROJECT_STATUS_OPTIONS },
  tasks: { status: TASK_STATUS_OPTIONS, priority: TASK_PRIORITY_OPTIONS },
};

// Used when a saved record has a missing or wrong value for one of those fields.
const DEFAULT_VALUES = {
  projects: { status: PROJECT_STATUS.ACTIVE },
  tasks: { status: TASK_STATUS.TODO, priority: TASK_PRIORITY.MEDIUM },
};

/**
 * Returns a safe copy of one saved record, or null when it cannot be used at all
 * (no id, or no text title/name). A wrong enum value (e.g. status: {} or
 * priority: "Urgent") is replaced with the default instead of dropping the task.
 * Exported so it can be unit tested.
 */
export function sanitizeRecord(name, item) {
  if (!item || typeof item !== 'object' || item.id === undefined) return null;
  if (typeof (item.title ?? item.name) !== 'string') return null;

  const record = { ...item };
  Object.entries(ALLOWED_VALUES[name]).forEach(([field, options]) => {
    if (!options.includes(record[field])) {
      record[field] = DEFAULT_VALUES[name][field];
    }
  });
  return record;
}

const FAKE_LATENCY_MS = 350;
const wait = (ms = FAKE_LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

function readCollection(name) {
  const key = STORAGE_KEYS[name];
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      // First run: save the sample data so it persists from now on.
      const seed = SEEDS[name]();
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Repair or drop damaged entries so one bad record cannot crash the pages.
    return parsed.map((item) => sanitizeRecord(name, item)).filter(Boolean);
  } catch {
    throw new Error('Could not read saved data from the browser storage.');
  }
}

function writeCollection(name, items) {
  try {
    localStorage.setItem(STORAGE_KEYS[name], JSON.stringify(items));
  } catch {
    throw new Error('Could not save data. The browser storage may be full or disabled.');
  }
}

function generateId(prefix) {
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random}`;
}

/**
 * Returns CRUD helpers for one collection ("projects" or "tasks").
 * The method names mirror the REST verbs used by the real API.
 */
export function localCollection(name, idPrefix) {
  return {
    async getAll() {
      await wait();
      return readCollection(name);
    },

    async create(data) {
      await wait();
      const now = new Date().toISOString();
      const item = { ...data, id: generateId(idPrefix), createdAt: now, updatedAt: now };
      writeCollection(name, [...readCollection(name), item]);
      return item;
    },

    async update(id, changes) {
      await wait();
      const items = readCollection(name);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) throw new Error('Item not found. It may have been deleted.');
      const updated = {
        ...items[index],
        ...changes,
        id, // never allow the id to change
        updatedAt: new Date().toISOString(),
      };
      items[index] = updated;
      writeCollection(name, items);
      return updated;
    },

    async remove(id) {
      await wait();
      const items = readCollection(name);
      if (!items.some((item) => item.id === id)) {
        throw new Error('Item not found. It may have been deleted already.');
      }
      writeCollection(name, items.filter((item) => item.id !== id));
      return null;
    },

    /** Delete every item matching a predicate (used for cascading deletes). */
    async removeWhere(predicate) {
      const items = readCollection(name);
      writeCollection(name, items.filter((item) => !predicate(item)));
    },
  };
}

/** Wipe saved data so the sample data is created again on next load. */
export function resetLocalData() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}