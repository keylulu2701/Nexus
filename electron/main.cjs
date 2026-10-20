const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')

function fensterErstellen() {
  const fenster = new BrowserWindow({
    icon: require('path').join(__dirname, '..', 'build', 'icon.png'),
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#0B0D14',
    title: 'NEXUS',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  Menu.setApplicationMenu(null)
  fenster.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))

  // F12 öffnet die Entwicklertools (zum Fehlersuchen)
  fenster.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') {
      fenster.webContents.toggleDevTools()
      event.preventDefault()
    }
  })

  // Externe Links öffnen im normalen Browser
  fenster.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

const einzigeInstanz = app.requestSingleInstanceLock()

if (!einzigeInstanz) {
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
    fensterErstellen()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) fensterErstellen()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}