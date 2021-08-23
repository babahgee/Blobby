import { getDistance } from "../essentials/essentials.js";
import { canvas, ctx, renderOffset, renderScale, sceneSize } from "./renderer.js";
import { renderObjects } from "./renderobject.js";
import { update } from "./minimap.js";


export let fps = -Date.now(),
    times = [],
    updateSpeed = 100,
    calculationSpeed = 0,
    lastFrame = Date.now(),
    deltaTime = 0,
    visibleObjects = 0,
    secondsPassed = 0,
    oldTimeStamp = 0;

export let simulationFrameRate = 60,
    simulationFrameStart = Date.now(),
    simulationFrameDuration = 1000 / simulationFrameRate,
    simulationDelay = 0,
    simulationLagOffset = 0,
    simulationPaused = false,
    previousSimulationToggleState = false;

/**
 * Toggles simulation pause state.
 * @param {boolean} bool
 */
export function toggleSimulationPauseState(bool) {
    if (typeof bool == "boolean") {

        previousSimulationToggleState = simulationPaused;

        simulationPaused = bool;

        if (!simulationPaused && previousSimulationToggleState) RenderSimulation();

        return simulationPaused;
    } else {
        return null;
    }
}

const sceneOutliningStyle = {
    fontSize: 20,
    fontFamily: "Montserrat"
}

function handleOffscreenDrawing() {

    // const distance = getDistance((sceneSize.width / 2) / renderScale.x, -renderOffset.x / renderScale.x, (sceneSize.height / 2) / renderScale.y, -renderOffset.y / renderScale.y);

}

function drawSceneOutlining() {

    // Draw text above scene
    ctx.beginPath();

    ctx.fillStyle = "#fff";

    ctx.fillRect(0, -(50 / renderScale.y), sceneSize.width, 2 / renderScale.y);

    ctx.font = `${sceneOutliningStyle.fontSize / renderScale.x}px RobotoThin`;
    ctx.fillText(`${Math.round(sceneSize.width / 100)} blocks width. ${sceneSize.width * renderScale.x} pixels width`, 0, -(60 / renderScale.y));

    ctx.closePath();

    // Draw text next the scene.
    ctx.beginPath();

    ctx.fillStyle = "#fff";

    ctx.fillRect(-(50 / renderScale.x), 0, 2 / renderScale.x, sceneSize.height);

    ctx.closePath();

    ctx.save();
    ctx.beginPath();

    const verticalText = `${Math.round(sceneSize.height / 100)} blocks tall. ${sceneSize.height * renderScale.y} pixels tall.`,
        textMeasurement = ctx.measureText(verticalText);

    ctx.fillStyle = "#fff";

    ctx.translate(-(60 / renderScale.x), (textMeasurement.width));

    ctx.rotate(-(Math.PI / 2));

    ctx.font = `${sceneOutliningStyle.fontSize / renderScale.x}px RobotoThin`;
    ctx.fillText(verticalText, 0, 0);

    ctx.closePath();
    ctx.restore();
}

export function RenderSimulation(timeStamp) {

    // =============== Delta time logics ===============

    secondsPassed = (timeStamp - oldTimeStamp) / 100;
    oldTimeStamp = timeStamp;

    // =============== Rendering ===============

    // Clear canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save original state.
    ctx.save();

    // Translate canvas based on render offset.
    ctx.translate(renderOffset.x, renderOffset.y);

    // Scale canvas based on render scale.
    ctx.scale(renderScale.x, renderScale.y);


    drawSceneOutlining();
    handleOffscreenDrawing();

    for (let i in renderObjects) {

        const object = renderObjects[i];

        if (typeof object.update == "function") object.update(secondsPassed);
    }

    update(secondsPassed);


    ctx.restore();

    // =============== Frame rate ===============

    const now = performance.now();

    while (times.length > 0 && times[0] <= now - 1000) times.shift();

    times.push(now);
    fps = times.length;
    deltaTime = simulationLagOffset.toFixed(4);

    if (!simulationPaused) window.requestAnimationFrame(RenderSimulation);
}

RenderSimulation(Date.now());