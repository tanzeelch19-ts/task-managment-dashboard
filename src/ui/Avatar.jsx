// Round (or rounded-square) tile with initials. The colour comes from the name,
// so the same person / project always gets the same colour.
//   name    "Ayesha Khan" -> "AK"
//   single  show only the first letter (used as a project mark)
//   square  rounded square instead of a circle
//   size    "md" (default) | "lg"
const COLORS = [
  { bg: '#ede9fe', fg: '#5b21b6' },
  { bg: '#e0f2fe', fg: '#075985' },
  { bg: '#dcfce7', fg: '#166534' },
  { bg: '#fef3c7', fg: '#92400e' },
  { bg: '#ffe4e6', fg: '#9f1239' },
  { bg: '#fae8ff', fg: '#86198f' },
];

const SIZES = {
  md: 'size-[30px] text-[0.72rem]',
  lg: 'size-11 text-[1.1rem]',
};

function hash(text) {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) % 9973;
  return value;
}

function getInitials(name, single) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (single || words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function Avatar({ name = '', size = 'md', square = false, single = false }) {
  const color = COLORS[hash(name) % COLORS.length];
  return (
    <span
      className={`inline-grid shrink-0 place-items-center leading-none font-extrabold ${SIZES[size]} ${
        square ? 'rounded-[13px]' : 'rounded-full'
      }`}
      style={{ background: color.bg, color: color.fg }}
      aria-hidden="true"
    >
      {getInitials(name, single)}
    </span>
  );
}