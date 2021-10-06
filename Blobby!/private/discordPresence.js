const rpc = require("discord-rpc"),
    fs = require("fs"),
    colors = require("colors"),
    path = require("path");

const { dialog } = require("electron/main");


function init(configs) {

    const format = JSON.parse(configs);

    if (typeof format["discord-rich-presence"] !== "object") return;

    const clientID = format["discord-rich-presence"]["id"];

    if (typeof clientID == "undefined" || typeof clientID !== "string" || clientID == "[your ID here]") return;

    const client = new rpc.Client({ transport: "ipc" });

    console.log("Initializing Discord-RPC client...".yellow);

    client.on("ready", function () {

        console.log("Discord client succesfully initialized!".green);

        client.setActivity({
            largeImageKey: "icon_medium",
            details: "In-simulation",
            state: "Version 0.1.3 [DEV]",
            buttons: [
                {
                    label: "Repository",
                    url: "https://github.com/babahgee/AI-Blob-Simulation"
                }
            ],
            startTimestamp: Date.now()
        });


    });

    client.login({ clientId: clientID });
}

module.exports = {
    init: init
}