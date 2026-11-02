// Horizontal bar. `value` is 0-100.
//   tone  brand (default, purple gradient) | amber | blue | green
const TONES = {
  brand: 'bg-linear-to-r from-[#7c4dff] to-[#a855f7]',
  amber: 'bg-[#f0a020]',
  blue: 'bg-[#3b82f6]',
  green: 'bg-[#22b07d]',
};

export default function ProgressBar({ value, tone = 'brand' }) {
  return (
    <div className="h-[9px] overflow-hidden rounded-full bg-[#ece8f6]">
      <div
        className={`h-full rounded-full transition-[width] duration-300 ${TONES[tone]}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}