const log = require('electron-log');
const path = require('path');
const url = require('url');
const { app, BrowserWindow } = require('electron');
const clipboard = require('./modules/clipboard');

let window;
let clipboardWindow;

/**
 * Create mainWindow
 */
function createWindow() {
    window = new BrowserWindow({
        width: 800, 
        height: 600, 
        // frame: false,
        // transparent: true
    });

    window.loadURL(url.format({
        "pathname": path.join(__dirname, 'windows/index.html'),
        "protocol": "file:",
        "slashes": true
    }));

    window.webContents.openDevTools();
    window.on('closed', () => window = null);
}

/**
 * Create clipboardWindow
 */
function createClipboardWindow() {
    clipboardWindow = new BrowserWindow({
        parent: window,
        width: 300,
        height: 500,
        frame: false,
        transparent: true
    });

    clipboardWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'windows/clipboard.html'),
        protocol: "file:",
        slashes: true
    }));

    clipboardWindow.setAlwaysOnTop(true);
    clipboardWindow.show();
}

/* ============= app ============== */
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (window === null) {
        createWindow();
    }
});

clipboard.on('changed', (data) => {
    log.info('-- text changed --');
    log.info('data', data);
    createClipboardWindow();
});

/* ============= clipboard ============== */
clipboard.watcher();