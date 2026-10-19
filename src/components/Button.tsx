import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primaer' | 'sekundaer' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante
}

const stile: Record<Variante, string> = {
  primaer: 'bg-nx-violet text-white hover:bg-nx-violet/85',
  sekundaer: 'border border-nx-line bg-nx-panel text-nx-text hover:bg-nx-text/10',
  ghost: 'text-nx-muted hover:bg-nx-text/10 hover:text-nx-text',
}

export function Button({ variante = 'primaer', className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${stile[variante]} ${className}`}
      {...rest}
    />
  )
}