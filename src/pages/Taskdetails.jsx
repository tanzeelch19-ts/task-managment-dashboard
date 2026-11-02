import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../ui/PageHeader';
import Loader from '../../ui/Loader';
import Alert from '../../ui/Alert';
import Avatar from '../../ui/Avatar';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import DetailItem from '../../ui/DetailItem';
import EmptyState from '../../ui/EmptyState';
import OverdueTag from '../../ui/OverTag';
import ConfirmDialog from '../../components/ConfirmDialog';
import useTasks from '../useTasks';
import useProjects from '../useProjects';
import useFlash from '../useFlash';
import useConfirmDelete from '../useConfirmDelete';
import useDocumentTitle from '../useDocumentTitle';
import { formatDate, formatDateTime } from '../../utils/dateHelpers';
import { isOverdue } from '../../utils/taskHelpers';

const BACK_LINK =
  'mb-3.5 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-muted no-underline hover:text-primary';

// Module 3 ("view"): read-only page for a single task, with Edit and Delete.
export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    reload: reloadTasks,
    removeTask,
  } = useTasks();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    reload: reloadProjects,
  } = useProjects();
  const [flash, setFlash] = useFlash();

  const task = useMemo(() => tasks.find((item) => String(item.id) === taskId), [tasks, taskId]);
  const project = useMemo(
    () => projects.find((item) => String(item.id) === String(task?.projectId)),
    [projects, task],
  );

  useDocumentTitle(task ? task.title : 'Task');

  const del = useConfirmDelete(async (item) => {
    await removeTask(item.id);
    navigate('/tasks', { state: { flash: `Task "${item.title}" was deleted.` } });
  });

  const loading = tasksLoading || projectsLoading;
  const error = tasksError || projectsError;

  const retry = () => {
    reloadTasks();
    reloadProjects();
  };

  if (loading) return <Loader label="Loading task…" />;
  if (error) return <Alert onRetry={retry}>{error}</Alert>;

  if (!task) {
    return (
      <EmptyState
        title="Task not found"
        message="This task does not exist. It may have been deleted."
        action={<Button to="/tasks">Back to tasks</Button>}
      />
    );
  }

  const overdue = isOverdue(task);

  return (
    <>
      <Link to={project ? `/projects/${project.id}` : '/tasks'} className={BACK_LINK}>
        ← {project ? project.name : 'All tasks'}
      </Link>

      <PageHeader
        title={task.title}
        actions={
          <>
            <Button to={`/tasks/${task.id}/edit`} variant="secondary">
              Edit
            </Button>
            <Button variant="danger" onClick={() => del.ask(task)}>
              Delete
            </Button>
          </>
        }
      />

      {flash && (
        <Alert type="success" onDismiss={() => setFlash('')}>
          {flash}
        </Alert>
      )}

      <Card as="section" aria-label="Task details">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Status">
            <Badge value={task.status} />
          </DetailItem>
          <DetailItem label="Priority">
            <Badge value={task.priority} />
          </DetailItem>
          <DetailItem label="Project">
            {project ? (
              <Link to={`/projects/${project.id}`}>{project.name}</Link>
            ) : (
              <span className="text-muted">Unknown project</span>
            )}
          </DetailItem>
          <DetailItem label="Assignee">
            {task.assignee ? (
              <span className="inline-flex items-center gap-2">
                <Avatar name={task.assignee} />
                {task.assignee}
              </span>
            ) : (
              '—'
            )}
          </DetailItem>
          <DetailItem label="Due date">
            <span className={overdue ? 'text-danger' : undefined}>
              {formatDate(task.dueDate)}
              {overdue && <OverdueTag />}
            </span>
          </DetailItem>
          <DetailItem label="Created">{formatDateTime(task.createdAt)}</DetailItem>
          <DetailItem label="Last updated">{formatDateTime(task.updatedAt)}</DetailItem>
          <DetailItem label="Description" wide>
            <span className="block font-normal leading-relaxed whitespace-pre-wrap">
              {task.description || 'No description.'}
            </span>
          </DetailItem>
        </dl>
      </Card>

      {del.target && (
        <ConfirmDialog
          title="Delete task?"
          message={`"${del.target.title}" will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete task"
          busy={del.busy}
          error={del.error}
          onConfirm={del.confirm}
          onCancel={del.cancel}
        />
      )}
    </>
  );
}