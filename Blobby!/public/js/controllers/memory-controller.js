import { generateUniqueID } from "../essentials/essentials.js";

export class MemoryController {
    constructor() {
        this.id = generateUniqueID(18);

        this.longTermMemory = [];
        this.shortTimeMemory = [];

    }
    getMemory() {

    }
    saveMemory() {

    }
    deleteMemory() {

    }
}