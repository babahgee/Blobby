import { canvas, renderOffset, renderScale, sceneSize } from "../canvas/renderer.js";

/**@type {HTMLCanvasElement} */
const mainCanvas = document.querySelector("canvas.simulation-renderer"),
    mainSettingsContainer = document.querySelector(".app-gui-settings");
export const keys = {
    lCtrl: false,
    rCtrl: false,
    s: false
};

export const mouse = {
    left: false,
    right: false,
    middle: false,
    x: renderOffset.x,
    y: renderOffset.y,
    canvasX: 0,
    canvasY: 0,
    currentCoordinates: { x: renderOffset.x, y: renderOffset.y },
    lastCoordinates: { x: renderOffset.x, y: renderOffset.y },
    maxScrollVelocity: 50,
    reset: function () {

        this.currentCoordinates = { x: 0, y: 0 };
        this.lastCoordinates = { x: 0, y: 0 };

        return this;
    },
}

window.addEventListener("keydown", function (event) {

    switch (event.keyCode) {
        case 17:
            switch (event.location) {
                case 1:
                    keys.lCtrl = true;

                    mainCanvas.classList.add("panning");

                    break;
                case 2:
                    keys.rCtrl = true;
                    break;
            }
            break;
        case 83:

            keys.s = true;

            break;
    }

    if (keys.lCtrl && keys.s) {
        if (mainSettingsContainer.classList.contains("hidden")) {
            mainSettingsContainer.classList.remove("hidden");
        } else {
            mainSettingsContainer.classList.add("hidden");
        }
    }

});

window.addEventListener("keyup", function (event) {

    switch (event.keyCode) {
        case 17:
            switch (event.location) {
                case 1:
                    keys.lCtrl = false;

                    mainCanvas.classList.remove("panning");

                    break;
                case 2:
                    keys.rCtrl = false;
                    break;
            }
            break;
        case 83:

            keys.s = false;

            break;
    }

});

window.addEventListener("mousedown", function (event) {

    switch (event.button) {
        case 0:
            mouse.left = true;
            break;
        case 1:
            mouse.middle = true;
            break;
        case 2:
            mouse.right = true;
            break;
    }

    if (mouse.left) {

        mouse.canvasX = event.offsetX;
        mouse.canvasY = event.offsetY;

        mouse.currentCoordinates.x = event.offsetX - mouse.lastCoordinates.x;
        mouse.currentCoordinates.y = event.offsetY - mouse.lastCoordinates.y;
    }

});


window.addEventListener("mouseup", function (event) {

    switch (event.button) {
        case 0:

            mouse.left = false;
            break;
        case 1:
            mouse.middle = false;
            break;
        case 2:
            mouse.right = false;
            break;
    }

    mouse.canvasX = event.offsetX;
    mouse.canvasY = event.offsetY;

    mouse.lastCoordinates.x = event.offsetX - mouse.currentCoordinates.x;
    mouse.lastCoordinates.y = event.offsetY - mouse.currentCoordinates.y;

    if (renderOffset.y > sceneSize.height) {
        resetRenderOffset();
    }
});

window.addEventListener("mousemove", function (event) {

    mouse.x = event.offsetX;
    mouse.y = event.offsetY;

    document.querySelector(".gui-mouse_coords span").innerText = `Mouse: ${mouse.x} ${mouse.y}`;

    if (mouse.left && keys.lCtrl) {
        renderOffset.x = event.offsetX - mouse.currentCoordinates.x;
        renderOffset.y = event.offsetY - mouse.currentCoordinates.y;
    }
});

let scrollVelocityY = 0, scale = 1;

function handleScrollAnimation() {

    const smoothness = 1000,
        fixedDigits = 3,
        currentRenderOffsetX = renderOffset.x;

    if (scrollVelocityY > 0) {
        scrollVelocityY -= 0.5;

        scrollVelocityY = scrollVelocityY.toFixed(fixedDigits);

        scrollVelocityY = parseFloat(scrollVelocityY);


        renderScale.x -= scrollVelocityY / smoothness;
        renderScale.y -= scrollVelocityY / smoothness;

        renderScale.x = (renderScale.x).toFixed(fixedDigits);
        renderScale.y = (renderScale.y).toFixed(fixedDigits);
    }
    if (scrollVelocityY < 0) {
        scrollVelocityY += 0.5;

        scrollVelocityY = scrollVelocityY.toFixed(3);

        scrollVelocityY = parseFloat(scrollVelocityY);


        renderScale.x -= (scrollVelocityY / smoothness);
        renderScale.y -= (scrollVelocityY / smoothness);

        renderScale.x = (renderScale.x).toFixed(fixedDigits);
        renderScale.y = (renderScale.y).toFixed(fixedDigits);

        //renderOffset.x = -( currentRenderOffsetX + (mouse.x / renderScale.x));
    }

    if (renderScale.x < 0.1 && renderScale.y < 0.1) {

        scrollVelocityY = 0;

        renderScale.x = 0.1;
        renderScale.y = 0.1;
    }

    window.requestAnimationFrame(handleScrollAnimation);
}

handleScrollAnimation();

window.addEventListener("wheel", function (event) {

    if (!keys.lCtrl) return;

    if (event.deltaY > 0) {

        if (scrollVelocityY < 0) scrollVelocityY = 0;

        scrollVelocityY += 5;

    } else {

        if (scrollVelocityY > 0) scrollVelocityY = 0;

        scrollVelocityY -= 5;
    }


    if (scrollVelocityY > mouse.maxScrollVelocity) scrollVelocityY = mouse.maxScrollVelocity;
    if (scrollVelocityY < -mouse.maxScrollVelocity) scrollVelocityY = -mouse.maxScrollVelocity;

});