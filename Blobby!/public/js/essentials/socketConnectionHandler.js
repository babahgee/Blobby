const io = require("socket.io-client");

import { logError, logNormal } from "./debug.js";

logNormal("socket.io-client", "Connecting to server...");

export const serverProtocol = "http://",
    serverAddress = "localhost",
    serverPort = 5858,
    socket = io(serverProtocol + serverAddress + ":" + serverPort);

/**
 * Emits data to the server.
 * @param {string} name Event name.
 * @param {any} value Event value.
 */
export function emit(name, value) {
    socket.emit(name, value);

    return [name, value];
}

/**
 * Listens for events from the server.
 * @param {string} name
 * @param {Function} callback
 */
export function listen(name, callback) {

    if (typeof name == "string" && typeof callback == "function") {
        socket.on(name, callback);
    } else {
        return false;
    }

}

socket.on("connect", function () {

    logNormal("socket.io-client", "Connection successfully made to " + (serverProtocol + serverAddress + ":" + serverPort));

});

socket.on("connect_error", function (error) {
    logError("socket.io-client", "Lost connection with the server. Client will try to connect automatically. \n\n Error thrown object: " + error);
});