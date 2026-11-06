import { useMemo } from 'react';
import PageHeader from '../ui/PageHeader';
import Loader from '../ui/Loader';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import TaskFilters from '../components/TaskFilters';
import TaskTable from '../components/TaskTable';
import ConfirmDialog from '../components/ConfirmDialog';
import useTasks from '../hooks/useTasks';
import useProjects from '../hooks/useProjects';
import useTaskFilters from '../hooks/useTaskFilters';
import useFlash from '../hooks/useFlash';
import useConfirmDelete from '../hooks/useConfirmDelete';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { indexById } from '../utils/taskHelpers';
import { buildTasksCsv, downloadCsv } from '../utils/csvExport';

// Modules 3 + 4: list every task with search, filters and sorting that all
// work together, plus delete with confirmation.
// Advanced: the filters live in the URL (shareable links) and the visible list
// can be exported to CSV.
export default function Tasks() {
  useDocumentTitle('Tasks');

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

  const { filters, setFilter, clearFilters, filteredTasks, isFiltering } = useTaskFilters(tasks, {
    syncWithUrl: true,
  });
  const [flash, setFlash] = useFlash();

  const projectsById = useMemo(() => indexById(projects), [projects]);

  const del = useConfirmDelete(async (task) => {
    await removeTask(task.id);
    setFlash(`Task "${task.title}" was deleted.`);
  });

  const handleExport = () => {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`tasks-${date}.csv`, buildTasksCsv(filteredTasks, projectsById));
    setFlash(`Exported ${filteredTasks.length} task${filteredTasks.length === 1 ? '' : 's'} to CSV.`);
  };

  const loading = tasksLoading || projectsLoading;
  const error = tasksError || projectsError;

  const retry = () => {
    reloadTasks();
    reloadProjects();
  };

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle="Search, filter and sort tasks across all projects."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleExport} disabled={filteredTasks.length === 0}>
              Export CSV
            </Button>
            <Button to="/tasks/new">+ New task</Button>
          </div>
        }
      />

      {flash && (
        <Alert type="success" onDismiss={() => setFlash('')}>
          {flash}
        </Alert>
      )}

      {loading && <Loader label="Loading tasks…" />}
      {!loading && error && <Alert onRetry={retry}>{error}</Alert>}

      {!loading && !error && tasks.length === 0 && (
        <EmptyState
          title="No tasks yet"
          message="Create a task and assign it to a project."
          action={<Button to="/tasks/new">Create task</Button>}
        />
      )}

      {!loading && !error && tasks.length > 0 && (
        <>
          <TaskFilters
            filters={filters}
            onChange={setFilter}
            onClear={clearFilters}
            isFiltering={isFiltering}
            projects={projects}
          />

          <p className="mb-3 text-[0.88rem] font-medium text-muted" aria-live="polite">
            Showing {filteredTasks.length} of {tasks.length} task{tasks.length === 1 ? '' : 's'}
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
            <TaskTable tasks={filteredTasks} projectsById={projectsById} onDelete={del.ask} />
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