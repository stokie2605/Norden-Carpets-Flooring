import { Star } from 'lucide-react'

/** Five filled rating stars. Decorative: the rating itself is always written out next to them. */
export function Stars({ className = 'size-4' }: { className?: string }) {
  return (
    <span aria-hidden="true" className="inline-flex shrink-0 gap-0.5 text-star">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`fill-current ${className}`} strokeWidth={0} />
      ))}
    </span>
  )
}
