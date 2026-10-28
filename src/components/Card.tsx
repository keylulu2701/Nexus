import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-nx-line bg-nx-panel bg-gradient-to-br from-white/[0.04] to-transparent p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] ${className}`}
      {...rest}
    />
  )
}