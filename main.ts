import {app, BrowserWindow, screen} from 'electron';
import * as path from 'path';
import * as url from 'url';
import {autoUpdater} from 'electron-updater';
import * as log from 'electron-log';


autoUpdater.logger = log;

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

let downloading = false;

function createWindow() {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

app.on('ready', () => {
  setInterval(() => {
    if (!downloading) {
      checkForUpdates();
    }
  }, 10000);
});

autoUpdater.on('update-available', () => {
  downloading = true;
});

autoUpdater.on('update-downloaded', () => {
  downloading = false;
  autoUpdater.quitAndInstall();
});

const checkForUpdates = () => {
  log.info('checking for update....');
  log.info('Running in development');
  log.info('Running in production');
  autoUpdater.checkForUpdates().catch((error) => {
    if (isNetworkError(error)) {
      log.info('Network Error');
    } else {
      log.info('Unknown Error');
      log.info(error == null ? 'unknown' : (error.stack || error).toString());
    }
  });
};


function isNetworkError(errorObject) {
  return errorObject.message === 'net::ERR_INTERNET_DISCONNECTED' ||
    errorObject.message === 'net::ERR_PROXY_CONNECTION_FAILED' ||
    errorObject.message === 'net::ERR_CONNECTION_RESET' ||
    errorObject.message === 'net::ERR_CONNECTION_CLOSE' ||
    errorObject.message === 'net::ERR_NAME_NOT_RESOLVED' ||
    errorObject.message === 'net::ERR_CONNECTION_TIMED_OUT';
}

