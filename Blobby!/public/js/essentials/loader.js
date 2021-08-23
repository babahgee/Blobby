import { createGridPattern } from "../canvas/grid.js";
import { init } from "../simulation/main.js";
import { logNormal } from "./debug.js";

const appLoader = document.querySelector(".app-loader"),
    maiApp = document.querySelector(".app");

function loadFiles() {

    logNormal("sim_loader", "Loading all simulation executable files...");


}

loadFiles();
createGridPattern();

window.addEventListener("load", function () {

    init();

    this.setTimeout(function () {

        appLoader.classList.add("fadeout");

        setTimeout(function () {
            appLoader.classList.add("hidden");
        }, 300);
        
    }, 1000);

        
});