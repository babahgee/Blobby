import { generateUniqueID, rb } from "../essentials/essentials.js";
import { ctx, canvas, renderOffset, renderScale, sceneSize } from "../canvas/renderer.js";
import { RenderObject } from "../canvas/renderobject.js";
import { mouse } from "../essentials/eventListeners.js";

export class GridTile extends RenderObject {
    /**
     * Creates a grid tile
     * @param {number} x
     * @param {number} y
     * @param {string | number | Array} tileColor
     */
    constructor(x, y, tileColor) {
        super();

        this.x = x;
        this.y = y;

        this.tileWidth = 100;
        this.tileHeight = 100;

        this.tileColor = tileColor;
        this.originTileColor = tileColor;
        this.hoveringColor = "#e3e3e3";

        this.isHovering = false;
        this.isVisible = true;
        this.opacity = 1;

    }
    draw() {

        if (!this.isVisible) return;

        if (this.opacity < 1) {
            this.opacity += .1;
        }

        ctx.save();


        ctx.beginPath();

        //ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.tileColor;
        ctx.fillRect(this.x, this.y, this.tileWidth, this.tileHeight);

        if (renderScale.x > .5 && renderScale.y > .5) {
            ctx.beginPath();
            ctx.fillStyle = "#dbdbdb";
            ctx.font = `${10 / renderScale.x }px RobotoLight`;

            //ctx.fillText(`${this.x} x ${this.y}`, this.x + 10, this.y + 20);
            ctx.fillText(`${this.tileWidth} x ${this.tileHeight}`, this.x + 10, this.y + 20);
        }

        ctx.restore();
    }

    handleHover() {

        if (!this.isVisible) return;

        const fixedMouseX = (mouse.x - renderOffset.x) / renderScale.x,
            fixedMouseY = (mouse.y - renderOffset.y) / renderScale.y;

        if (fixedMouseX > this.x && fixedMouseX < this.x + this.tileWidth && fixedMouseY > this.y && fixedMouseY < this.y + this.tileHeight) {
            this.isHovering = true;

            this.tileColor = "#1d1d1d";

        } else {
            this.isHovering = false;

            this.tileColor = this.originTileColor;
        }

    }

    handleClick() {

    }

    update() {

        if (this.x > -((renderOffset.x + canvas.width) / renderScale.x) &&
            this.x < -((renderOffset.x - canvas.width) / renderScale.x) &&
            this.y > -((renderOffset.y + canvas.height) /renderScale.y) &&
            this.y < -((renderOffset.y - (canvas.height * 2))) / renderScale.y) {

            this.isVisible = true;
        } else {
            this.isVisible = false;
            this.opacity = 0;
        }

        
        this.handleHover();
        this.draw();
    }
}

export const tileColors = {
    primary: "#fff",
    secondary: "#f0f0f0"
}

export function createGridPattern() {

    const width = Math.round(sceneSize.width / 100),
        height = Math.round(sceneSize.height / 100);

    for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {

            let c;

            if (w % 2 == 0 && h % 2 == 0) c = tileColors.secondary
            else c = (w % 2 !== 0 && h % 2 !== 0) ? tileColors.secondary : tileColors.primary;

            new GridTile(w * 100, h * 100, c);
        }
    }

}