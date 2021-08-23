import { Entity } from "../entities/entity01/base.js";
import { sceneSize } from "./renderer.js";
import { renderObjects } from "./renderobject.js";

/**@type {HTMLCanvasElement} */
export const minimap = document.querySelector("canvas.app-minimap-canvas");

minimap.width = 420;
minimap.height = 260;

/**@type {CanvasRenderingContext2D} */
export const minimapCtx = minimap.getContext("2d");

let tick = 0, maxTick = 50;

export function update(secondsPassed) {

    const dimesion = sceneSize.width / sceneSize.height;

    if (tick < maxTick) {
        tick += 1;
    } else {

        tick = 0;

        minimapCtx.clearRect(0, 0, minimap.width, minimap.height);

        minimapCtx.save();

        for (let i = 0; i < renderObjects.length; i++) {

            const obj = renderObjects[i];

            if (obj instanceof Entity) {

                

            }

        }


        minimapCtx.closePath();

        minimapCtx.restore();

    }

}