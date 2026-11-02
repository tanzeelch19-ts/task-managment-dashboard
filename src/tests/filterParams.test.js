import { describe, expect, it } from 'vitest';
import { DEFAULT_TASK_FILTERS } from '../utils/constants';
import { filtersFromParams, paramsFromFilters } from '../utils/filterparams';

describe('filtersFromParams', () => {
  it('returns the defaults for an empty query string', () => {
    expect(filtersFromParams(new URLSearchParams(''))).toEqual(DEFAULT_TASK_FILTERS);
  });

  it('reads valid values', () => {
    const filters = filtersFromParams(
      new URLSearchParams('status=Done&priority=High&sortBy=createdAt-desc&search=login&projectId=proj-1'),
    );
    expect(filters).toEqual({
      search: 'login',
      status: 'Done',
      priority: 'High',
      projectId: 'proj-1',
      sortBy: 'createdAt-desc',
    });
  });

  it('falls back to the default for invalid values', () => {
    const filters = filtersFromParams(new URLSearchParams('status=Nope&priority=Urgent&sortBy=title-asc'));
    expect(filters.status).toBe(DEFAULT_TASK_FILTERS.status);
    expect(filters.priority).toBe(DEFAULT_TASK_FILTERS.priority);
    expect(filters.sortBy).toBe(DEFAULT_TASK_FILTERS.sortBy);
  });

  it('limits the search text to 100 characters', () => {
    const filters = filtersFromParams(new URLSearchParams({ search: 'a'.repeat(300) }));
    expect(filters.search).toHaveLength(100);
  });
});

describe('paramsFromFilters', () => {
  it('leaves default values out of the URL', () => {
    expect(paramsFromFilters(DEFAULT_TASK_FILTERS).toString()).toBe('');
  });

  it('writes only the changed filters', () => {
    const params = paramsFromFilters({ ...DEFAULT_TASK_FILTERS, status: 'Todo', search: 'api' });
    expect(params.get('status')).toBe('Todo');
    expect(params.get('search')).toBe('api');
    expect(params.has('priority')).toBe(false);
  });

  it('round-trips through filtersFromParams', () => {
    const filters = { search: 'x', status: 'In Progress', priority: 'Low', projectId: 'proj-2', sortBy: 'dueDate-desc' };
    expect(filtersFromParams(paramsFromFilters(filters))).toEqual(filters);
  });
});