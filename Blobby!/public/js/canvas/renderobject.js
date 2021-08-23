import { generateUniqueID } from "../essentials/essentials.js";

/**@type {Array} */
export const renderObjects = [];

export class RenderObject {
    constructor() {
        this.id = generateUniqueID(18);
        this.creationTimestamp = Date.now();
        this.type = "renderobject";

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
}