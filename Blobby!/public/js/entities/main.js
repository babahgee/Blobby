import { generateUniqueID } from "../essentials/essentials.js";

const faces = [],
    guiElements = [];

export class FaceAppearance {
    constructor() {

        this.faceID = generateUniqueID(18);
        this.creationTimestap = Date.now();

        faces.push(this);
    }

    static getFaces() {



    }
}

export class GUIElements {
    constructor() {

        this.elementID = generateUniqueID(18);
        this.creationTimestamp = Date.now();

        guiElements.push(this);
    }
}