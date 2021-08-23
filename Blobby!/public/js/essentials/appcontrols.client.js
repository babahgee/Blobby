const electron = require("electron");

const { ipcRenderer } = electron;

const titleBarControlButtons = document.querySelectorAll(".app-titlebar-controls-control");

titleBarControlButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        if (this.classList.contains("control-close")) ipcRenderer.send("app:close_window", 0);
        if (this.classList.contains("control-windowed")) ipcRenderer.send("app:toggle_windowedmode", 0);
        if (this.classList.contains("control-minimize")) ipcRenderer.send("app:minimize", 0);

    });

});