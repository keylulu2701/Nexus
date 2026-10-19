function App() {
  const farben = [
    { name: 'nx-bg', klasse: 'bg-nx-bg' },
    { name: 'nx-panel', klasse: 'bg-nx-panel' },
    { name: 'nx-violet', klasse: 'bg-nx-violet' },
    { name: 'nx-cyan', klasse: 'bg-nx-cyan' },
    { name: 'nx-green', klasse: 'bg-nx-green' },
  ]

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-xl font-semibold">NEXUS Designsystem</h1>
      <p className="mt-1 text-sm text-nx-muted">Farben und Schriften</p>

      <div className="mt-6 flex gap-4">
        {farben.map((f) => (
          <div key={f.name} className="w-32">
            <div className={`h-16 rounded-lg border border-nx-line ${f.klasse}`} />
            <p className="mt-2 font-mono text-xs text-nx-muted">{f.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-nx-line bg-nx-panel p-4">
        <p className="text-sm">Dies ist Inter, die Schrift der Oberfläche.</p>
        <p className="mt-2 font-mono text-sm text-nx-cyan">Dies ist JetBrains Mono.</p>
      </div>
    </div>
  )
}

export default App