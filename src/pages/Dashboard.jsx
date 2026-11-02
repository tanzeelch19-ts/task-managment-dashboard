import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../ui/Loader';
import Alert from '../ui/Alert';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import ProgressBar from '../ui/Progressbar';
import DashboardCard from '../components/Dashboardcard.jsx';
import useTasks from '../Hooks/useTasks.js';
import useProjects from '../Hooks/useProjects.js';
import useDocumentTitle from '../Hooks/useDocumentTitle.js';
import { TASK_STATUS } from '../utils/constants';
import { formatDateTime } from '../utils/dateHelpers';
import {
  getAttentionSummary,
  getRecentTasks,
  getTaskStats,
  groupTasksByStatus,
  indexById,
} from '../utils/taskHelpers';

// Icon paths (24x24, stroke) for the summary cards.
const ICONS = {
  projects: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  tasks: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  pending: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  inProgress: 'M13 2L4 14h7l-1 8 9-12h-7z',
  completed: 'M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
};

const count = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// The hero headline answers one question: what needs my attention?
function getHeroCopy({ overdue, dueSoon }, totalTasks) {
  if (totalTasks === 0) {
    return {
      title: 'Start by adding a task',
      text: 'Create a project, then add tasks to track your progress here.',
    };
  }
  if (overdue > 0) {
    return {
      title: `${count(overdue, 'task')} ${overdue === 1 ? 'is' : 'are'} overdue`,
      text:
        dueSoon > 0
          ? `${count(dueSoon, 'more task')} ${dueSoon === 1 ? 'is' : 'are'} due in the next 7 days.`
          : 'Nothing else is due in the next 7 days.',
    };
  }
  if (dueSoon > 0) {
    return { title: `${count(dueSoon, 'task')} due this week`, text: 'Nothing is overdue.' };
  }
  return {
    title: 'You are all caught up',
    text: 'No tasks are overdue or due in the next 7 days.',
  };
}

// Same colours as the status badges: Todo = amber, In Progress = blue, Done = green.
const STATUS_ROWS = [
  { status: TASK_STATUS.TODO, tone: 'amber' },
  { status: TASK_STATUS.IN_PROGRESS, tone: 'blue' },
  { status: TASK_STATUS.DONE, tone: 'green' },
];

const CARD_TITLE = 'text-[1.05rem] font-bold tracking-tight';

export default function Dashboard() {
  useDocumentTitle('Dashboard');

  const { tasks, loading: tasksLoading, error: tasksError, reload: reloadTasks } = useTasks();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    reload: reloadProjects,
  } = useProjects();

  // Derived data: recalculated only when the tasks/projects change.
  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  const groups = useMemo(() => groupTasksByStatus(tasks), [tasks]);
  const recentTasks = useMemo(() => getRecentTasks(tasks, 5), [tasks]);
  const projectsById = useMemo(() => indexById(projects), [projects]);
  const attention = useMemo(() => getAttentionSummary(tasks), [tasks]);
  const hero = getHeroCopy(attention, tasks.length);

  const loading = tasksLoading || projectsLoading;
  const error = tasksError || projectsError;

  const retry = () => {
    reloadTasks();
    reloadProjects();
  };

  return (
    <>
      {(loading || error) && <h1 className="sr-only">Dashboard</h1>}

      {loading && <Loader label="Loading dashboard…" />}
      {!loading && error && <Alert onRetry={retry}>{error}</Alert>}

      {!loading && !error && (
        <>
          <section
            className="hero-surface mb-[22px] flex flex-col-reverse items-start justify-between gap-5 rounded-hero px-[22px] py-6 text-white shadow-hero md:flex-row md:items-center md:gap-7 md:px-9 md:py-8"
            aria-label="Today at a glance"
          >
            <div className="min-w-0">
              <h1 className="max-w-[24ch] text-[1.6rem] leading-[1.15] font-extrabold tracking-[-0.035em] md:text-[2rem]">
                {hero.title}
              </h1>
              <p className="mt-2.5 max-w-[48ch] text-[1.02rem] text-white/85">{hero.text}</p>
              <div className="mt-[22px] flex flex-wrap gap-2.5">
                <Button to="/tasks" variant="light">
                  {tasks.length === 0 ? 'Go to tasks' : 'Review tasks'}
                </Button>
                <Button to="/tasks/new" variant="ghostLight">
                  New task
                </Button>
              </div>
            </div>

            <div
              className="hero-ring grid size-[108px] shrink-0 animate-ring-fill place-items-center rounded-full md:size-[132px]"
              style={{ '--pct': attention.completion }}
              role="img"
              aria-label={`${attention.completion}% of tasks completed`}
            >
              <div className="grid size-[84px] place-content-center rounded-full bg-[#3a1a7c] text-center md:size-[104px]">
                <strong className="text-[1.3rem] leading-[1.1] font-extrabold tracking-[-0.03em] md:text-[1.6rem]">
                  {attention.completion}%
                </strong>
                <span className="text-[0.78rem] text-white/80">complete</span>
              </div>
            </div>
          </section>

          {/* 5 cards: one row on wide screens, 3 + 2 on tablets, 2 per row on phones
              (the last card then fills the row instead of sitting alone). */}
          <section
            className="mb-[22px] grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5 max-sm:[&>:last-child]:col-span-2"
            aria-label="Summary"
          >
            <DashboardCard label="Total projects" value={projects.length} icon={ICONS.projects} />
            <DashboardCard label="Total tasks" value={stats.total} icon={ICONS.tasks} />
            <DashboardCard label="Pending (Todo)" value={stats.pending} tone="amber" icon={ICONS.pending} />
            <DashboardCard label="In progress" value={stats.inProgress} tone="blue" icon={ICONS.inProgress} />
            <DashboardCard label="Completed" value={stats.completed} tone="green" icon={ICONS.completed} />
          </section>

          <div className="grid items-start gap-5 lg:grid-cols-2">
            <Card as="section" aria-labelledby="summary-heading">
              <h2 id="summary-heading" className={`mb-4 ${CARD_TITLE}`}>
                Tasks by status
              </h2>

              {stats.total === 0 ? (
                <p className="text-muted">No tasks yet.</p>
              ) : (
                <ul className="grid gap-5">
                  {STATUS_ROWS.map(({ status, tone }) => {
                    const total = groups[status].length;
                    const percent = Math.round((total / stats.total) * 100);
                    return (
                      <li key={status}>
                        <div className="mb-[9px] flex items-center justify-between gap-3 text-[0.88rem] font-medium text-muted">
                          <Badge value={status} />
                          <span>
                            {count(total, 'task')} · {percent}%
                          </span>
                        </div>
                        <ProgressBar value={percent} tone={tone} />
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            <Card as="section" aria-labelledby="recent-heading">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 id="recent-heading" className={CARD_TITLE}>
                  Recently updated tasks
                </h2>
                <Link to="/tasks" className="text-[0.88rem] font-semibold text-primary no-underline hover:underline">
                  View all
                </Link>
              </div>

              {recentTasks.length === 0 ? (
                <EmptyState
                  bare
                  title="No tasks yet"
                  message="Create your first task to see it here."
                  action={<Button to="/tasks/new">Create task</Button>}
                />
              ) : (
                <ul>
                  {recentTasks.map((task) => (
                    <li
                      key={task.id}
                      data-testid="recent-task"
                      className="flex items-center justify-between gap-3 border-t border-line py-[13px] first:border-t-0 first:pt-0"
                    >
                      <div className="grid min-w-0">
                        <Link
                          to={`/tasks/${task.id}`}
                          className="truncate font-bold text-ink no-underline hover:text-primary hover:underline"
                        >
                          {task.title}
                        </Link>
                        <span className="text-[0.82rem] text-muted">
                          {projectsById[task.projectId]?.name ?? 'Unknown project'} ·{' '}
                          {formatDateTime(task.updatedAt)}
                        </span>
                      </div>
                      <Badge value={task.status} />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}