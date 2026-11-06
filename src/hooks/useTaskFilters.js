import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_TASK_FILTERS } from '../utils/constants';
import { filterAndSortTasks, hasActiveFilters } from '../utils/taskHelpers';
import { filtersFromParams, paramsFromFilters } from '../utils/filterParams';

/**
 * Holds the search / filter / sort state for a task list and returns the
 * already-filtered tasks. Used by the Tasks page and Project Details.
 *
 *   syncWithUrl: true  keeps the filters in the URL query string, so the view
 *                      can be bookmarked and shared (used by the Tasks page).
 *   syncWithUrl: false keeps the filters in component state only.
 *
 * useMemo means the filtering only re-runs when `tasks` or `filters` change.
 */
export default function useTaskFilters(tasks, { syncWithUrl = false } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localFilters, setLocalFilters] = useState(DEFAULT_TASK_FILTERS);

  const urlFilters = useMemo(() => filtersFromParams(searchParams), [searchParams]);
  const filters = syncWithUrl ? urlFilters : localFilters;

  const setFilter = useCallback(
    (name, value) => {
      if (syncWithUrl) {
        setSearchParams(paramsFromFilters({ ...urlFilters, [name]: value }), { replace: true });
      } else {
        setLocalFilters((prev) => ({ ...prev, [name]: value }));
      }
    },
    [syncWithUrl, urlFilters, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    if (syncWithUrl) {
      setSearchParams(new URLSearchParams(), { replace: true });
    } else {
      setLocalFilters(DEFAULT_TASK_FILTERS);
    }
  }, [syncWithUrl, setSearchParams]);

  const filteredTasks = useMemo(() => filterAndSortTasks(tasks, filters), [tasks, filters]);

  return {
    filters,
    setFilter,
    clearFilters,
    filteredTasks,
    isFiltering: hasActiveFilters(filters),
  };
}