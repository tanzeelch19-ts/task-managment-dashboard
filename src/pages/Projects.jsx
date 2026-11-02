import { useMemo, useState } from 'react';
import PageHeader from '../ui/PageHeader';
import Loader from '../ui/Loader';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import Modal from '../ui/Modal';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import ConfirmDialog from '../components/ConfirmDialog';
import useProjects from '../Hooks/useProjects';
import useTasks from '../Hooks/useTasks';
import useFlash from '../Hooks/useFlash';
import useConfirmDelete from '../Hooks/useConfirmDelete';
import useDocumentTitle from '../Hooks/useDocumentTitle';

// Module 2: view all projects, create, edit, delete (with confirmation) and
// open a project. The create/edit form lives in a dialog on this page.
export default function Projects() {
  useDocumentTitle('Projects');

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    reload: reloadProjects,
    addProject,
    editProject,
    removeProject,
  } = useProjects();
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    reload: reloadTasks,
    removeTasksByProject,
  } = useTasks();

  const [flash, setFlash] = useFlash();

  // formState: null = dialog closed, { project: null } = create, { project } = edit.
  const [formState, setFormState] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const loading = projectsLoading || tasksLoading;
  const error = projectsError || tasksError;

  // { projectId: [tasks...] } so each card can show its own progress.
  const tasksByProject = useMemo(() => {
    const groups = {};
    tasks.forEach((task) => {
      if (!groups[task.projectId]) groups[task.projectId] = [];
      groups[task.projectId].push(task);
    });
    return groups;
  }, [tasks]);

  // Newest projects first, so a freshly created project is easy to spot.
  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')),
    [projects],
  );

  const openCreate = () => {
    setSaveError('');
    setFormState({ project: null });
  };

  const openEdit = (project) => {
    setSaveError('');
    setFormState({ project });
  };

  const closeForm = () => {
    if (!saving) setFormState(null);
  };

  const handleSave = async (values) => {
    setSaving(true);
    setSaveError('');
    try {
      if (formState.project) {
        await editProject(formState.project.id, values);
        setFlash(`Project "${values.name}" was updated.`);
      } else {
        await addProject(values);
        setFlash(`Project "${values.name}" was created.`);
      }
      setFormState(null);
    } catch (err) {
      setSaveError(err.message || 'Could not save the project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const del = useConfirmDelete(async (project) => {
    await removeProject(project.id);
    removeTasksByProject(project.id);
    setFlash(`Project "${project.name}" was deleted.`);
  });

  const retry = () => {
    reloadProjects();
    reloadTasks();
  };

  const taskCountToDelete = del.target ? (tasksByProject[del.target.id]?.length ?? 0) : 0;

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Create projects and open one to manage its tasks."
        actions={
          <Button onClick={openCreate} disabled={loading}>
            + New project
          </Button>
        }
      />

      {flash && (
        <Alert type="success" onDismiss={() => setFlash('')}>
          {flash}
        </Alert>
      )}

      {loading && <Loader label="Loading projects…" />}
      {!loading && error && <Alert onRetry={retry}>{error}</Alert>}

      {!loading && !error && sortedProjects.length === 0 && (
        <EmptyState
          title="No projects yet"
          message="Create your first project to start organising tasks."
          action={<Button onClick={openCreate}>Create project</Button>}
        />
      )}

      {!loading && !error && sortedProjects.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={tasksByProject[project.id] ?? []}
              onEdit={openEdit}
              onDelete={del.ask}
            />
          ))}
        </div>
      )}

      {formState && (
        <Modal title={formState.project ? 'Edit project' : 'New project'} onClose={closeForm} wide>
          <ProjectForm
            initialValues={formState.project}
            isEdit={Boolean(formState.project)}
            submitting={saving}
            submitError={saveError}
            onSubmit={handleSave}
            onCancel={closeForm}
          />
        </Modal>
      )}

      {del.target && (
        <ConfirmDialog
          title="Delete project?"
          message={
            taskCountToDelete > 0
              ? `"${del.target.name}" and its ${taskCountToDelete} task${taskCountToDelete === 1 ? '' : 's'} will be permanently deleted. This cannot be undone.`
              : `"${del.target.name}" will be permanently deleted. This cannot be undone.`
          }
          confirmLabel="Delete project"
          busy={del.busy}
          error={del.error}
          onConfirm={del.confirm}
          onCancel={del.cancel}
        />
      )}
    </>
  );
}