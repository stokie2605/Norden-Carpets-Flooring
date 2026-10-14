import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ink' | 'inverse' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 select-none disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-deep active:bg-accent-deep',
  secondary: 'border-[1.5px] border-ink bg-bg text-ink hover:bg-bg-alt',
  ink: 'bg-ink text-white hover:bg-ink/85',
  inverse: 'bg-white text-ink hover:bg-bg-alt',
  quiet: 'text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-10 px-3.5 text-sm',
  md: 'min-h-11 px-[1.125rem] text-[0.9375rem]',
  lg: 'min-h-12 px-[1.375rem] text-base',
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
