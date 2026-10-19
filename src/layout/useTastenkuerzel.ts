import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const ziele: Record<string, string> = {
  u: '/',
  p: '/projekte',
  k: '/ki',
  i: '/ideen',
  w: '/wissen',
}

function inEingabefeld(ziel: EventTarget | null): boolean {
  if (!(ziel instanceof HTMLElement)) return false
  return ziel.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(ziel.tagName)
}

export function useTastenkuerzel(paletteUmschalten: () => void) {
  const navigate = useNavigate()
  const wartetAufZiel = useRef(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    function beiTaste(e: KeyboardEvent) {
      const taste = e.key.toLowerCase()

      if ((e.ctrlKey || e.metaKey) && taste === 'k') {
        e.preventDefault()
        paletteUmschalten()
        return
      }

      if (e.ctrlKey || e.metaKey || e.altKey || inEingabefeld(e.target)) return

      if (wartetAufZiel.current) {
        wartetAufZiel.current = false
        window.clearTimeout(timer.current)
        const pfad = ziele[taste]
        if (pfad) {
          e.preventDefault()
          navigate(pfad)
        }
        return
      }

      if (taste === 'g') {
        wartetAufZiel.current = true
        timer.current = window.setTimeout(() => {
          wartetAufZiel.current = false
        }, 1000)
      }
    }

    window.addEventListener('keydown', beiTaste)
    return () => {
      window.removeEventListener('keydown', beiTaste)
      window.clearTimeout(timer.current)
    }
  }, [navigate, paletteUmschalten])
}