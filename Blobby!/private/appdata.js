const fs = require("fs"),
    path = require("path"),
    url = require("url"),
    colors = require("colors"),
    openExplorer = require('open-file-explorer');

const applicationName = "Blobby!";

function createAppDataTemplate() {
    console.log("Creating AppData template...".yellow);

    fs.mkdirSync(path.join(process.env.APPDATA, applicationName, "Backgrounds"))
    fs.mkdirSync(path.join(process.env.APPDATA, applicationName, "Simulation Data"))
    fs.mkdirSync(path.join(process.env.APPDATA, applicationName, "Cache"));

    createConfigurationFile();
}

function createConfigurationFile() {

    console.log("Creating configuration file from template...".yellow);


    const userConfiguration = {
        "application": {
            "verticalSynchronisation": true,
            "cpuUsageLimitation": null,
            "maximizeOnStartUp": true,
            "bruhMode": false,
            "minWidth": 1300,
            "minHeight": 790,
        },
        "permissions": {
            "com.permission.readFiles": true,
            "com.permission.writeFiles": true,
            "com.permission.readTaskManager": true,
            "com.permission.readProcessorInformation": true,
            "com.permission.openSubWindows": true,
            "com.permission.devTools": true,
            "com.permission.selectAudioDevice": true,
        },
        "discord-rich-presence": {
            "active": false,
            "id": "[your ID here]"
        }
    }

    fs.writeFileSync(path.join(process.env.APPDATA, applicationName, "Simulation Data", "configuration.json"), JSON.stringify(userConfiguration, null, 2), { encoding: "utf-8" });

    return userConfiguration;
}


function initialize() {

    let measurementStart = Date.now(),
        measurementEnd,
        measurementDifference;

    console.log("Initializing application data...".yellow);

    // Check if 'AI-Blob-Simulation' folder does not exists in AppData > Roaming directory.
    const roamingDir = fs.readdirSync(process.env.APPDATA, {encoding: "utf-8"});

    // If directory has no 'AI Blob Simulation' dir.
    if (!roamingDir.includes(applicationName)) {

        console.log(`Creating 'AI Blob Simulation' directory in ${process.env.APPDATA}`.yellow);

        fs.mkdirSync(path.join(process.env.APPDATA, applicationName), { encoding: "utf-8" });

        createAppDataTemplate();

        return;
    }

    // Continue function if folder exists

    console.log(`Found required directory in '${process.env.APPDATA}'`.green);


    // Get all sub-directories in directory.
    const allDirs = fs.readdirSync(path.join(process.env.APPDATA, applicationName));

    // If the provided directory doesn't have any sub-directory at all.
    if (allDirs.length == 0) {

        console.log(`No sub directories found in '${path.join(process.env.APPDATA, applicationName)}'. Application will create provided directories by default.`.yellow);

        createAppDataTemplate();

        return;
    }

    // Check at last if configuration file exists.
    let configFile;

    try {
        configFile = fs.readFileSync(path.join(process.env.APPDATA, applicationName, "Simulation Data", "configuration.json"), {encoding: "utf-8"});
    } catch (err) {

        console.log(`ERROR: Configuration file not found! Application will generate a configuration file automatically.`.red)

        configFile = createConfigurationFile();
    }

    return configFile;
}

function getAllfiles() {

}

/**
 * Get all files in a specific AppData sub directory.
 * @param {"Backgrounds" | "Cache" | "Simulation Data"} folderName
 * @param { string | false } extension Get files by extension, enter files to ignore
 */
function getFilesInSubDir(folderName, extension, callback) {

    if (typeof folderName !== "string") {

        console.log("The given parameter (as folderName) is not a string.".red);

        return;
    }

    switch (folderName) {
        case "Backgrounds":

            const directory = fs.readdirSync(path.join(process.env.APPDATA, applicationName, folderName), { encoding: "utf-8" });

            if (!extension) {

                for (let i = 0; i < directory.length; i++) {

                    const file = fs.readFile(path.join(process.env.APPDATA, applicationName, folderName, directory[i]), function (err, data) {
                        callback("data:image/png;base64," + data.toString("base64"));
                    });

                }

            } else {

            }

            break;
        case "Cache":

            break;
        case "Simulation Data":

            break;
        default:

            console.log(`'${folderName}' is not a recognized sub-directory name.`.red);

            break;
    }
}

function openFileExplorer() {

    const p = path.join(process.env.APPDATA, applicationName);

    openExplorer(p, err => {
        if (err) {
            console.log(err);
        }
        else {
            //Do Something
        }
    });

}

module.exports = {
    getAllfiles: getAllfiles,
    initialize: initialize,
    getFilesInSubDir: getFilesInSubDir,
    openFileExplorer: openFileExplorer
}