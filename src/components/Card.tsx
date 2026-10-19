import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-nx-line bg-nx-panel p-4 ${className}`}
      {...rest}
    />
  )
}