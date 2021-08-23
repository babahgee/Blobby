import { fps, calculationSpeed, deltaTime, visibleObjects } from "./simulationloop.js";
import { renderObjects } from "./renderobject.js";
import { renderOffset, renderScale } from "./renderer.js";

export function updateSimulationDetails() {

    const fpsMeter = document.querySelector(".gui-fps_meter");

    // Indicate fps 

    if (fps > 0 && fps < 20) {
        if (!fpsMeter.classList.contains("red")) fpsMeter.classList.add("red");
    } else {
        fpsMeter.classList.remove("red");
    }

    // Update HTML nodes.
    document.querySelector(".gui-renderobjects_length span").innerText = `Render objects: ${renderObjects.length}`;
    document.querySelector(".gui-delta_time span").innerText = `Delta time: ${deltaTime}`;
    document.querySelector(".gui-render_delay span").innerText = `Calculation speed: ${calculationSpeed}ms`;
    document.querySelector(".gui-fps_meter span").innerText = `FPS: ${fps}FPS`;
    document.querySelector(".gui-visible_objects span").innerText = `Visible objects: ${visibleObjects}`;
    document.querySelector(".gui-render_scale span").innerText = `Render scale: ${renderScale.x} ${renderScale.y}`;
    document.querySelector(".gui-render_offset span").innerText = `Render offset: ${renderOffset.x} ${renderOffset.y}`;

    setTimeout(updateSimulationDetails, 50);
}

updateSimulationDetails();