/** Text wordmark based on the business card: crimson Norden over a Carpets & Flooring pill. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span
        className="font-display text-[1.65rem] font-extrabold tracking-tight text-accent"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        Norden
      </span>{' '}
      <span className="mt-1 rounded-full bg-accent px-2 py-[3px] text-[0.55rem] font-bold uppercase tracking-[0.22em] text-white">
        Carpets &amp; Flooring
      </span>
    </span>
  )
}
