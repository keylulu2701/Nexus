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

// Automatische Updates über GitHub (nur in der installierten App)
function updatesPruefen(fenster) {
  if (!app.isPackaged) return

  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-downloaded', async (info) => {
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

  autoUpdater.on('error', () => {
    // Kein Internet oder kein Release gefunden: still ignorieren
  })

  autoUpdater.checkForUpdates().catch(() => {})
}

function fensterErstellen() {
  const fenster = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: '#0B0D14',
    autoHideMenuBar: true,
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

  fenster.webContents.once('did-finish-load', () => updatesPruefen(fenster))
}

// Ordner wählen
ipcMain.handle('ordner:waehlen', async () => {
  const antwort = await dialog.showOpenDialog({
    title: 'Projektordner wählen',
    properties: ['openDirectory'],
  })
  if (antwort.canceled || antwort.filePaths.length === 0) return null
  return antwort.filePaths[0]
})

// Inhalt der obersten Ebene lesen
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

// Git-Status abfragen
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

// Im Explorer öffnen
ipcMain.handle('ordner:imExplorer', async (_event, ordnerPfad) => {
  if (!istOrdner(ordnerPfad)) return { fehler: 'Ordner nicht gefunden.' }
  const meldung = await shell.openPath(ordnerPfad)
  return meldung ? { fehler: meldung } : { ok: true }
})

// In VS Code öffnen
ipcMain.handle('ordner:inVSCode', async (_event, ordnerPfad) => {
  if (!istOrdner(ordnerPfad)) return { fehler: 'Ordner nicht gefunden.' }
  return new Promise((resolve) => {
    const prozess = spawn('code', [`"${ordnerPfad}"`], { shell: true, windowsHide: true, detached: true, stdio: 'ignore' })
    prozess.on('error', () => resolve({ fehler: 'VS Code wurde nicht gefunden.' }))
    prozess.unref()
    setTimeout(() => resolve({ ok: true }), 600)
  })
})

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

  app.whenReady().then(fensterErstellen)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}