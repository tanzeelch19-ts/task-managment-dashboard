import { useCallback, useEffect, useRef, useState } from 'react';
import * as projectService from '../services/projectService';

/**
 * Loads all projects and exposes create / update / delete helpers.
 * Works exactly like useTasks, but for projects.
 */
export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isMounted = useRef(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await projectService.getProjects();
      if (isMounted.current) setProjects(data);
    } catch (err) {
      if (isMounted.current) setError(err.message || 'Failed to load projects.');
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

  const addProject = useCallback(async (data) => {
    const created = await projectService.createProject(data);
    if (isMounted.current) setProjects((prev) => [...prev, created]);
    return created;
  }, []);

  const editProject = useCallback(async (id, changes) => {
    const updated = await projectService.updateProject(id, changes);
    if (isMounted.current) {
      setProjects((prev) => prev.map((project) => (project.id === id ? updated : project)));
    }
    return updated;
  }, []);

  const removeProject = useCallback(async (id) => {
    await projectService.deleteProject(id);
    if (isMounted.current) setProjects((prev) => prev.filter((project) => project.id !== id));
  }, []);

  return { projects, loading, error, reload, addProject, editProject, removeProject };
}