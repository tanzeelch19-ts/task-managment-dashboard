import { USE_API, request } from './apiClient';
import { localCollection } from './localStorageDb';

const localTasks = localCollection('tasks', 'task');

const ENDPOINT = '/api/tasks/';

/** GET /api/tasks/ */
export function getTasks() {
  return USE_API ? request(ENDPOINT) : localTasks.getAll();
}

/** POST /api/tasks/ */
export function createTask(data) {
  return USE_API ? request(ENDPOINT, { method: 'POST', body: data }) : localTasks.create(data);
}

/** PATCH /api/tasks/{id}/ */
export function updateTask(id, changes) {
  return USE_API
    ? request(`${ENDPOINT}${id}/`, { method: 'PATCH', body: changes })
    : localTasks.update(id, changes);
}

/** DELETE /api/tasks/{id}/ */
export function deleteTask(id) {
  return USE_API ? request(`${ENDPOINT}${id}/`, { method: 'DELETE' }) : localTasks.remove(id);
}