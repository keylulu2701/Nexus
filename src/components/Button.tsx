import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primaer' | 'sekundaer' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante
}

const stile: Record<Variante, string> = {
  primaer: 'nx-knopf text-white',
  sekundaer:
    'border border-nx-line bg-white/5 text-nx-text hover:border-nx-violet/40 hover:bg-nx-violet/10',
  ghost: 'text-nx-muted hover:bg-white/10 hover:text-nx-text',
}

export function Button({ variante = 'primaer', className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${stile[variante]} ${className}`}
      {...rest}
    />
  )
}