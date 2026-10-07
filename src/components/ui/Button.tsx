import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'quiet'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 select-none disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-deep active:bg-accent-deep',
  secondary: 'border border-ink/15 bg-bg text-ink hover:border-ink/40 hover:bg-bg-alt',
  quiet: 'text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-12 px-6 text-base',
}

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode }

export function buttonClasses({ variant = 'primary', size = 'lg', className = '' }: Omit<Common, 'children'>) {
  return `${base} ${variants[variant]} ${variant === 'quiet' ? '' : sizes[size]} ${className}`.trim()
}

export function Button({ variant, size, className, children, type = 'button', ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({ variant, size, className, children, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </a>
  )
}
