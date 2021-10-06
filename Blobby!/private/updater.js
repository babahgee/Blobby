const fs = require('fs'),
    request = require('request'),
    progress = require('request-progress'),
    path = require("path"),
    url = require("url"),
    downloadRelease = require('@terascope/fetch-github-release'),
    isDev = require("electron-is-dev");

const user = "babahgee",
    repo = "Blobby",
    outputdir = path.join(__dirname, "../../", "test"),
    leaveZipped = false,
    disableLogging = false;

// Define a function to filter releases.
function filterRelease(release) {

    // Filter out prereleases.
    return release.prerelease === false;
}

// Define a function to filter assets.
function filterAsset(asset) {
    // Select assets that contain the string 'windows'.
    return asset.name.includes('windows');
}


function init() {

    if (isDev) return;

    console.log(true);

    downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped, disableLogging)
        .then(function () {
            console.log('All done!');
        })
        .catch(function (err) {
            console.error(err.message);
        });

}

module.exports = {
    init: init
}