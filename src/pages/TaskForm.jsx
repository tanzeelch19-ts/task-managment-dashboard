import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PageHeader from '../ui/PageHeader';
import Loader from '../ui/Loader';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import TaskForm from '../components/Taskform';
import useTasks from '../Hooks/useTasks';
import useProjects from '../Hooks/useProjects';
import useDocumentTitle from '../Hooks/useDocumentTitle';

// Module 5: ONE page for both "create task" (/tasks/new) and "edit task"
// (/tasks/:taskId/edit). The presence of :taskId in the URL decides the mode.
export default function TaskFormPage() {
  const { taskId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isEdit = Boolean(taskId);

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    reload: reloadTasks,
    addTask,
    editTask,
  } = useTasks();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    reload: reloadProjects,
  } = useProjects();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useDocumentTitle(isEdit ? 'Edit task' : 'New task');

  const task = useMemo(
    () => (isEdit ? tasks.find((item) => String(item.id) === taskId) : undefined),
    [isEdit, tasks, taskId],
  );

  // /tasks/new?projectId=proj-1 pre-selects that project (used by "Add task"
  // on the Project Details page). Ignore ids that do not exist.
  const presetProject = projects.find((item) => String(item.id) === searchParams.get('projectId'));

  const loading = tasksLoading || projectsLoading;
  const error = tasksError || projectsError;

  const retry = () => {
    reloadTasks();
    reloadProjects();
  };

  // Where "Cancel" goes. Go back one page when there is in-app history,
  // otherwise (page opened directly) fall back to a sensible list page.
  const fallbackPath = isEdit ? `/tasks/${taskId}` : presetProject ? `/projects/${presetProject.id}` : '/tasks';
  const handleCancel = () => {
    if (location.key !== 'default') navigate(-1);
    else navigate(fallbackPath);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      if (isEdit) {
        await editTask(task.id, values);
        navigate(`/tasks/${task.id}`, { state: { flash: 'Task was updated.' } });
      } else {
        await addTask(values);
        navigate(presetProject ? `/projects/${presetProject.id}` : '/tasks', {
          state: { flash: `Task "${values.title}" was created.` },
        });
      }
    } catch (err) {
      setSubmitError(err.message || 'Could not save the task. Please try again.');
      setSubmitting(false);
    }
  };

  const header = (
    <PageHeader
      title={isEdit ? 'Edit task' : 'New task'}
      subtitle={isEdit ? 'Update the details below and save.' : 'Fill in the details to create a task.'}
    />
  );

  if (loading) {
    return (
      <>
        {header}
        <Loader label={isEdit ? 'Loading task…' : 'Loading…'} />
      </>
    );
  }

  if (error) {
    return (
      <>
        {header}
        <Alert onRetry={retry}>{error}</Alert>
      </>
    );
  }

  if (isEdit && !task) {
    return (
      <EmptyState
        title="Task not found"
        message="This task does not exist. It may have been deleted."
        action={<Button to="/tasks">Back to tasks</Button>}
      />
    );
  }

  // A task must belong to a project, so there is nothing to select yet.
  if (projects.length === 0) {
    return (
      <>
        {header}
        <EmptyState
          title="Create a project first"
          message="Every task belongs to a project. Create a project, then come back to add tasks."
          action={<Button to="/projects">Go to projects</Button>}
        />
      </>
    );
  }

  return (
    <>
      {header}
      <Card as="section" className="max-w-[780px]">
        {/* TaskForm reads its initial values once, so it is only rendered after
            the task and projects have loaded. `key` resets it between tasks. */}
        <TaskForm
          key={task?.id ?? 'new'}
          projects={projects}
          initialValues={isEdit ? task : presetProject ? { projectId: presetProject.id } : undefined}
          isEdit={isEdit}
          submitting={submitting}
          submitError={submitError}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </>
  );
}