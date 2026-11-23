import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'light' | 'danger' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 select-none whitespace-nowrap ' +
  'disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-600 active:bg-accent-600',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-white',
  ghost: 'text-ink hover:bg-paper-2',
  light: 'bg-white text-ink hover:bg-paper',
  danger: 'bg-danger text-white hover:bg-[#842424]',
  link: 'px-0 underline underline-offset-4 decoration-stone-400 hover:decoration-ink',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-[14px]',
  lg: 'h-13 px-8 text-[15px]',
  icon: 'h-10 w-10 p-0',
}

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(base, variants[variant], variant === 'link' ? 'h-auto' : sizes[size], className)
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize; children: ReactNode }) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  )
}
