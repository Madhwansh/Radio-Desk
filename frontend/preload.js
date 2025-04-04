const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  storeImages: (images) => ipcRenderer.send("store-images", images),
  getImages: () => ipcRenderer.invoke("get-images"),
  getAbsolutePath: (relativePath) => ipcRenderer.invoke('get-absolute-path', relativePath),
  showError: (message) => ipcRenderer.send('show-error-dialog', message),
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => 
    ipcRenderer.on(channel, (event, args) => callback(args)),
});