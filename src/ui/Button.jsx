import { Link } from 'react-router-dom';

// The one button used everywhere. Pass `to` and it renders a router <Link>
// (so it looks identical to a real button), otherwise a <button>.
//
//   <Button>Save</Button>
//   <Button variant="secondary" size="sm" onClick={...}>Edit</Button>
//   <Button to="/tasks/new">New task</Button>
//
//   variant  primary | secondary | danger | ghostDanger | light | ghostLight | onDark
//   size     md (default) | sm
const BASE =
  'inline-flex items-center justify-center gap-1.5 rounded-control border border-transparent font-bold leading-tight whitespace-nowrap no-underline transition-colors disabled:pointer-events-none disabled:opacity-55';

const VARIANTS = {
  primary: 'bg-primary text-white shadow-button hover:bg-primary-hover hover:text-white',
  secondary:
    'border-line-strong bg-white text-ink hover:border-[#c9b8fa] hover:bg-primary-soft hover:text-primary',
  danger: 'bg-danger text-white hover:bg-danger-hover hover:text-white',
  ghostDanger: 'bg-transparent text-danger hover:bg-danger-soft hover:text-danger-hover',
  // Buttons that sit on dark backgrounds (the hero and the navbar).
  light:
    'bg-white text-[#2a1160] shadow-[0_8px_18px_-8px_rgb(20_5_50/0.6)] hover:bg-[#f3edff] hover:text-[#2a1160]',
  ghostLight: 'border-white/45 bg-white/12 text-white hover:bg-white/22 hover:text-white',
  onDark: 'bg-white text-shell hover:bg-[#f3edff] hover:text-shell',
};

const SIZES = {
  md: 'px-[18px] py-2.5',
  sm: 'px-3 py-1.5 text-[0.85rem]',
};

export default function Button({
  to,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  ...props
}) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (to) return <Link to={to} className={classes} {...props} />;
  return <button type={type} className={classes} {...props} />;
}