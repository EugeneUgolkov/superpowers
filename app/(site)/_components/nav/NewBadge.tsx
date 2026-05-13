type NewBadgeProps = {
  className?: string;
};

export function NewBadge({ className = '' }: NewBadgeProps) {
  return (
    <span
      className={`ml-1.5 inline-flex items-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide leading-none text-white ${className}`}
      aria-label="New"
    >
      New
    </span>
  );
}
