import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { TASK_STATUS } from '../utils/constants';
import { formatDate } from '../utils/dateHelpers';
import { getProjectProgress } from '../utils/taskHelpers';

/**
 * Card for one project in the Projects list.
 * `tasks` are only this project's tasks (used for the progress bar).
 */
export default function ProjectCard({ project, tasks, onEdit, onDelete }) {
  const progress = getProjectProgress(tasks);
  const doneCount = tasks.filter((task) => task.status === TASK_STATUS.DONE).length;

  return (
    <article data-testid="project-card" className="flex flex-col gap-4 rounded-card border border-line bg-white p-[22px] shadow-card">
      <header className="flex items-center gap-3">
        <Avatar name={project.name} size="lg" square single />
        <h3 className="min-w-0 flex-1 text-[1.05rem] leading-[1.3] font-bold [overflow-wrap:anywhere]">
          <Link to={`/projects/${project.id}`} className="text-ink no-underline hover:text-primary hover:underline">
            {project.name}
          </Link>
        </h3>
        <Badge value={project.status} />
      </header>

      <p className="line-clamp-3 text-[0.9rem] text-muted">
        {project.description || 'No description.'}
      </p>

      <dl className="flex gap-8 text-[0.88rem]">
        <div>
          <dt className="text-[0.78rem] font-semibold text-muted">Start</dt>
          <dd className="font-bold">{formatDate(project.startDate)}</dd>
        </div>
        <div>
          <dt className="text-[0.78rem] font-semibold text-muted">Due</dt>
          <dd className="font-bold">{formatDate(project.dueDate)}</dd>
        </div>
      </dl>

      <div aria-label={`Progress: ${progress}%`}>
        <div className="mb-[7px] flex justify-between gap-3 text-[0.82rem] font-medium text-muted">
          <span>
            {doneCount} of {tasks.length} task{tasks.length === 1 ? '' : 's'} done
          </span>
          <span>{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <footer className="mt-auto flex gap-2 border-t border-line pt-4">
        <Button to={`/projects/${project.id}`} size="sm">
          Open
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onEdit(project)}>
          Edit
        </Button>
        <Button variant="ghostDanger" size="sm" className="ml-auto" onClick={() => onDelete(project)}>
          Delete
        </Button>
      </footer>
    </article>
  );
}