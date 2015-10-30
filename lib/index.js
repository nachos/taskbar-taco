var app = require('app');
var BrowserWindow = require('browser-window');
var path = require('path');

var mainWindow = null;

var pathToTaskbar = path.join(app.getAppPath(), './client/index.html');

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    frame: false,
    'web-preferences': {
      'web-security': false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + pathToTaskbar);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
