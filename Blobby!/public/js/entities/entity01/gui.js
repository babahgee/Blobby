
import { generateUniqueID, pd, rb } from "../../essentials/essentials.js";
import { ctx, canvas, renderOffset, renderScale } from "../../canvas/renderer.js";

import { AIController } from "../../controllers/ai-controller.js";
import { Entity } from "./base.js";


export class GUI {
    /**
     * 
     * @param {Entity} entity
     * @param {AIController} entityController
     */
    constructor(entity, entityController) {

        this.entity = entity;
        this.entityController = entityController;

        this.nameMeasurement = entity.nameMeasurement;

    }
    draw() {

        if (!this.entity.isHovering) return;

        // Save current canvas state.
        ctx.save();

        ctx.globalCompositeOperation = "source-over";

        // Draw gui box.
        ctx.beginPath();

        ctx.save();
        ctx.fillStyle = "#000";
        ctx.shadowColor = "#8f8f8f";
        ctx.shadowOffsetX = -10;
        ctx.shadowOffsetY = 10;
        ctx.fillRect(this.entity.x + this.entity.size + 10, this.entity.y, (120 + (this.nameMeasurement.width + 20)) / renderScale.y, 210 / renderScale.y);
        ctx.restore();

        // Draw name.
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.font = `${14 / renderScale.x}px Montserrat`;
        ctx.fillText(this.entityController.name, this.entity.x + this.entity.size + 30, this.entity.y + 40 / renderScale.y);

        // Draw horizontal line.
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.fillRect(this.entity.x + this.entity.size + 30, this.entity.y + 60 / renderScale.y, this.nameMeasurement.width, 1);

        // Draw gender
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.font = `${12 / renderScale.x}px RobotoLight`;
        ctx.fillText(`Gender: ${this.entityController.gender}`, this.entity.x + this.entity.size + 30, this.entity.y + 90 / renderScale.y);

        // Draw happiness state
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.font = `${12 / renderScale.x}px RobotoLight`;
        ctx.fillText(`Happiness: ${this.entityController.happiness} / 100`, this.entity.x + this.entity.size + 30, this.entity.y + 110 / renderScale.y);

        // Draw health
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.font = `${12 / renderScale.x}px RobotoLight`;
        ctx.fillText(`Health: ${this.entity.health}%`, this.entity.x + this.entity.size + 30, this.entity.y + 130 / renderScale.y);

        // Draw approaching entitiy
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.font = `${12 / renderScale.x}px RobotoLight`;
        ctx.fillText(`Approaching entity: ${this.entityController.approachingEntity == undefined ? "No entity" : this.entityController.approachingEntity.name}`, this.entity.x + this.entity.size + 30, this.entity.y + 150 / renderScale.y);

        // Draw entity position
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.font = `${12 / renderScale.x}px RobotoLight`;
        ctx.fillText(`Position: x: ${Math.round(this.entity.x)} - y: ${Math.round(this.entity.y)}`, this.entity.x + this.entity.size + 30, this.entity.y + 170 / renderScale.y);


        // Restore last saved canvas state.
        ctx.restore();


    }

    update() {


        this.draw();

    }
}