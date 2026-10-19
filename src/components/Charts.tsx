export type Reihe = { name: string; werte: number[]; klasse: string; punkt: string }

export function LinienChart({
  reihen,
  labels,
  beschreibung,
}: {
  reihen: Reihe[]
  labels: string[]
  beschreibung: string
}) {
  const B = 600
  const H = 200
  const max = Math.max(20, Math.ceil(Math.max(...reihen.flatMap((r) => r.werte)) / 20) * 20)
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((f) => Math.round(max * f))

  function bahn(werte: number[]) {
    const schritt = B / (werte.length - 1)
    const p = werte.map((w, i) => ({ x: i * schritt, y: 6 + (H - 12) * (1 - w / max) }))
    return p
      .map((q, i) => {
        if (i === 0) return `M${q.x},${q.y}`
        const mx = (p[i - 1].x + q.x) / 2
        return `C${mx},${p[i - 1].y} ${mx},${q.y} ${q.x},${q.y}`
      })
      .join(' ')
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-4 text-xs text-nx-muted">
        {reihen.map((r) => (
          <span key={r.name} className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${r.punkt}`} />
            {r.name}
          </span>
        ))}
      </div>
      <div className="flex gap-3">
        <div className="flex h-48 flex-col justify-between font-mono text-xs text-nx-muted">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${B} ${H}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={beschreibung}
            className="h-48 w-full"
          >
            {[0.25, 0.5, 0.75].map((g) => (
              <line
                key={g}
                x1="0"
                x2={B}
                y1={H * g}
                y2={H * g}
                stroke="#F5F3FF"
                strokeOpacity="0.08"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {reihen.map((r, i) => (
              <g key={r.name} className={`${r.klasse} drop-shadow-[0_0_6px_currentColor]`}>
                <defs>
                  <linearGradient id={`lc-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${bahn(r.werte)} L${B},${H} L0,${H} Z`} fill={`url(#lc-${i})`} />
                <path
                  d={bahn(r.werte)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>
          <div className="mt-2 flex justify-between font-mono text-xs text-nx-muted">
            {labels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}