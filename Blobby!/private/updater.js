const fs = require('fs'),
    request = require('request'),
    progress = require('request-progress'),
    path = require("path"),
    url = require("url");


autoUpdater.setFeedURL({ url: "https://github.com/babahgee/AI-Blob-Simulation" });

autoUpdater.checkForUpdates();

autoUpdater.on("checking-for-update", function () {
    try {
        dialog.showMessageBox({
            type: "info",
            title: "Update available",
            message: "A new version of this application is available. Do you want to download and install it?",
            buttons: ["Update application", "Nah, I am good fam"]
        });
    } catch (err) {
        console.log(err.message);
    }
});

autoUpdater.on("update-not-available", function () {

});

autoUpdater.on("error", function (err) {
    console.log(err);
});