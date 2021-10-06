import { Flower } from "./flower.js";
import { createGridPattern } from "./grid.js";
import { rb } from "../essentials/essentials.js";
import { sceneSize } from "../canvas/renderer.js";

export const generationOptions = {
    maxFlowers: 100
}

function generateFlowers() {

    // Generating flowers.

    const maxFlowers = 100;

    for (let i = 0; i < maxFlowers; i++) {

        const randomX = rb(0, sceneSize.width),
            randomY = rb(0, sceneSize.height);

        new Flower(randomX, randomY);

    }

}


export function generateTerrain() {

    // Greate grid pattern before drawing other terrain elements.
    createGridPattern();

    // generateFlowers();

}