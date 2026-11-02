// Tailwind classes shared by every text input, <select> and <textarea>
// (forms, filters, search). `aria-invalid:` turns the border red when a form
// sets aria-invalid="true" on a field with an error.
export const controlClass =
  'min-h-11 w-full resize-y rounded-control border border-line-strong bg-white px-3.5 py-2 text-ink transition-[border-color,box-shadow] placeholder:text-[#8f88a3] hover:border-[#b5aad2] focus:border-primary focus:ring-4 focus:ring-primary/30 focus:outline-none aria-invalid:border-danger aria-invalid:focus:ring-danger/20';