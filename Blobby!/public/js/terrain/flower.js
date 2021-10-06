// ================== Import back-end modules ==================
const fs = require("fs"),
    path = require("path");

// ================== Import front-end modules ==================
import { RenderObject } from "../canvas/renderobject.js";
import { getImage } from "../essentials/essentials.js";
import { ctx } from "../canvas/renderer.js";


const flowerTypes = [];

// Read all files in 'flowers' folder.

const pathName = path.join(__dirname, "data", "images", "textures", "flowers");

const flowerImages = fs.readdirSync(pathName, { encoding: "utf-8" });

for (let i = 0; i < flowerImages.length; i++) {

    const flower = flowerImages[i];

    // Preload images.
    let temporaryImage = await getImage(path.join(pathName, flower));

    flowerTypes.push(temporaryImage);

}

export class Flower extends RenderObject {
    constructor(x, y) {

        super();

        this.x = x;
        this.y = y;

        this.image = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];

    }
    draw() {

        ctx.beginPath();

        ctx.drawImage(this.image, this.x, this.y, 50, 70);
        

    }
    update() {

        if (this.isVisible) this.draw();

    }
}