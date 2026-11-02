import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import OverdueTag from '../ui/OverTag';
import { formatDate } from '../utils/dateHelpers';
import { isOverdue } from '../utils/taskHelpers';

// Table cells. On phones (< md) the table is switched off with `max-md:block`
// and every row becomes a stacked card: each cell shows its `data-label` as a
// caption through the ::before content.
const TH = 'border-b border-line bg-[#faf8fe] px-3.5 py-[13px] text-left text-[0.8rem] font-bold whitespace-nowrap text-muted';
const TD =
  'border-b border-line px-3.5 py-[13px] align-middle group-last:border-b-0 max-md:flex max-md:items-center max-md:justify-between max-md:gap-4 max-md:border-b-0 max-md:px-4 max-md:py-2 max-md:text-right max-md:before:shrink-0 max-md:before:text-[0.8rem] max-md:before:font-semibold max-md:before:text-muted max-md:before:content-[attr(data-label)]';

/**
 * Table of tasks. On small screens each row turns into a stacked card.
 *
 *   tasks         tasks to show
 *   projectsById  { id: project } lookup, used to show the project name
 *   showProject   hide the Project column inside a single project's page
 *   onDelete      called with the task when "Delete" is clicked
 */
export default function TaskTable({ tasks, projectsById = {}, showProject = true, onDelete }) {
  return (
    <div data-testid="table-wrap" className="relative overflow-x-auto rounded-card border border-line bg-white shadow-card max-md:border-0 max-md:bg-transparent max-md:shadow-none">
      <table className="w-full border-collapse max-md:block">
        <thead className="max-md:sr-only">
          <tr>
            <th scope="col" className={TH}>Task</th>
            {showProject && <th scope="col" className={TH}>Project</th>}
            <th scope="col" className={TH}>Priority</th>
            <th scope="col" className={TH}>Status</th>
            <th scope="col" className={TH}>Due date</th>
            <th scope="col" className={TH}>Assignee</th>
            <th scope="col" className={TH}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="max-md:block">
          {tasks.map((task) => {
            const project = projectsById[task.projectId];
            const overdue = isOverdue(task);
            return (
              <tr
                key={task.id}
                className="group hover:bg-[#faf7ff] max-md:mb-3 max-md:block max-md:rounded-card max-md:border max-md:border-line max-md:bg-white max-md:py-1.5 max-md:shadow-card max-md:hover:bg-white"
              >
                <td data-label="Task" className={`${TD} min-w-[200px] font-bold max-md:min-w-0 max-md:text-base`}>
                  <Link to={`/tasks/${task.id}`} className="text-ink no-underline hover:text-primary hover:underline">
                    {task.title}
                  </Link>
                </td>
                {showProject && (
                  <td data-label="Project" className={TD}>
                    {project ? (
                      <Link to={`/projects/${project.id}`} className="text-muted no-underline hover:text-primary hover:underline">
                        {project.name}
                      </Link>
                    ) : (
                      <span className="text-muted">Unknown project</span>
                    )}
                  </td>
                )}
                <td data-label="Priority" className={TD}>
                  <Badge value={task.priority} />
                </td>
                <td data-label="Status" className={TD}>
                  <Badge value={task.status} />
                </td>
                <td data-label="Due date" className={`${TD} whitespace-nowrap`}>
                  <span className={overdue ? 'text-danger' : undefined}>
                    {formatDate(task.dueDate)}
                    {overdue && <OverdueTag block />}
                  </span>
                </td>
                <td data-label="Assignee" className={`${TD} whitespace-nowrap`}>
                  {task.assignee ? (
                    <span className="inline-flex items-center gap-2.5 font-medium">
                      <Avatar name={task.assignee} />
                      {task.assignee}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td
                  data-label="Actions"
                  className={`${TD} text-right whitespace-nowrap max-md:mt-1 max-md:justify-end max-md:border-t max-md:border-line max-md:pt-3 max-md:before:hidden`}
                >
                  <div className="inline-flex gap-1">
                    <Button to={`/tasks/${task.id}/edit`} variant="secondary" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghostDanger" size="sm" onClick={() => onDelete(task)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}