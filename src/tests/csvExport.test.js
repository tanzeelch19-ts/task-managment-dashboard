import { describe, expect, it } from 'vitest';
import { buildTasksCsv, escapeCell } from '../utils/csvExport';

describe('escapeCell', () => {
  it('leaves plain text alone', () => {
    expect(escapeCell('Hello')).toBe('Hello');
  });

  it('turns null and undefined into empty text', () => {
    expect(escapeCell(null)).toBe('');
    expect(escapeCell(undefined)).toBe('');
  });

  it('wraps values with commas, quotes or line breaks in quotes', () => {
    expect(escapeCell('a,b')).toBe('"a,b"');
    expect(escapeCell('say "hi"')).toBe('"say ""hi"""');
    expect(escapeCell('line1\nline2')).toBe('"line1\nline2"');
  });

  it('neutralises spreadsheet formulas', () => {
    expect(escapeCell('=SUM(A1:A2)')).toBe("'=SUM(A1:A2)");
    expect(escapeCell('+1')).toBe("'+1");
    expect(escapeCell('-1')).toBe("'-1");
    expect(escapeCell('@cmd')).toBe("'@cmd");
  });
});

describe('buildTasksCsv', () => {
  const task = {
    id: 'task-1',
    title: 'Build, test',
    description: '',
    projectId: 'proj-1',
    priority: 'High',
    status: 'Todo',
    dueDate: '2030-01-05',
    assignee: 'Ayesha',
    createdAt: '2030-01-01T10:00:00.000Z',
    updatedAt: '2030-01-02T10:00:00.000Z',
  };

  it('starts with the header row and uses CRLF line breaks', () => {
    const lines = buildTasksCsv([task]).split('\r\n');
    expect(lines[0]).toBe('ID,Title,Description,Project,Priority,Status,Due date,Assignee,Created,Updated');
    expect(lines).toHaveLength(2);
  });

  it('shows the project name instead of the id', () => {
    const csv = buildTasksCsv([task], { 'proj-1': { name: 'Website' } });
    expect(csv.split('\r\n')[1]).toContain(',Website,');
  });

  it('leaves the project empty when it is unknown', () => {
    expect(buildTasksCsv([task]).split('\r\n')[1]).toContain(',,High,');
  });

  it('quotes titles that contain commas', () => {
    expect(buildTasksCsv([task]).split('\r\n')[1]).toContain('"Build, test"');
  });
});