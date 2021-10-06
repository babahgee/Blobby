import { Entity } from "../entities/entity01/base.js";
import { canvas, renderOffset, renderScale, sceneSize } from "./renderer.js";
import { renderObjects } from "./renderobject.js";

/**@type {HTMLCanvasElement} */
export const minimap = document.querySelector("canvas.app-minimap-canvas");

minimap.width = 420;
minimap.height = 260;

/**@type {CanvasRenderingContext2D} */
export const minimapCtx = minimap.getContext("2d");

let tick = 0;

export const minimapSettings = {
    updateMinimap: false,
    maxUpdateTick: 0
}

export function update(secondsPassed) {

    if (!minimapSettings.updateMinimap) return;

    if (tick < minimapSettings.maxUpdateTick) {
        tick += 1;
    } else {

        minimapCtx.clearRect(0, 0, minimap.width, minimap.height);

        minimapCtx.save();

        minimapCtx.beginPath();

        minimapCtx.strokeStyle = "#fff";

        let viewSizeX = minimap.width / canvas.width * (canvas.width * renderScale.x),
            viewSizeY = minimap.height / canvas.height * (canvas.height * renderScale.y);

        let viewX = (minimap.width / sceneSize.width * -(renderOffset.x / renderScale.x)) + (viewSizeX / 2),
            viewY = (minimap.height / sceneSize.height * -(renderOffset.y / renderScale.y)) + (viewSizeY / 2);


        minimapCtx.strokeRect(viewX, viewY, viewSizeX / 2, viewSizeY / 2);


        minimapCtx.closePath();

        for (let i = 0; i < renderObjects.length; i++) {

            const obj = renderObjects[i];

            if (obj instanceof Entity) {

                

            }

        }


        minimapCtx.closePath();

        minimapCtx.restore();

        tick = 0;

    }

}