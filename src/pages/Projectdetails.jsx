import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../ui/PageHeader';
import Loader from '../ui/Loader';
import Alert from '../ui/Alert';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import DetailItem from '../ui/DetailItem';
import EmptyState from '../ui/EmptyState';
import ProgressBar from '../ui/Progressbar';
import TaskFilters from '../components/TaskFilters';
import TaskTable from '../components/TableTask';
import ConfirmDialog from '../components/ConfirmDialog';
import useProjects from '../Hooks/useProjects';
import useTasks from '../Hooks/useTasks';
import useTaskFilters from '../Hooks/useTaskFilters';
import useFlash from '../Hooks/useFlash';
import useConfirmDelete from '../Hooks/useConfirmDelete';
import useDocumentTitle from '../Hooks/useDocumentTitle';
import { TASK_STATUS } from '../utils/constants';
import { formatDate } from '../utils/dateHelpers';
import { getProjectProgress, getTasksForProject } from '../utils/taskHelpers';

// A stable empty array: keeps useMemo/useTaskFilters from re-running while the
// project is still loading.
const NO_TASKS = [];

const BACK_LINK =
  'mb-3.5 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-muted no-underline hover:text-primary';

// One project: its details, progress and its own (filterable) task list.
export default function ProjectDetails() {
  const { projectId } = useParams();

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    reload: reloadProjects,
  } = useProjects();
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    reload: reloadTasks,
    removeTask,
  } = useTasks();

  const project = useMemo(
    () => projects.find((item) => String(item.id) === projectId),
    [projects, projectId],
  );
  const projectTasks = useMemo(
    () => (project ? getTasksForProject(tasks, project.id) : NO_TASKS),
    [tasks, project],
  );
  const projectsById = useMemo(() => (project ? { [project.id]: project } : {}), [project]);

  const { filters, setFilter, clearFilters, filteredTasks, isFiltering } =
    useTaskFilters(projectTasks);
  const [flash, setFlash] = useFlash();

  useDocumentTitle(project ? project.name : 'Project');

  const del = useConfirmDelete(async (task) => {
    await removeTask(task.id);
    setFlash(`Task "${task.title}" was deleted.`);
  });

  const loading = projectsLoading || tasksLoading;
  const error = projectsError || tasksError;

  const retry = () => {
    reloadProjects();
    reloadTasks();
  };

  if (loading) return <Loader label="Loading project…" />;
  if (error) return <Alert onRetry={retry}>{error}</Alert>;

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        message="This project does not exist. It may have been deleted."
        action={<Button to="/projects">Back to projects</Button>}
      />
    );
  }

  const progress = getProjectProgress(projectTasks);
  const doneCount = projectTasks.filter((task) => task.status === TASK_STATUS.DONE).length;

  return (
    <>
      <Link to="/projects" className={BACK_LINK}>
        ← All projects
      </Link>

      <PageHeader
        title={project.name}
        subtitle={project.description || 'No description.'}
        actions={<Button to={`/tasks/new?projectId=${project.id}`}>+ Add task</Button>}
      />

      {flash && (
        <Alert type="success" onDismiss={() => setFlash('')}>
          {flash}
        </Alert>
      )}

      <Card as="section" aria-label="Project summary">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
          <DetailItem label="Status">
            <Badge value={project.status} />
          </DetailItem>
          <DetailItem label="Start date">{formatDate(project.startDate)}</DetailItem>
          <DetailItem label="Due date">{formatDate(project.dueDate)}</DetailItem>
          <DetailItem label="Tasks">{projectTasks.length}</DetailItem>
        </dl>

        <div className="mt-5 border-t border-line pt-5" aria-label={`Progress: ${progress}%`}>
          <div className="mb-[9px] flex items-center justify-between gap-3 text-[0.88rem] font-medium text-muted">
            <span>
              {doneCount} of {projectTasks.length} task{projectTasks.length === 1 ? '' : 's'} done
            </span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </Card>

      <h2 className="mb-3.5 mt-8 text-xl font-bold tracking-tight">Tasks</h2>

      {projectTasks.length === 0 ? (
        <EmptyState
          title="No tasks in this project"
          message="Add the first task to get this project moving."
          action={<Button to={`/tasks/new?projectId=${project.id}`}>Add task</Button>}
        />
      ) : (
        <>
          {/* No `projects` prop: the project filter is hidden, we are already inside one. */}
          <TaskFilters
            filters={filters}
            onChange={setFilter}
            onClear={clearFilters}
            isFiltering={isFiltering}
          />

          <p className="mb-3 text-[0.88rem] font-medium text-muted" aria-live="polite">
            Showing {filteredTasks.length} of {projectTasks.length} task
            {projectTasks.length === 1 ? '' : 's'}
          </p>

          {filteredTasks.length === 0 ? (
            <EmptyState
              title="No tasks match your filters"
              message="Try a different search term or clear the filters."
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <TaskTable
              tasks={filteredTasks}
              projectsById={projectsById}
              showProject={false}
              onDelete={del.ask}
            />
          )}
        </>
      )}

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