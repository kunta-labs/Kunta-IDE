/*
Copyright 2017-Present The Kunta Protocol Authors
This file is part of the Kunta Protocol library.
The Kunta Protocol is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
The Kunta Protocol is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License
along with the Kunta Protocol library. If not, see <http://www.gnu.org/licenses/>.
*/

var PEntry = require('./core/PEntry.js')
var Lang = require('./core/Lang/language.js')

const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')

ipcMain.on('compile_call_message', (event, arg) => {
    console.log("compile call hit!")
    console.log(arg)

    var lang_result = Lang.SubmitSource(arg)

    event.sender.send('compile_call_reply', 
                      {
                        "Result": lang_result
                      }
    );

}) 

ipcMain.on('initiate_protocol_call_message', (event, arg) => {

    PEntry.Entry()
    event.sender.send('initiate_protocol_call_reply', "done");

}) 

ipcMain.on('cease_protocol_call_message', (event, arg) => {

    //CEASE TO PROTOCOL
    PEntry.CeaseProtocolInterval()
    event.sender.send('cease_protocol_call_reply', "done");


}) 

ipcMain.on('sign_call_message', (event, arg) => {
    event.sender.send('cease_protocol_call_reply', "done");
}) 

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ 
                            width: 1200, 
                            height: 1000,
                            resizable: false })

  // and load the index.html of the app.
  win.loadFile('html/index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', (function(){

  // win.webContents.on('did-finish-load', function() {
  //   win.webContents.executeJavaScript("alert('Hello There!');");
  // });
  console.log(win)

  createWindow()

}))


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

