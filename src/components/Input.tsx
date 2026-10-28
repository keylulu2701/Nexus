import type { InputHTMLAttributes } from 'react'

export function Input({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-nx-line bg-nx-bg/70 px-3 py-2 text-sm text-nx-text transition-colors placeholder:text-nx-muted hover:border-nx-violet/40 focus-visible:border-nx-violet/70 focus-visible:shadow-[0_0_0_3px_rgb(157_107_255/0.18)] focus-visible:outline-none ${className}`}
      {...rest}
    />
  )
}