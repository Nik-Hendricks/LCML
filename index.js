// main.js

// Modules to control application life and create native browser window
const fs = require('fs')
const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const remoteMain = require('@electron/remote/main');



remoteMain.initialize();


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame:false,
    maximizable:false,
    resizable:false,
    webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, 'preload.js')
    },
  })
  mainWindow.loadFile('index.html')
  remoteMain.enable(mainWindow.webContents)
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})