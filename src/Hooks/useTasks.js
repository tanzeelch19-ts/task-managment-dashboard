import { useCallback, useEffect, useRef, useState } from 'react';
import * as taskService from '../services/taskService';

/**
 * Loads all tasks and exposes create / update / delete helpers.
 *
 * Returns:
 *   tasks, loading, error        -> state to render
 *   reload()                     -> fetch again (used by the "Try again" button)
 *   addTask(data)                -> POST, returns the created task
 *   editTask(id, changes)        -> PATCH, returns the updated task
 *   removeTask(id)               -> DELETE
 *   removeTasksByProject(id)     -> drops a deleted project's tasks from state
 *
 * The mutation helpers throw on failure so the calling form/page can show the
 * error message next to the action that failed.
 */
export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isMounted = useRef(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskService.getTasks();
      if (isMounted.current) setTasks(data);
    } catch (err) {
      if (isMounted.current) setError(err.message || 'Failed to load tasks.');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    reload();
    return () => {
      isMounted.current = false;
    };
  }, [reload]);

  const addTask = useCallback(async (data) => {
    const created = await taskService.createTask(data);
    if (isMounted.current) setTasks((prev) => [...prev, created]);
    return created;
  }, []);

  const editTask = useCallback(async (id, changes) => {
    const updated = await taskService.updateTask(id, changes);
    if (isMounted.current) {
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    }
    return updated;
  }, []);

  const removeTask = useCallback(async (id) => {
    await taskService.deleteTask(id);
    if (isMounted.current) setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const removeTasksByProject = useCallback((projectId) => {
    setTasks((prev) => prev.filter((task) => String(task.projectId) !== String(projectId)));
  }, []);

  return {
    tasks,
    loading,
    error,
    reload,
    addTask,
    editTask,
    removeTask,
    removeTasksByProject,
  };
}