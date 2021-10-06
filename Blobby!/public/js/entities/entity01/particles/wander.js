import { ctx } from "../../../canvas/renderer.js";
import { RenderObject } from "../../../canvas/renderobject.js";

export class WanderParticle extends RenderObject {
    constructor(x, y, size, color) {
        super();

        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;

        this.opacity = 1;

    }
    draw() {

        ctx.save();
        ctx.beginPath();

        ctx.globalCompositeOperation = "lighten";

        ctx.globalAlpha = this.opacity;

        ctx.fillStyle = this.color;

        ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
        ctx.fill();


        ctx.closePath();
        ctx.restore();

    }
    update() {

        if (this.opacity > .1) {
            this.opacity -= 0.1;
        } else {
            this.Destroy();
        }

        if (this.isVisible) this.draw();
    }
}