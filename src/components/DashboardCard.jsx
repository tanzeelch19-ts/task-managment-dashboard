// One summary number on the dashboard, e.g. "Total tasks: 14".
//   tone  picks the icon colour: default | blue | amber | green
//   icon  optional SVG path (24x24 viewBox) drawn in the coloured tile
const TONES = {
  default: 'bg-primary-soft text-primary',
  amber: 'bg-warning-soft text-warning',
  blue: 'bg-info-soft text-info',
  green: 'bg-success-soft text-success',
};

export default function DashboardCard({ label, value, tone = 'default', hint, icon }) {
  return (
    <div
      data-testid="stat-card"
      className="flex flex-col items-start gap-2.5 rounded-card border border-line bg-white p-4 shadow-card sm:gap-3.5 sm:p-[18px]"
    >
      {icon && (
        <span
          className={`grid size-[46px] shrink-0 place-items-center rounded-[14px] ${TONES[tone]}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        </span>
      )}
      <div className="min-w-0">
        <p className="text-[0.85rem] font-semibold text-muted">{label}</p>
        <p
          data-testid="stat-value"
          className="text-[1.5rem] leading-[1.15] font-extrabold tracking-[-0.03em] sm:text-[1.75rem]"
        >
          {value}
        </p>
        {hint && <p className="mt-0.5 text-[0.8rem] text-muted">{hint}</p>}
      </div>
    </div>
  );
}