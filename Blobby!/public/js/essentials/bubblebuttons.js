import { simulationPaused, toggleSimulationPauseState } from "../canvas/simulationloop.js";
import { emit, listen } from "./socketConnectionHandler.js";

const app = document.querySelector(".app"),
    bubbleButtons = document.querySelectorAll(".bubblebuttons-button"),
    subwindowOverlay = document.querySelector(".overlay-in_performance_dashboard");

bubbleButtons.forEach(function (button) {

    switch (button.getAttribute("action")) {
        case "app:open-desktop-performance":

            handleDashboardButton(button);


            break;
    }

});

function handleDashboardButton(button) {

    function showWindowIfNotNull() {

        emit("app:show.systemDashboard", {
            timeStamp: Date.now(),
            performance: performance
        });

        subwindowOverlay.classList.add("visible");

        toggleSimulationPauseState(true);
    }

    listen("app:event.systemDashboard.closed", function (data) {

        subwindowOverlay.classList.add("fadeout");

        setTimeout(function () {
            subwindowOverlay.classList.remove("visible");
            subwindowOverlay.classList.remove("fadeout");
        }, 300);


        toggleSimulationPauseState(false);
    });

    listen("app:check_state.systemDashboard.response", function (data) {

        if (data.response == null) {
            showWindowIfNotNull();
        } else {

        }
    });

    button.addEventListener("click", function () {

        emit("app:check_state.systemDashboard", {});

    });

}