import { easings } from "../essentials/easings.js";
import { generateUniqueID } from "../essentials/essentials.js";

const globalExports = {};

/**@type {HTMLCanvasElement} */
export const canvas = document.querySelector("canvas.simulation-renderer");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 30;

/**@type {CanvasRenderingContext2D} */
export const ctx = canvas.getContext("2d");

/**@type {number} */
export let backgroundColor = "#fff";

export const sceneSize = {
    width: 5760,
    height: 2991,
    center: {
        x: (5760 / 2) - (canvas.width / 2),
        y: (2991 / 2) - (canvas.height / 2)
    },
    /**
     * Changes the scene size.
     * @param {number} width
     * @param {number} height
     */
    changeSceneSize(width, height) {
        this.width = width;
        this.height = height;

        this.center = {
            x: width / 2 - (canvas.width / 2),
            y: height / 2 - (canvas.height / 2)
        }

        return this;
    }
}

export const renderOffset = {
    x: -(sceneSize.width / 2 - (canvas.width / 2)),
    y: -(sceneSize.height / 2 - (canvas.height / 2))
}
export const renderScale = {
    x: 1,
    y: 1
};


export function resetRenderOffsetOnAnimation(timeStamp) {

    let fps = 60,
        duration = 2,
        start = renderOffset.y,
        finish = sceneSize.height,
        distance = finish - start,
        increment = distance / (duration / fps),
        position = start,
        time = 0,
        handler = setInterval(update, 1000 / fps);

    function update() {

        time += 1 / fps;

        position = easings.easeInQuad(time * 100 / duration, time, start, finish, duration);

        if (position >= finish) {

            clearInterval(handler);

            renderOffset.y = finish;

            return;
        }

        renderOffset.y = position;

    }
}

export function resetRenderOffset(type) {

    switch (type) {
        case "x":

            renderOffset.x = 0;
            mouse.reset();

            break;
        case "y":

            renderOffset.y = 0;
            mouse.reset();

            break;
        default:

            break;
    }

}

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 30;
});

const animationFrameID = generateUniqueID(18);

globalExports.renderScale = renderScale;

for (let i in globalExports) {
    if (typeof window[i] == "undefined") {
        window[i] = globalExports[i];
    }
}