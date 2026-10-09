/** Text wordmark based on the business card: crimson Norden over a Carpets & Flooring pill. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span
        className="font-display text-[1.4rem] font-extrabold tracking-tight text-accent xs:text-[1.65rem]"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        Norden
      </span>{' '}
      <span className="mt-1 rounded-full bg-accent px-1.5 py-[3px] text-[0.48rem] font-bold uppercase tracking-[0.16em] text-white xs:px-2 xs:text-[0.55rem] xs:tracking-[0.22em]">
        Carpets &amp; Flooring
      </span>
    </span>
  )
}
