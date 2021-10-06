import { generateUniqueID } from "../essentials/essentials.js";
import { canvas, renderOffset, renderScale } from "./renderer.js";

/**@type {Array} */
export const renderObjects = [];

export class RenderObject {
    constructor() {
        this.id = generateUniqueID(18);
        this.creationTimestamp = Date.now();
        this.type = "renderobject";

        this.isVisible = false;

        renderObjects.push(this);
    }
    Destroy() {
        let i = 0;

        while (i < renderObjects.length) {

            /**@type {RenderObject} */
            const object = renderObjects[i];

            if (object.id == this.id && object.creationTimestamp == this.creationTimestamp) {

                if (typeof object.aiController !== "undefined") {
                    object.aiController.Destroy();
                }

                for (let o in object) {
                    object[o] = null;

                    delete object[o];
                }

                renderObjects.splice(i, 1);

                return true;
            }

            i += 1;
        }
    }
    updateMain(secondsPassed) {


        if (typeof this.x === "number" && typeof this.y === "number") {

            if (this.x > -((renderOffset.x + canvas.width) / renderScale.x) &&
                this.x < -((renderOffset.x - canvas.width) / renderScale.x) &&
                this.y > -((renderOffset.y + canvas.height) / renderScale.y) &&
                this.y < -((renderOffset.y - (canvas.height * 2))) / renderScale.y) {

                this.isVisible = true;

            } else {
                this.isVisible = false;
            }

        }

        this.update(secondsPassed);

    }
}