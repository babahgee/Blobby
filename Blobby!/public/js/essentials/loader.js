import { init } from "../simulation/main.js";
import { generateTerrain } from "../terrain/terrain.js";
import { logNormal } from "./debug.js";

const appLoader = document.querySelector(".app-loader"),
    maiApp = document.querySelector(".app"),
    splashText = document.querySelector(".loader-textcontainer-splash span");

/**@type {HTMLVideoElement} */
const video = document.querySelector(".app-loader-background-video video");

const splashes = [
    "Setting up simulation environment...",
    "Creating an amazing fantasy...",
    "Blobby!!!!!",
    "This is a splash text lol",
    "Deez nuts",
    "Emitting and receiving imaginations...",
    "Ayo the pizza here!"
];

splashText.innerText = splashes[Math.floor(Math.random() * splashes.length)];


window.addEventListener("load", function () {

    init();

    generateTerrain();

    logNormal("sim_loader", "Succesfully loaded document page.");

    this.setTimeout(function () {

        appLoader.classList.add("fadeout");

        setTimeout(function () {
            appLoader.classList.add("hidden");

            video.pause();
            video.currentTime = 0;

        }, 1000);
        
    }, 2000);

        
});