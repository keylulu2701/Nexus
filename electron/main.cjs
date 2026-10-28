const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const fs = require('fs')
const { execFile, spawn } = require('child_process')

const IGNORIERT = new Set(['node_modules', '.git', 'dist', 'release', '.godot', '.import'])

function istOrdner(p) {
  try {
    return typeof p === 'string' && path.isAbsolute(p) && fs.statSync(p).isDirectory()
  } catch {
    return false
  }
}

// ---------- Updates ----------

let updateStatus = { status: 'leer' }

function statusSetzen(neu) {
  updateStatus = neu
  BrowserWindow.getAllWindows().forEach((w) => {
    if (!w.isDestroyed()) w.webContents.send('update:status', neu)
  })
}

function updaterEinrichten() {
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => statusSetzen({ status: 'sucht' }))
  autoUpdater.on('update-available', (info) =>
    statusSetzen({ status: 'laedt', version: info.version, prozent: 0 }),
  )
  autoUpdater.on('update-not-available', () => statusSetzen({ status: 'aktuell' }))
  autoUpdater.on('download-progress', (p) =>
    statusSetzen({
      status: 'laedt',
      version: updateStatus.version,
      prozent: Math.round(p.percent),
    }),
  )
  autoUpdater.on('error', () => statusSetzen({ status: 'fehler' }))
  autoUpdater.on('update-downloaded', async (info) => {
    statusSetzen({ status: 'bereit', version: info.version })
    const fenster = BrowserWindow.getAllWindows()[0]
    const antwort = await dialog.showMessageBox(fenster, {
      type: 'info',
      buttons: ['Jetzt neu starten', 'Später'],
      defaultId: 0,
      cancelId: 1,
      title: 'Update bereit',
      message: `NEXUS ${info.version} ist bereit.`,
      detail: 'Starte NEXUS neu, um das Update zu installieren.',
    })
    if (antwort.response === 0) autoUpdater.quitAndInstall()
  })
}

function updateSuchen() {
  if (!app.isPackaged) {
    statusSetzen({ status: 'nurInstalliert' })
    return
  }
  if (updateStatus.status === 'sucht' || updateStatus.status === 'laedt') return
  if (updateStatus.status === 'bereit') return
  autoUpdater.checkForUpdates().catch(() => statusSetzen({ status: 'fehler' }))
}

ipcMain.handle('app:info', () => ({ version: app.getVersion(), installiert: app.isPackaged }))
ipcMain.handle('update:status', () => updateStatus)
ipcMain.handle('update:pruefen', () => {
  updateSuchen()
})
ipcMain.handle('update:installieren', () => {
  if (updateStatus.status === 'bereit') autoUpdater.quitAndInstall()
})

// ---------- Fenster ----------

function fensterErstellen() {
  const fenster = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: '#080814',
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#0a0914', symbolColor: '#f5f3ff', height: 56 },
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  fenster.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))

  fenster.webContents.on('before-input-event', (_event, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') {
      fenster.webContents.toggleDevTools()
    }
  })

  fenster.webContents.once('did-finish-load', () => updateSuchen())
}

// ---------- Ordner erkennen ----------

function jsonLesen(datei) {
  try {
    const roh = fs.readFileSync(datei, 'utf8').replace(/^\uFEFF/, '')
    return JSON.parse(roh)
  } catch {
    return null
  }
}

function endungenZaehlen(wurzel) {
  const zaehler = {}
  let gesehen = 0

  function lauf(ordner, tiefe) {
    if (tiefe > 3 || gesehen > 3000) return
    let eintraege
    try {
      eintraege = fs.readdirSync(ordner, { withFileTypes: true })
    } catch {
      return
    }
    for (const eintrag of eintraege) {
      if (gesehen > 3000) return
      if (eintrag.isDirectory()) {
        if (!IGNORIERT.has(eintrag.name) && !eintrag.name.startsWith('.')) {
          lauf(path.join(ordner, eintrag.name), tiefe + 1)
        }
      } else {
        gesehen++
        const ende = path.extname(eintrag.name).toLowerCase()
        if (ende) zaehler[ende] = (zaehler[ende] || 0) + 1
      }
    }
  }

  lauf(wurzel, 0)
  return zaehler
}

const SPRACHEN = {
  '.gd': 'GDScript',
  '.cs': 'C#',
  '.py': 'Python',
  '.rs': 'Rust',
  '.go': 'Go',
  '.java': 'Java',
  '.cpp': 'C++',
  '.lua': 'Lua',
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript',
  '.js': 'JavaScript',
}

const PAKETE = {
  react: 'React',
  vue: 'Vue',
  svelte: 'Svelte',
  next: 'Next.js',
  astro: 'Astro',
  vite: 'Vite',
  tailwindcss: 'Tailwind CSS',
  electron: 'Electron',
  typescript: 'TypeScript',
  express: 'Express',
  three: 'Three.js',
  phaser: 'Phaser',
}

function erkennen(ordnerPfad) {
  const namen = fs.readdirSync(ordnerPfad)
  const istGodot = namen.includes('project.godot')
  const paket = namen.includes('package.json') ? jsonLesen(path.join(ordnerPfad, 'package.json')) : null
  const hatIndexHtml = namen.includes('index.html')

  let name = path.basename(ordnerPfad)
  let beschreibung = ''
  const technologien = []

  if (istGodot) {
    technologien.push('Godot')
    try {
      const text = fs.readFileSync(path.join(ordnerPfad, 'project.godot'), 'utf8')
      const n = text.match(/config\/name="([^"]+)"/)
      const b = text.match(/config\/description="([^"]*)"/)
      if (n && n[1].trim()) name = n[1].trim()
      if (b && b[1].trim()) beschreibung = b[1].trim()
    } catch {
      // Datei nicht lesbar: Ordnername behalten
    }
  }

  let abhaengigkeiten = {}
  if (paket) {
    if (typeof paket.name === 'string' && paket.name.trim() && !istGodot) name = paket.name.trim()
    if (typeof paket.description === 'string' && paket.description.trim() && !beschreibung) {
      beschreibung = paket.description.trim()
    }
    abhaengigkeiten = { ...(paket.dependencies || {}), ...(paket.devDependencies || {}) }
    for (const [schluessel, anzeige] of Object.entries(PAKETE)) {
      if (abhaengigkeiten[schluessel]) technologien.push(anzeige)
    }
  }

  const zaehler = endungenZaehlen(ordnerPfad)
  const sprachen = Object.entries(zaehler)
    .filter(([ende]) => SPRACHEN[ende])
    .sort((a, b) => b[1] - a[1])
    .map(([ende]) => SPRACHEN[ende])
  for (const s of sprachen) {
    if (!technologien.includes(s)) technologien.push(s)
  }
  if (technologien.includes('TypeScript')) {
    const i = technologien.indexOf('JavaScript')
    if (i >= 0) technologien.splice(i, 1)
  }

  let typ = 'Experiment'
  if (abhaengigkeiten.electron || abhaengigkeiten['@tauri-apps/api'] || abhaengigkeiten.expo || abhaengigkeiten['react-native']) {
    typ = 'App'
  } else if (istGodot) {
    typ = 'Spiel'
  } else if (paket || hatIndexHtml) {
    typ = 'Webseite'
  }

  return { name, typ, beschreibung, technologien: technologien.slice(0, 6) }
}

ipcMain.handle('ordner:erkennen', async (_event, ordnerPfad) => {
  if (!istOrdner(ordnerPfad)) return { fehler: 'Ordner nicht gefunden.' }
  try {
    return erkennen(ordnerPfad)
  } catch {
    return { fehler: 'Ordner konnte nicht analysiert werden.' }
  }
})

// ---------- Ordner und Git ----------

ipcMain.handle('ordner:waehlen', async () => {
  const antwort = await dialog.showOpenDialog({
    title: 'Projektordner wählen',
    properties: ['openDirectory'],
  })
  if (antwort.canceled || antwort.filePaths.length === 0) return null
  return antwort.filePaths[0]
})

ipcMain.handle('ordner:lesen', async (_event, ordnerPfad) => {
  if (!istOrdner(ordnerPfad)) return { fehler: 'Ordner nicht gefunden.' }
  try {
    const namen = fs.readdirSync(ordnerPfad)
    const eintraege = []
    for (const name of namen) {
      if (IGNORIERT.has(name)) continue
      try {
        const info = fs.statSync(path.join(ordnerPfad, name))
        eintraege.push({
          name,
          istOrdner: info.isDirectory(),
          groesse: info.isDirectory() ? 0 : info.size,
          geaendert: info.mtimeMs,
        })
      } catch {
        // Datei nicht lesbar: überspringen
      }
    }
    eintraege.sort((a, b) => {
      if (a.istOrdner !== b.istOrdner) return a.istOrdner ? -1 : 1
      return a.name.localeCompare(b.name, 'de')
    })
    return {
      name: path.basename(ordnerPfad),
      pfad: ordnerPfad,
      eintraege: eintraege.slice(0, 300),
      anzahlGesamt: eintraege.length,
      istGodot: namen.includes('project.godot'),
      hatPackageJson: namen.includes('package.json'),
      hatGit: namen.includes('.git'),
    }
  } catch (e) {
    return { fehler: 'Ordner konnte nicht gelesen werden.' }
  }
})

ipcMain.handle('git:status', async (_event, ordnerPfad) => {
  if (!istOrdner(ordnerPfad)) return { fehler: 'Ordner nicht gefunden.' }
  return new Promise((resolve) => {
    execFile(
      'git',
      ['-C', ordnerPfad, 'status', '--porcelain=v1', '-b'],
      { timeout: 8000, windowsHide: true },
      (fehler, ausgabe) => {
        if (fehler) {
          if (fehler.code === 'ENOENT') return resolve({ fehler: 'Git ist nicht installiert.' })
          return resolve({ fehler: 'Kein Git-Projekt.' })
        }
        const zeilen = ausgabe.split('\n').filter(Boolean)
        const kopf = zeilen.find((z) => z.startsWith('## ')) || ''
        const branch = kopf.slice(3).split('...')[0].split(' ')[0] || 'unbekannt'
        const geaendert = zeilen.filter((z) => !z.startsWith('## ')).length
        resolve({ branch, geaendert, sauber: geaendert === 0 })
      },
    )
  })
})

ipcMain.handle('ordner:imExplorer', async (_event, ordnerPfad) => {
  if (!istOrdner(ordnerPfad)) return { fehler: 'Ordner nicht gefunden.' }
  const meldung = await shell.openPath(ordnerPfad)
  return meldung ? { fehler: meldung } : { ok: true }
})

ipcMain.handle('ordner:inVSCode', async (_event, ordnerPfad) => {
  if (!istOrdner(ordnerPfad)) return { fehler: 'Ordner nicht gefunden.' }
  return new Promise((resolve) => {
    const prozess = spawn('code', [`"${ordnerPfad}"`], { shell: true, windowsHide: true, detached: true, stdio: 'ignore' })
    prozess.on('error', () => resolve({ fehler: 'VS Code wurde nicht gefunden.' }))
    prozess.unref()
    setTimeout(() => resolve({ ok: true }), 600)
  })
})

// ---------- Start ----------

const hauptInstanz = app.requestSingleInstanceLock()
if (!hauptInstanz) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const fenster = BrowserWindow.getAllWindows()[0]
    if (fenster) {
      if (fenster.isMinimized()) fenster.restore()
      fenster.focus()
    }
  })

  app.whenReady().then(() => {
    updaterEinrichten()
    fensterErstellen()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}