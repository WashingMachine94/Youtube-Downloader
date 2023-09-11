const { app, BrowserWindow, remote } = require('electron');
const ipcMain = require('electron').ipcMain;
const path = require('path');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let win;

const createWindow = () => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 644,
    height: 135,
    titleBarStyle: 'hidden',
    frame: false,
    icon: __dirname + '/Images/YoutubeDownloader.ico',
    webPreferences: {
      autoHideMenuBar: true,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      // devTools: false
    },
  });

  win.on('moved', (e) => {

  })
  
  win.webContents.on('render-process-gone', function (event, detailed) {
    //  logger.info("!crashed, reason: " + detailed.reason + ", exitCode = " + detailed.exitCode)
    console.log("!crashed, reason: " + detailed.reason + ", exitCode = " + detailed.exitCode + "\n" + JSON.stringify(detailed)) 
    if (detailed.reason == "crashed"){
        // relaunch app
        app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
        app.exit(0)
    }
})

  win.loadFile(path.join(__dirname, 'index.html'))
      // .then(() => { win.webContents.openDevTools(); })

  return win;
};



//handle crashes and kill events
app.on('uncaughtException', function(err) {
  //log the message and stack trace
  console.log(err);
  fs.writeFileSync('crash.log', err + "\n" + err.stack);

  //do any cleanup like shutting down servers, etc

  //relaunch the app (if you want)
  app.relaunch({args: []});
  app.exit(0);
});

// app.setPath('crashDumps', '/path/to/crashes')

app.on('ready', () => {
  win = createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
  }
});

ipcMain.on('app/minimize', () => {
  win.minimize();
});

ipcMain.on('app/close', () => {
  win.close();
});