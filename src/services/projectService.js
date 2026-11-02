import { USE_API, request } from './apiClient';
import { localCollection } from './localStorageDb';

// All project data access goes through this file. Components and hooks never
// call fetch() or localStorage directly, so switching between the REST API and
// localStorage only affects this service layer.

const localProjects = localCollection('projects', 'proj');
const localTasks = localCollection('tasks', 'task');

const ENDPOINT = '/api/projects/';

/** GET /api/projects/ */
export function getProjects() {
  return USE_API ? request(ENDPOINT) : localProjects.getAll();
}

/** POST /api/projects/ */
export function createProject(data) {
  return USE_API ? request(ENDPOINT, { method: 'POST', body: data }) : localProjects.create(data);
}

/** PATCH /api/projects/{id}/ */
export function updateProject(id, changes) {
  return USE_API
    ? request(`${ENDPOINT}${id}/`, { method: 'PATCH', body: changes })
    : localProjects.update(id, changes);
}

/** DELETE /api/projects/{id}/ */
export async function deleteProject(id) {
  if (USE_API) {
    // A real backend normally deletes the project's tasks itself.
    return request(`${ENDPOINT}${id}/`, { method: 'DELETE' });
  }
  await localProjects.remove(id);
  // localStorage has no foreign keys, so remove the project's tasks manually.
  await localTasks.removeWhere((task) => task.projectId === id);
  return null;
}