const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('nexusDesktop', {
  ordnerWaehlen: () => ipcRenderer.invoke('ordner:waehlen'),
  ordnerLesen: (pfad) => ipcRenderer.invoke('ordner:lesen', pfad),
  gitStatus: (pfad) => ipcRenderer.invoke('git:status', pfad),
  imExplorerOeffnen: (pfad) => ipcRenderer.invoke('ordner:imExplorer', pfad),
  inVSCodeOeffnen: (pfad) => ipcRenderer.invoke('ordner:inVSCode', pfad),
})