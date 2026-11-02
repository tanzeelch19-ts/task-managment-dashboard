// One "label → value" pair inside a <dl className="grid ...">.
// `wide` makes it span the full row (used for long descriptions).
export default function DetailItem({ label, children, wide = false }) {
  return (
    <div className={wide ? 'col-span-full' : undefined}>
      <dt className="mb-[5px] text-[0.8rem] font-semibold text-muted">{label}</dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  );
}