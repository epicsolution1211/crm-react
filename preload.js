const { contextBridge } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: expose a method to get app version
  getVersion: () => process.versions.electron,
  
  // Example: expose a method to get platform info
  getPlatform: () => process.platform,
  
  // Example: expose a method to get app name
  getAppName: () => process.env.npm_package_name || 'crm',
  
  // Add more methods as needed for your app
  // For example, if you need to communicate with the main process:
  // sendMessage: (message) => ipcRenderer.invoke('send-message', message),
  // onMessage: (callback) => ipcRenderer.on('message', callback)
})

// Remove node integration from the window object for security
delete window.require
delete window.exports
delete window.module