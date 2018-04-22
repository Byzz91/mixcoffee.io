const log = require('electron-log');
const $ = require('jquery');
const path = require('path');
const url = require('url');
const { app, BrowserWindow } = require('electron');
const clipboard = require('./modules/clipboard');

let mainWindow;

/**
 * Create mainWindow
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 300, 
        height: 500, 
        frame: false,
        transparent: true
    });

    mainWindow.loadURL(url.format({
        "pathname": path.join(__dirname, 'windows/clipboard.html'),
        "protocol": "file:",
        "slashes": true
    }));

    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => window = null);
}

/**
 * toFrontWindow
 */
function toFrontWindow() {
    if (typeof mainWindow === 'object') {
        mainWindow.setAlwaysOnTop(true);
        mainWindow.setAlwaysOnTop(false);
    }
}

/* ============= app ============== */
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

clipboard.on('changed', (data) => {
    log.info('-- text changed --');
    log.info('data', data);

    mainWindow.webContents.send('clipboard-text', data);
    toFrontWindow();
});

/* ============= clipboard ============== */
clipboard.watcher();