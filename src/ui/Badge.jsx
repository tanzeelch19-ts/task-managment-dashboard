// Small coloured pill for a status or priority value, with a dot.
// "In Progress" -> slug "in-progress". `data-badge` holds the slug (handy for tests).
const TONES = {
  // Project status
  active: 'bg-success-soft text-success',
  completed: 'bg-info-soft text-info',
  'on-hold': 'bg-warning-soft text-warning',
  // Task status (same colours as the dashboard progress bars)
  todo: 'bg-warning-soft text-warning',
  'in-progress': 'bg-info-soft text-info',
  done: 'bg-success-soft text-success',
  // Task priority
  low: 'bg-[#eceff5] text-[#475069]',
  medium: 'bg-[#def3f9] text-[#0e6f8a]',
  high: 'bg-danger-soft text-danger',
};

export default function Badge({ value }) {
  const slug = String(value).toLowerCase().replace(/\s+/g, '-');
  const tone = TONES[slug] ?? 'bg-[#eef0f4] text-[#3b4458]';

  return (
    <span
      data-badge={slug}
      className={`inline-flex items-center gap-1.5 rounded-full py-[3px] pr-[11px] pl-[9px] text-[0.78rem] leading-normal font-bold whitespace-nowrap before:size-1.5 before:rounded-full before:bg-current before:content-[''] ${tone}`}
    >
      {value}
    </span>
  );
}