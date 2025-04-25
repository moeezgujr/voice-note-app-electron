import { app, BrowserWindow, shell, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import { update } from "./update";
import fs from "fs"; // Add this import
import { dialog } from 'electron';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, "../..");

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    width: 1920,
    height: 1080,
    fullscreen:false,
    maximizable: true,

    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      enableBlinkFeatures: "MediaDevices",

      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    // #298
    win.loadURL(VITE_DEV_SERVER_URL);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  // Auto update
  update(win);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
app.commandLine.appendSwitch("enable-media-stream");
app.commandLine.appendSwitch("ignore-certificate-errors");
app.commandLine.appendSwitch("allow-file-access-from-files");
app.commandLine.appendSwitch("enable-usermedia-screen-capturing");
// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: false,         // Optional: true for fullscreen (no taskbar, no window bar)
    maximizable: true,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true,
      enableBlinkFeatures: "MediaDevices",
      webSecurity:false
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
ipcMain.handle('save-image', async (event, base64Data) => {
  try {
    // Use the 'public' directory instead of 'documents' directory
    const publicDir = path.join(__dirname, 'public', 'app-snapshots');

    // Create directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(publicDir, `snapshot-${timestamp}.png`);

    // Remove the base64 prefix
    const base64Image = base64Data.split(';base64,').pop();
    
    // Write file
    fs.writeFileSync(filePath, base64Image, { encoding: 'base64' });

    return { success: true, path: filePath };
  } catch (error) {
    console.error('Error saving image:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: String(error) };
  }
});
ipcMain.handle('open-save-location', async () => {
  if (!win) return;
  
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  });
  
  return result.filePaths[0] || app.getPath('documents');
});
ipcMain.handle('get-saved-snapshots', async () => {
  try {
    // Update the directory to the 'public/app-snapshots' folder
    const snapshotsDir = path.join(__dirname, 'public', 'app-snapshots');

    // Check if the directory exists
    if (!fs.existsSync(snapshotsDir)) {
      return [];
    }

    // Read the files in the directory
    const files = fs.readdirSync(snapshotsDir);

    // Process PNG files and convert to base64
    const snapshots = await Promise.all(
      files
        .filter(file => file.endsWith('.png'))
        .map(async (file) => {
          const filePath = path.join(snapshotsDir, file);
          const stats = fs.statSync(filePath);
          const timestamp = stats.birthtime.toISOString();
          const id = path.basename(file, '.png').replace('snapshot-', '');
          
          // Read file and convert to base64
          const data = await fs.promises.readFile(filePath);
          const base64 = data.toString('base64');
          const dataUrl = `data:image/png;base64,${base64}`;
          
          return {
            id,
            filePath,
            dataUrl, // Add the base64 data URL
            timestamp,
            name: `Snapshot ${id}`
          };
        })
    );

    return snapshots;
    
  } catch (error) {
    console.error('Error getting snapshots:', error);
    throw error;
  }
});

ipcMain.handle('delete-snapshot', async (event, id) => {
  try {
    const snapshotsDir = path.join(app.getPath('documents'), 'app-snapshots')
    const filePath = path.join(snapshotsDir, `snapshot-${id}.png`)
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return { success: true }
    }
    return { success: false, error: 'File not found' }
  } catch (error) {
    console.error('Error deleting snapshot:', error)
    throw error
  }
})
ipcMain.handle('save-recording', async (event, { audioData, name, duration }) => {
  try {
    const recordingsDir = path.join(app.getPath('documents'), 'app-recordings');
    
    if (!fs.existsSync(recordingsDir)) {
      fs.mkdirSync(recordingsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `recording-${timestamp}.webm`;
    const filePath = path.join(recordingsDir, fileName);
    
    // Convert base64 to buffer and write to file
    const buffer = Buffer.from(audioData.split(',')[1], 'base64');
    fs.writeFileSync(filePath, buffer);

    return {
      success: true,
      recording: {
        id: timestamp,
        filePath,
        url: `file://${filePath}`,
        name: name || `Recording ${timestamp}`,
        duration,
        timestamp
      }
    };
  }catch (error) {
    console.error('Error saving image:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('get-saved-recordings', async () => {
  try {
    const recordingsDir = path.join(app.getPath('documents'), 'app-recordings');
    
    if (!fs.existsSync(recordingsDir)) {
      return [];
    }

    const files = fs.readdirSync(recordingsDir);
    const recordings = [];

    for (const file of files.filter(f => f.endsWith('.webm'))) {
      try {
        const filePath = path.join(recordingsDir, file);
        const stats = fs.statSync(filePath);
        const timestamp = stats.birthtime.toISOString();
        const id = path.basename(file, '.webm').replace('recording-', '');

        // Get duration (you might want to store this in metadata when saving)
        const duration = Math.round(stats.size / 10000); // Rough estimate
        
        // Read the file as base64
        const fileBuffer = fs.readFileSync(filePath);
        const base64Audio = fileBuffer.toString('base64');
        
        recordings.push({
          id,
          filePath,
          url: `file://${filePath}`,
          name: `Recording ${id}`,
          duration,
          timestamp,
          base64Audio: `data:audio/webm;base64,${base64Audio}` // Include base64 string
        });
      } catch (fileError) {
        console.error(`Error processing recording ${file}:`, fileError);
      }
    }

    return recordings;
  } catch (error) {
    console.error('Error getting recordings:', error);
    throw error;
  }
});


ipcMain.handle('delete-recording', async (event, id) => {
  try {
    const recordingsDir = path.join(app.getPath('documents'), 'app-recordings');
    const filePath = path.join(recordingsDir, `recording-${id}.webm`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    }
    return { success: false, error: 'File not found' };
  } catch (error) {
    console.error('Error deleting recording:', error);
    throw error;
  }
});