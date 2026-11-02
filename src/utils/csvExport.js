// Builds a CSV file from a list of tasks and triggers the browser download.

const HEADERS = [
  'ID',
  'Title',
  'Description',
  'Project',
  'Priority',
  'Status',
  'Due date',
  'Assignee',
  'Created',
  'Updated',
];

/**
 * Makes one value safe to put in a CSV cell.
 *  - Values containing a comma, quote or line break are wrapped in quotes.
 *  - Values starting with = + - @ get a leading apostrophe. Otherwise Excel or
 *    Google Sheets would run them as formulas (CSV injection).
 */
export function escapeCell(value) {
  let text = value === null || value === undefined ? '' : String(value);

  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }
  if (/[",\r\n]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/** Tasks -> CSV text. `projectsById` lets the file show project names, not ids. */
export function buildTasksCsv(tasks, projectsById = {}) {
  const rows = tasks.map((task) => [
    task.id,
    task.title,
    task.description,
    projectsById[task.projectId]?.name ?? '',
    task.priority,
    task.status,
    task.dueDate,
    task.assignee,
    task.createdAt,
    task.updatedAt,
  ]);

  return [HEADERS, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n');
}

/** Starts a download of `csvText` as `filename`. Browser only. */
export function downloadCsv(filename, csvText) {
  // The BOM tells Excel the file is UTF-8, so non-English names display correctly.
  const blob = new Blob(['\uFEFF', csvText], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 0);
}