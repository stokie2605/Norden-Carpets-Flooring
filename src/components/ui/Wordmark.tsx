/** Text wordmark based on the business card: crimson Norden over a Carpets & Flooring tag. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-start gap-[3px] leading-none ${className}`}>
      <span className="font-display text-[1.3125rem] font-extrabold tracking-[-0.02em] text-accent lg:text-2xl">Norden</span>{' '}
      <span className="rounded-[2px] bg-accent px-1 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-white lg:px-[5px] lg:text-[0.5625rem]">
        Carpets &amp; Flooring
      </span>
    </span>
  )
}
