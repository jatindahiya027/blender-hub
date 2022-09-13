const { app, dialog } = require('electron')
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.allowPrerelease = false;
log.info('App starting...');

const options = { 
    type: "question", 
    buttons: ['restart', 'afterwards'], 
    title: "I downloaded the update.", 
    message: "You can click restart to update now。" 
}

function sendStatusToWindow(text) {
    log.info(text);
}
autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
    dialog.showMessageBox(null, options).then((res) => {
        if (res.response == 0) {
            autoUpdater.quitAndInstall(false, true)
        }
    })
});
app.on('ready', async () => {
    autoUpdater.checkForUpdatesAndNotify();
})