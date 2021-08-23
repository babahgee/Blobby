// Import modules.
const path = require("path"),
    url = require("url"),
    fs = require("fs"),
    electron = require("electron");
    colors = require("colors");

const permissions = {};

const applicationSettings = {};

function applySettings(data) {

    const format = JSON.parse(data);

    const formatPermissions = format.permissions,
        applicationSettingsFormat = format.application;

    for (let permission in formatPermissions)
        permissions[permission] = formatPermissions[permission];

    for (let setting in applicationSettingsFormat)
        applicationSettings[setting] = applicationSettingsFormat[setting];

}

module.exports = {
    applySettings: applySettings,
    permissions: permissions,
    applicationSettings: applicationSettings
}