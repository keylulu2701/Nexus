const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('nexusDesktop', {
  ordnerWaehlen: () => ipcRenderer.invoke('ordner:waehlen'),
  ordnerLesen: (pfad) => ipcRenderer.invoke('ordner:lesen', pfad),
  ordnerErkennen: (pfad) => ipcRenderer.invoke('ordner:erkennen', pfad),
  gitStatus: (pfad) => ipcRenderer.invoke('git:status', pfad),
  imExplorerOeffnen: (pfad) => ipcRenderer.invoke('ordner:imExplorer', pfad),
  inVSCodeOeffnen: (pfad) => ipcRenderer.invoke('ordner:inVSCode', pfad),
  appInfo: () => ipcRenderer.invoke('app:info'),
  updateStatus: () => ipcRenderer.invoke('update:status'),
  updatePruefen: () => ipcRenderer.invoke('update:pruefen'),
  updateInstallieren: () => ipcRenderer.invoke('update:installieren'),
  beiUpdateStatus: (rueckruf) => {
    const hoerer = (_event, status) => rueckruf(status)
    ipcRenderer.on('update:status', hoerer)
    return () => ipcRenderer.removeListener('update:status', hoerer)
  },
})