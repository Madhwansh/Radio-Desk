const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let store;
let mainWindow;

async function createWindow() {
  // Dynamically import electron-store
  const { default: Store } = await import('electron-store');
  store = new Store();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    },
  });

  // IPC Handlers
// In main.js
// In main.js
ipcMain.handle('get-absolute-path', (_, filename) => {
  const absolutePath = path.resolve(__dirname, '..', 'backend', 'uploads', filename);
  console.log('Resolved Path:', absolutePath); // Debug log
  return absolutePath;
});


  ipcMain.on('store-images', (_, images) => {
    store.set('images', images);
  });

  ipcMain.handle('get-images', () => {
    return store.get('images', []);
  });

  mainWindow.loadFile("index.html");

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}

app.whenReady().then(createWindow);
