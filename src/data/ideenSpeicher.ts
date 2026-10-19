export const IDEEN_SPEICHER_KEY = 'nexus.ideen'

export function zaehleOffeneIdeen(): number {
  try {
    const roh = localStorage.getItem(IDEEN_SPEICHER_KEY)
    const daten: unknown = roh ? JSON.parse(roh) : []
    if (!Array.isArray(daten)) return 0
    return daten.filter(
      (i) => i && typeof i === 'object' && (i as { status?: string }).status !== 'Erledigt',
    ).length
  } catch {
    return 0
  }
}