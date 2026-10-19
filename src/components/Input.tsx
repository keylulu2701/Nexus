import type { InputHTMLAttributes } from 'react'

export function Input({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-nx-line bg-nx-bg px-3 py-2 text-sm text-nx-text placeholder:text-nx-muted hover:border-nx-text/25 ${className}`}
      {...rest}
    />
  )
}