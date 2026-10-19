export function vorZeit(ts: number): string {
  const min = Math.floor((Date.now() - ts) / 60000)
  if (min < 1) return 'gerade eben'
  if (min < 60) return `vor ${min} Min.`
  const std = Math.floor(min / 60)
  if (std < 24) return `vor ${std} Std.`
  const tage = Math.floor(std / 24)
  if (tage === 1) return 'gestern'
  if (tage < 7) return `vor ${tage} Tagen`
  const wochen = Math.floor(tage / 7)
  return wochen === 1 ? 'vor 1 Woche' : `vor ${wochen} Wochen`
}

export function tageSeit(ts: number): number {
  return Math.floor((Date.now() - ts) / 86400000)
}

export function letzteMonate(n: number): { start: number; ende: number; label: string }[] {
  const jetzt = new Date()
  return Array.from({ length: n }, (_, i) => {
    const von = new Date(jetzt.getFullYear(), jetzt.getMonth() - (n - 1 - i), 1)
    const bis = new Date(von.getFullYear(), von.getMonth() + 1, 1)
    return {
      start: von.getTime(),
      ende: bis.getTime(),
      label: von.toLocaleDateString('de-DE', { month: 'short' }),
    }
  })
}