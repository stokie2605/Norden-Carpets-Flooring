/** Hairline rule with a short crimson tick, echoing the red rule on the business card. */
export function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`container-x ${className}`}>
      <div className="relative h-px bg-line">
        <span className="absolute -top-px left-0 h-[3px] w-14 bg-accent" />
      </div>
    </div>
  )
}
