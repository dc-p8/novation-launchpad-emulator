//[0x90, 0x70, 0b000011]
// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')

const midi = require('midi')

var _input = null;
var _output = null;

function findDeviceName(deviceName){
  let input = new midi.input();
  let output = new midi.output();
  let checkDeviceFree = (device => {
    let devices = [];
    for(let i = 0; i < input.getPortCount(); ++i){
      devices.push(input.getPortName(i));
    }
    for(let i = 0; i < output.getPortCount(); ++i){
      devices.push(output.getPortName(i));
    }
    console.log('devices', devices)
    return (devices.find((d) =>{ return (d == device)}) == null);
  });
  let index = 0;
  deviceName = `${deviceName}-${index}`;
  while(!checkDeviceFree(deviceName)){
    console.log(deviceName);
    deviceName = `${deviceName}-${++index}`;
  }
  return deviceName;
}

ipcMain.on('enable-device', (event, arg) => {
  //deviceName = findDeviceName(arg);
  if(_input == null && _output == null)
  {
    _input = new midi.input();
    _output = new midi.output();
    _input.on('message', (deltaTime, data) => {
      event.sender.send('fake-input-message', data)
    });
  
    _input.openVirtualPort(arg);  
    _output.openVirtualPort(arg);
  }
  else{
    console.log('already exist')
  }
  // if(_input != null)
  //   _input.closePort();
  // if(_output != null)
  //   _output.closePort();



  


});




// Keep a global reference of the window object, if you don't,  window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:4200/')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.