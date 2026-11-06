import {
  ALL,
  DEFAULT_TASK_FILTERS,
  SORT_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from './constants';

// Converts task filters to and from URL query parameters, so a filtered view
// can be bookmarked or shared (e.g. /tasks?status=Todo&priority=High).
// Unknown or invalid values fall back to the defaults instead of breaking the page.

const FILTER_KEYS = Object.keys(DEFAULT_TASK_FILTERS);
const SEARCH_MAX_LENGTH = 100;

const ALLOWED_VALUES = {
  status: [ALL, ...TASK_STATUS_OPTIONS],
  priority: [ALL, ...TASK_PRIORITY_OPTIONS],
  sortBy: SORT_OPTIONS.map((option) => option.value),
};

/** URLSearchParams -> filter object. */
export function filtersFromParams(params) {
  const filters = { ...DEFAULT_TASK_FILTERS };

  FILTER_KEYS.forEach((key) => {
    const raw = params.get(key);
    if (raw === null) return;

    if (key === 'search') {
      filters.search = raw.slice(0, SEARCH_MAX_LENGTH);
    } else if (key === 'projectId') {
      // Project ids are free text (they come from the data), so accept any non-empty value.
      filters.projectId = raw || ALL;
    } else if (ALLOWED_VALUES[key]?.includes(raw)) {
      filters[key] = raw;
    }
  });

  return filters;
}

/** Filter object -> URLSearchParams. Default values are left out to keep URLs short. */
export function paramsFromFilters(filters) {
  const params = new URLSearchParams();

  FILTER_KEYS.forEach((key) => {
    const value = filters[key];
    if (value !== undefined && value !== '' && value !== DEFAULT_TASK_FILTERS[key]) {
      params.set(key, value);
    }
  });

  return params;
}