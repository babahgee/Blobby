const path = require("path"),
    url = require("url"),
    fs = require("fs"),
    colors = require("colors");

const states = {
    isInSystemDashboard: false,
    isInEntityDashboard: false
}

const windows = {
    systemDashboardWindow: null,
}

/**
 * Shows performance dashboard window.
 * @param {Socket} socket
 * @param {BrowserWindow} BrowserWindow
 */
function showSystemDashboardWindow(socket, BrowserWindow) {

    if (windows.systemDashboardWindow !== null) {

        return; 
    }

    const window = new BrowserWindow({
        width: 600,
        height: 670,
        minWidth: 700,
        minHeight: 670,
        title: "Performance dashboard",
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            nodeIntegrationInWorker: true,
        }
    });

    window.loadURL(url.format({
        pathname: path.join(__dirname, "../public/systemDashboard.html"),
        slashes: true,
        protocol: "file:"
    }));

    window.on("close", function () {

        windows.systemDashboardWindow = null;

        setTimeout(function () {
            socket.emit("app:event.systemDashboard.closed", {
                emitTimestamp: Date.now()
            });
        }, 1000);

    });

    windows.systemDashboardWindow = window;
}

module.exports = {
    states: states,
    showSystemDashboardWindow: showSystemDashboardWindow,
    windows: windows,
}