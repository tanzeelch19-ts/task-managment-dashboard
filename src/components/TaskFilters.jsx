import SearchBar from './SearchBar';
import Button from '../ui/Button';
import { controlClass } from '../ui/controlClass';
import {
  ALL,
  SORT_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from '../utils/constants';

// Each filter is a label wrapping a select. 1 per row on phones, 2 per row on
// small tablets, then they share one row.
const ITEM = 'grid min-w-0 grow basis-full gap-[5px] text-[0.8rem] font-bold text-muted min-[421px]:basis-[calc(50%-6px)] md:basis-[150px]';

/**
 * Search + status + priority + project + sort + "Clear filters".
 *
 *   filters      current filter values (from useTaskFilters)
 *   onChange     (name, value) => void
 *   onClear      resets everything
 *   projects     pass an array to show the project filter; omit to hide it
 *                (e.g. inside a single project's page)
 */
export default function TaskFilters({ filters, onChange, onClear, isFiltering, projects }) {
  return (
    <div className="mb-4 grid gap-3.5 rounded-card border border-line bg-white p-[18px] shadow-card">
      <SearchBar value={filters.search} onChange={(value) => onChange('search', value)} />

      <div className="flex flex-wrap items-end gap-3">
        <label className={ITEM}>
          <span>Status</span>
          <select className={controlClass} value={filters.status} onChange={(e) => onChange('status', e.target.value)}>
            <option value={ALL}>All statuses</option>
            {TASK_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className={ITEM}>
          <span>Priority</span>
          <select className={controlClass} value={filters.priority} onChange={(e) => onChange('priority', e.target.value)}>
            <option value={ALL}>All priorities</option>
            {TASK_PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        {projects && (
          <label className={ITEM}>
            <span>Project</span>
            <select className={controlClass} value={filters.projectId} onChange={(e) => onChange('projectId', e.target.value)}>
              <option value={ALL}>All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className={ITEM}>
          <span>Sort by</span>
          <select className={controlClass} value={filters.sortBy} onChange={(e) => onChange('sortBy', e.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <Button
          variant="secondary"
          className="max-md:basis-full md:ml-auto"
          onClick={onClear}
          disabled={!isFiltering}
        >
          Clear filters
        </Button>
      </div>
    </div>
  );
}