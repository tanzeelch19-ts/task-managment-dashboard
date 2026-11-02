// Small red "Overdue" pill shown next to a due date.
//   block  put it on its own line under the date (used in the task table)
export default function OverdueTag({ block = false }) {
  return (
    <span
      className={`w-fit rounded-full bg-danger-soft px-[9px] text-[0.72rem] leading-[1.7] font-bold text-danger ${
        block ? 'mt-[3px] block max-md:ml-auto' : 'ml-2 inline-block'
      }`}
    >
      Overdue
    </span>
  );
}