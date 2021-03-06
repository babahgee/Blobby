import { Entity } from "./base.js";
import { generateUniqueID, pd, rb } from "../../essentials/essentials.js";
import { ctx, canvas, renderOffset, renderScale } from "../../canvas/renderer.js";
import { FaceAppearance } from "../main.js";
import { mouse } from "../../essentials/eventListeners.js";

export class Face extends FaceAppearance {
    /**
     * 
     * @param {Entity} entity
     */
    constructor(entity) {

        super();

        this.entity = entity;

        this.aiController = entity.aiController;

        this.x = entity.x;
        this.y = entity.y;

        this.eyeBallSize = 2;
        this.eyeMoveStrength = 3;

    }

    draw(secondsPassed) {

        if (typeof this.aiController.direction == "undefined") return;

        if (renderScale.x < 0.5 && renderScale.y < 0.5) return;

        let eyeDirection = (!this.entity.isHoveringInRange) ? pd(this.x, this.y, this.aiController.direction.x, this.aiController.direction.y) : pd(this.x, this.y, mouse.sceneX, mouse.sceneY);


        ctx.save();

         // =========== Eye balls ===========
        ctx.beginPath();

        ctx.fillStyle = "#fff";
        ctx.arc(this.x - (2 + (this.entity.size / 2)), this.y - 2, this.eyeBallSize + (this.entity.size / 4), 0, 2 * Math.PI);
        ctx.fill();

        ctx.arc(this.x + (2 + (this.entity.size / 2)), this.y - 2, this.eyeBallSize + (this.entity.size / 4), 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();


         // =========== Eye pupils ===========

        ctx.beginPath();

        ctx.fillStyle = "#000";

        ctx.arc((this.x - (2 + (this.entity.size / 2))) + eyeDirection.directionX * this.eyeMoveStrength, (this.y - 2) + eyeDirection.directionY * this.eyeMoveStrength, 1 + (this.entity.size / 5), 0, 2 * Math.PI);
        ctx.fill();

        ctx.arc((this.x + (2 + (this.entity.size / 2))) + eyeDirection.directionX * this.eyeMoveStrength, (this.y - 2) + eyeDirection.directionY * this.eyeMoveStrength, 1 + (this.entity.size / 5), 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();

        ctx.restore();

        // =========== Mouth ===========

        ctx.beginPath();

        ctx.fillStyle = "#fff";

        if (this.entity.isHovering) {
            ctx.arc(this.x, this.y + (10 + (this.entity.size / 5)), 2 + (this.entity.size / 4), 0, 2 * Math.PI, true);
        } else {
            ctx.arc(this.x, this.y + (5 + (this.entity.size / 5)), 5 + (this.entity.size / 4), Math.PI, 0, true);
        }
        ctx.fill();


        ctx.closePath();

    }
    update(secondsPassed) {

        this.x = this.entity.x;
        this.y = this.entity.y;

        this.draw();

    }
}