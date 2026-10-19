const PFLICHT = ['nexus.projekte.v1', 'nexus.ideen.v2', 'nexus.ereignisse.v1']
const NOTIZEN = 'nexus.notizen.v1'
const ALLE = [...PFLICHT, NOTIZEN]

export function backupErstellen() {
  const daten: Record<string, unknown> = {}
  for (const k of ALLE) {
    try {
      const roh = localStorage.getItem(k)
      daten[k] = roh ? JSON.parse(roh) : []
    } catch {
      daten[k] = []
    }
  }
  const inhalt = JSON.stringify({ app: 'nexus', version: 1, erstellt: Date.now(), daten }, null, 2)
  const blob = new Blob([inhalt], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const tag = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `nexus-backup-${tag}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function backupEinspielen(datei: File): Promise<boolean> {
  try {
    const obj: unknown = JSON.parse(await datei.text())
    if (!obj || typeof obj !== 'object') return false
    const o = obj as { app?: string; daten?: Record<string, unknown> }
    if (o.app !== 'nexus' || !o.daten) return false
    for (const k of PFLICHT) {
      if (!Array.isArray(o.daten[k])) return false
    }
    for (const k of PFLICHT) {
      localStorage.setItem(k, JSON.stringify(o.daten[k]))
    }
    const notizen = o.daten[NOTIZEN]
    localStorage.setItem(NOTIZEN, JSON.stringify(Array.isArray(notizen) ? notizen : []))
    return true
  } catch {
    return false
  }
}