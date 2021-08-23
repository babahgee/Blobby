// Import modules.
const path = require("path"),
    url = require("url"),
    fs = require("fs"),
    electron = require("electron"),
    express = require("express"),
    colors = require("colors"),
    io = require("socket.io")(5858),
    package = require("./package.json");

const handleIO = require("./private/handleIORequests"),
    settings = require("./private/settings"),
    appdata = require("./private/appdata"),
    discordRPC = require("./private/discordPresence");


// Get required objects from 'electron' object.
const { app, BrowserWindow, Menu, screen, autoUpdater, dialog, ipcMain } = electron;

const appData = appdata.initialize();

settings.applySettings(appData);
discordRPC.init(appData);

// Create empty variable for main window.
let mainWindow, loader;

if (!settings.applicationSettings.verticalSynchronisation) {

    console.log("WARNING: Vertical synchronization has been disabled! Application may stutter based on length of calculations.".red);

    app.commandLine.appendSwitch("--disable-frame-rate-limit");
}

// Event when electron has been loaded.
app.on("ready", function () {

    console.log("Electron application is ready to use.".green);

    loader = new BrowserWindow({
        width: 300,
        height: 460,
        minWidth: 300,
        minHeight: 460,
        maxWidth: 300,
        maxHeight: 460,
        frame: false,
        show: false,
        icon: "./assets/icons/win/icon_small.png",
        autoHideMenuBar: true,
        titleBarStyle: "hidden"
    });

    // Start loading application when loader has appeared
    loader.webContents.once("dom-ready", function () {

        console.log("Loader succesfully has been loaded".green);

        setTimeout(function () {

            // Create main window.
            mainWindow = new BrowserWindow({
                title: `Blobby - version ${package.version}`,
                width: settings.applicationSettings.maximizeOnStartUp ? screen.getPrimaryDisplay().size.width : 1300,
                height: settings.applicationSettings.maximizeOnStartUp ? screen.getPrimaryDisplay().size.height : 790,
                minWidth: settings.applicationSettings.minWidth ? settings.applicationSettings.minWidth : 1300,
                minHeight: settings.applicationSettings.minWidth ? settings.applicationSettings.minHeight : 790,
                backgroundColor: "#1d1d1d",
                autoHideMenuBar: true,
                webPreferences: {
                    contextIsolation: false,
                    nodeIntegration: true,
                    nodeIntegrationInSubFrames: true,
                    nodeIntegrationInWorker: true,
                    /*preload: path.join(__dirname, "preload.js")*/
                },
                icon: "./assets/icons/win/icon_small.png",
                titleBarStyle: "hidden",
                frame: false,
                show: false
            });

            mainWindow.webContents.once("dom-ready", function () {

                console.log("Main window succesfully has been loaded".green);

                mainWindow.show();

                loader.hide();
                loader.close();

            });

            // Load html page into browser window using url format.
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, "public/index.html"),
                slashes: true,
                protocol: "file:"
            })).then(function (data) {
                console.log(`Document page succesfully loaded at ${new Date()}`.green)
            }).catch(function (err) {
                console.log("Failed to load document page into application.".red);
                console.log(err);
            });

            handleIO.listen(io, BrowserWindow);

            // Maximize application when property is set to try in config file.
            if (settings.applicationSettings.maximizeOnStartUp) mainWindow.maximize();

        }, 2000);

    });

    loader.loadURL(url.format({
        pathname: path.join(__dirname, "public", "loader.html"),
        slashes: true,
        protocol: "file:"
    }));

    loader.show();

    ipcMain.on("app:close_window", function (event, args) {
        app.quit();

        process.exit();
    });

    ipcMain.on("app:toggle_windowedmode", function (event, args) {

        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }

    });

    ipcMain.on("app:minimize", function (event, args) {

        mainWindow.minimize();

    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});