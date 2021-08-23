import "./essentials/loader.js";
import "./essentials/socketConnectionHandler.js";
import "./essentials/eventListeners.js";
import "./essentials/bubblebuttons.js";

import "./canvas/simulationloop.js";
import "./essentials/settings.js";
import "./canvas/debug.js";
import "./canvas/grid.js";

import "./essentials/appcontrols.client.js";

import { Entity } from "./entities/entity01/base.js";
import { logNormal } from "./essentials/debug.js";
import { sceneSize } from "./canvas/renderer.js";
import { rb } from "./essentials/essentials.js";


/**
 * Spawn entities
 * @param {Array} e
 */
buttonActions["sm_spawnentities"] = function (args) {

    let entityAmount = args[0].toFloat(),
        spawnX = args[1] === "$center" ? sceneSize.center.x : args[1].toFloat(),
        spawnY = args[2] === "$center" ? sceneSize.center.y : args[2].toFloat(),
        minSize = args[3].toFloat(),
        maxSize = args[4].toFloat(),
        minMovSpeed = args[5].toFloat(),
        maxMovSpeed = args[6].toFloat(),
        gender = args[8],
        color = args[9] === "$random" ? `rgb(${rb(0, 255)}, ${rb(0, 255)}, ${rb(0, 255)})` : args[9];

    let mainSize = rb(minSize, maxSize);

    for (let i = 0; i < entityAmount; i++) {
        new Entity(spawnX, spawnY, mainSize, color);
    }

}