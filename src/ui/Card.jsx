
// White rounded panel. `as` changes the HTML tag, `className` adds extras.
//   <Card as="section" className="grid gap-5">...</Card>
export default function Card({ as: Tag = 'div', className = '', ...props }) {
  return (
    <Tag
      className={`rounded-card border border-line bg-white p-[22px] shadow-card ${className}`}
      {...props}
    />
  );
}