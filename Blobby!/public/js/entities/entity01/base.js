import { AIController } from "../../controllers/ai-controller.js";
import { generateUniqueID, pd, rb } from "../../essentials/essentials.js";
import { ctx, canvas, renderOffset, renderScale } from "../../canvas/renderer.js";
import { RenderObject } from "../../canvas/renderobject.js";
import { mouse } from "../../essentials/eventListeners.js";

import { Face } from "./face.js";
import { GUI } from "./gui.js";


const globalExports = {};

const entityRenderOptions = {
    showBoundary: false,
    useGravity: false,
    useShadows: false
}

const groupNames = ["gunginga", "yankee", "obama", "mahmed-khanakin", "babah-gee"];

export class Entity extends RenderObject {
    constructor(x, y, size, color) {
        super();

        this.x = x;
        this.y = y;

        this.velX = 0;
        this.velY = 0;

        this.size = size;
        this.color = color;

        this.isHovering = false;
        this.isVisible = true;
        this.opacity = 0;

        // Behavoir
        this.group = groupNames[Math.random() * groupNames.length];

        this.circles = [];

        for (let i = 0; i < rb(5, Math.round(size)); i++) {
            this.circles.push({
                offsetX: rb(-(size / 2), (size / 2)),
                offsetY: rb(-(size / 2), (size / 2)),
                size: rb(size - (size / 10), size + 10),
                maxSize: rb(size, size + 10),
                minSize: rb(10, size),
                animationSpeed: rb(1, 30) / 10,
                animationDirection: 1,
            });
        }


        this.health = 100;

        this.aiController = new AIController(this);

        this.nameMeasurement = this.aiController.getTextMeasurements();

        // Look
        this.face = new Face(this);

        // GUI
        this.gui = new GUI(this, this.aiController);


    }
    duplicate() {

    }
    handleMouseEvents() {
        if (!this.isVisible) return;

        const fixedMouseX = (mouse.x - renderOffset.x) / renderScale.x,
            fixedMouseY = (mouse.y - renderOffset.y) / renderScale.y;

        this.isHovering = (fixedMouseX > this.x - this.size && fixedMouseX < this.x + this.size && fixedMouseY > this.y - this.size && fixedMouseY < this.y + this.size);

    }
    draw(secondsPassed) {

        // If render scale is more than 0.5.
        if (renderScale.x > 0.5 && renderScale.y > 0.5) {

            // Create a blob shape.
            for (let i = 0; i < this.circles.length; i++) {

                const circle = this.circles[i];

                if (circle.size > 0) {
                    ctx.save();
                    ctx.beginPath();

                    //ctx.globalAlpha = this.opacity;
                    ctx.arc(this.x + circle.offsetX, this.y + circle.offsetY, circle.size, 0, 2 * Math.PI);
                    ctx.fillStyle = this.color;

                    if (entityRenderOptions.useShadows) {
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = this.color;
                    }

                    ctx.fill();

                    ctx.closePath();
                    ctx.restore();
                }
            }

            for (let i = 0; i < this.circles.length; i++) {

                const circle = this.circles[i];

                circle.x = this.x;
                circle.y = this.y;

                if (circle.size > circle.maxSize) {
                    circle.animationDirection = -1;
                }
                if (circle.size < circle.minSize || circle.size < 1) {
                    circle.animationDirection = 1;
                }

                circle.size += (circle.animationSpeed * circle.animationDirection) * secondsPassed;
            }

            if (entityRenderOptions.showBoundary) {
                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.strokeRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2)
                ctx.closePath();
            }

        } else {
            const circle = this.circles[0];

            if (circle.size > 0) {
                ctx.save();
                ctx.beginPath();

                ctx.arc(this.x + circle.offsetX, this.y + circle.offsetY, circle.size, 0, 2 * Math.PI);
                ctx.fillStyle = this.color;


                ctx.fill();

                ctx.closePath();
                ctx.restore();
            }
        }

        // Draw health bar
        ctx.save();

        // Draw health bar container
        ctx.beginPath();
        ctx.fillStyle = "#525252";
        ctx.fillRect(this.x - (this.size + 15), this.y - (this.size + 20), 40, 2);

        // Draw health bar progres
        ctx.beginPath();
        ctx.fillStyle = "#4ef551";
        ctx.fillRect(this.x - (this.size + 15), this.y - (this.size + 20), 40 / 100 * this.health, 2);

        ctx.restore();

    }

    update(secondsPassed) {

        if (this.opacity < 1) {
            this.opacity += 0.01;
        }

        if (entityRenderOptions.useGravity) {
            if (this.y < canvas.height) {
                this.velY += .1;
            } else {

                if (this.canSplit) {
                    for (let i = 0; i < Math.round(this.size / 5); i++) {
                        let o = new Entity(this.x, this.y - 30, this.size - 10, this.color);

                        o.velY = -rb(5, 20);
                        o.velX = -rb(-20, 20);
                    }

                }

                this.Destroy();
            }

            if (this.velX > 0) {
                this.velX -= 0.1;
            } if (this.velX < 0) {
                this.velX += 0.1;
            }

            if (this.x > canvas.width) {
                this.x = canvas.width;
                this.velX = -this.velX
            } if (this.x < 0) {
                this.x = 0;
                this.velX = -this.velX;
            }
        }

        this.x += this.velX;
        this.y += this.velY;

        if (this.x > -((renderOffset.x + canvas.width) / renderScale.x) &&
            this.x < -((renderOffset.x - canvas.width) / renderScale.x) &&
            this.y > -((renderOffset.y + canvas.height)  / renderScale.y) &&
            this.y < -((renderOffset.y - (canvas.height * 2))) / renderScale.y) {

            this.isVisible = true;
        } else {
            this.isVisible = false;
            this.opacity = 0;
        }

        if (this.isVisible) {
            this.draw(secondsPassed);

            this.gui.update();
            this.face.update();
        }

        // Update AI Controller.
        this.handleMouseEvents();
        this.aiController.update(secondsPassed);
    }
}

for (let i in globalExports) {
    if (typeof window[i] == "undefined") {
        window[i] = globalExports[i];
    }
}