const path = require("path"),
    url = require("url"),
    fs = require("fs"),
    colors = require("colors");

const { getFilesInSubDir, openFileExplorer } = require("./appdata");
const { showSystemDashboardWindow, windows } = require("./windows");

let activeSocket = null;

function listen(io, bw) {

    console.log("Application started listening on port '8000'...".yellow);

    io.sockets.on("connection", function (socket) {

        console.log(`Connection has made at ${new Date()}`.yellow);

        activeSocket = socket;

        socket.on("app:show.systemDashboard", function (data) {
            showSystemDashboardWindow(socket, bw);
        });

        socket.on("app:check_state.systemDashboard", function (data) {


            socket.emit("app:check_state.systemDashboard.response", {
                response: windows.systemDashboardWindow !== null ? true : null,
                emitTimestamp: Date.now()
            });


        });

        socket.on("app:request_backgrounds", function (d) {

            getFilesInSubDir("Backgrounds", false, function (data) {
                socket.emit("app_response:request_backgrounds", data);
            });

        });

        socket.on("app:open_file_explorer", function () {
            openFileExplorer();
        });

    });
}

module.exports = {
    listen: listen,
    activeSocket: activeSocket
}