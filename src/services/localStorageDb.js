import { getSeedProjects, getSeedTasks } from '../data/seedData';

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
    return Array.isArray(parsed) ? parsed : [];
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