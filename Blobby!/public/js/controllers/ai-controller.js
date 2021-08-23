import { simulationLagOffset } from "../canvas/simulationloop.js";
import { Entity } from "../entities/entity01/base.js";
import { generateUniqueID, getDistance, pd, rb, readFileSync } from "../essentials/essentials.js";
import { canvas, ctx, sceneSize } from "../canvas/renderer.js";
import { logNormal } from "../essentials/debug.js";
import { MemoryController } from "./memory-controller.js";

// Empty object for global exports.
const globalExports = {};

// Constant array with controllers.
const controllers = [];

// Global AI controller options.
const aiControllerOptions = {
    trippyMode: false, // Use trippy mode.
    showDirection: true, // Show AI direction.
    showEndDestination: true, // Show AI end destination.
    showDirectionDistance: true, // Show AI direction distance.
    showAnimationFrame: true, // Show AI animation frame.
    updateAIInRenderView: false, // Update AI render controllers only when they are in the render view.
    debug: 0 // Use debug.
}

const names = await readFileSync("./data/generic/random_names.txt"),
    fixedNames = names.prettySplit(true);

if (names.text.length !== 0) logNormal("ai-controller", "Succesfully loaded file with names");

const entityGenders = ["male", "female"];

function setNameOnController(controller) {

    let i = 0,
        randomName = fixedNames[rb(0, fixedNames.length)],
        isAvailable = true;

    while (i < controllers.length) {

        const c = controllers[i];

        if (c.name == randomName) isAvailable = false;

        i += 1;
    }

    return isAvailable === true ? randomName : "Unnamed entity";

}


export class AIController {
    /**
     * Creates a new AI Controller.
     * @param {Entity} entity
     */
    constructor(entity) {

        // Make controller unique.
        this.id = generateUniqueID(18);
        this.creationTimestamp = Date.now();

        // Attach entity from argument.
        this.entity = entity;

        // Entity character states.
        this.gender = entityGenders[Math.floor(Math.random() * entityGenders.length)];
        this.name = setNameOnController(this);

        // Set behavoir states.
        this.state = "wander";
        this.mood = "normal";
        this.happiness = 50;
        this.approachingEntity = null;
        this.approachedEntity = null;
        this.marriedEntity = null;

        // Move speed.
        this.moveSpeed = rb(1, 10);

        // Animations
        this.animationFrame = 0;
        this.maxAnimationFrame = 200;

        this.isChangingDirection = false;

        // Set random direction at start.
        this.direction = {
            x: rb(entity.x - rb(50, 1500), entity.x + rb(50, 1500)),
            y: rb(entity.y - rb(50, 1500), entity.y + rb(50, 1500))
        }

        this.memoryController = new MemoryController(this);

        // Push controller to controllers array.
        controllers.push(this);
    }

    /**
     * Get specific controller.
     * @param {string} controllerID ID of provided controller.
     * @returns {AIController}
     */
    static getController(controllerID) {

        // If argument is not a string or is undefined, return null.
        if (typeof controllerID !== "string" || typeof controllerID == "undefined") return null;

        let i = 0, // Define index integer.
            foundController = null; // Set found controller to null.

        // Loop through array of controllers.
        while (i < controllers.length) {

            // Define looped controller.
            const controller = controllers[i];

            // If id of looped controller is equal to provided controller id in argument.
            if (controller.id === controllerID) foundController = controller;

            i += 1;
        }

        // Return either the controller or 'no controller found'.
        return foundController !== null ? foundController : { status: 0, log: "No controller found" };

    }
    static deleteController(controllerID) {

    }
    /**
     * Returns a list of controllers.
     * @param {string} filterName Controller property name.
     * @param {string} filterValue Controller property value.
     * @returns {(AIController | "No controllers found")}
     */
    static getControllers(filterName, filterValue) {

        let i = 0, // Define index integer.
            foundControllers = []; // Create empty array.

        // If length of arguments are more than 2.
        if (arguments.length > 0) {

            if (typeof filterName == "string" && typeof filterValue == "string") {

                while (i < controllers.length) {

                    const controller = controllers[i];

                    if (controller[filterName] == filterValue) {
                        foundControllers.push(controller);
                    }

                    i += 1;
                }

                i = 0;

                return foundControllers.length > 0 ? foundControllers : "No controllers found.";

            } else {

                while (i < controllers.length) {

                    const controller = controllers[i];

                    if (typeof controller[filterName] !== "undefined") foundControllers.push(controller);

                    i += 1;
                }

                i = 0;

                return foundControllers.length > 0 ? foundControllers : "No controllers found.";
            }

        } else {
            return controllers;
        }

    }

    /**
     * Measurements text.
     * @returns {TextMetrics}
    */
    getTextMeasurements() {

        const x = ctx.measureText(this.name);

        return x;

    }

    
    /**
     * Approaches an entity
     * @param {AIController} controller
     */
    approach(controller) {

        const entity = controller.entity;

        if (controller.gender !== this.gender) {

            this.direction = {
                x: entity.x,
                y: entity.y
            }

            this.approachingEntity = controller;

            if (controller.gender == "female") {

                if (controller.happiness < 20 || this.happiness < 20) {

                    this.approachingEntity = null;

                    this.direction = {
                        x: rb(entity.x - rb(50, 1500), entity.x + rb(50, 1500)),
                        y: rb(entity.y - rb(50, 1500), entity.y + rb(50, 1500))
                    }

                    return;
                }

                const happinessLevel = rb(-1, 1) * 10;

                controller.happiness += happinessLevel;
                this.happiness += happinessLevel;

            }

            if (this.approachingEntity == null) this.approachedEntity = controller;

        } else {
            this.direction = {
                x: rb(entity.x - rb(50, 1500), entity.x + rb(50, 1500)),
                y: rb(entity.y - rb(50, 1500), entity.y + rb(50, 1500))
            }

            this.happiness -= 5;

            if (this.happiness > 10 && this.happiness < 30) {
                // console.log(":(");
            }

            if (this.happiness < 0) {

                console.log("bye bye");

                this.entity.Destroy();
            }
        }

       // console.log(this.happiness);
    }

    /**
     * Setup animation.
     * @param {"wander" | "idle" | "attack" | "panick"} animationName
     */
    setup(animationName) {

    }
    /**
     * Changes animation state.
     * @param {"wander" | "idle" | "attack" | "panick"} animationName
     */
    changeAnimationState(animationName) {

        // Change state property based on argument.
        this.state = animationName;

        // Switch statement on animationName.
        switch (animationName) {

            // If state is wander.
            case "wander":
                this.maxAnimationFrame = rb(50, 400);
                break;

            // If state is idle.
            case "idle":
                this.maxAnimationFrame = 0;
                break;

            // If state is attact.
            case "attack":
                
                break;

            // If state is panick
            case "panick":
                this.maxAnimationFrame = rb(200, 400);
                break;

            // If state is none of above states.
            default:

                // Reset animation frame.
                this.maxAnimationFrame = 0;

                // Set state to idle.
                this.state = "idle";

                throw new Error(`${animationName} is not a recognized animation name for this AI controller.`);

                break;
        }
    }

    handleBorderCollision() {

        const e = this.entity;


        if (aiControllerOptions.trippyMode) {

            if (e.x < 0 || e.x > sceneSize.width || e.y < 0 || e.y > sceneSize.height) {

                e.x = rb(e.x - 200, e.x + 200);
                e.y = rb(e.y - 200, e.y + 200);

                this.direction = {
                    x: rb(e.x - rb(50, 1500), e.x + rb(50, 1500)),
                    y: rb(e.y - rb(50, 1500), e.y + rb(50, 1500))
                }
            }

            return;
        }

        if (e.x < 0) {
            e.x = 0;

            this.direction.x = rb(0, sceneSize.width);
        }

        if (e.x > sceneSize.width) {
            e.x = sceneSize.width;

            this.direction.x = rb(0, sceneSize.width);
        }

        if (e.y < 0) {
            e.y = 0;

            this.direction.y = rb(0, sceneSize.height);
        }
        
        if (e.y > sceneSize.height) {
            e.y = sceneSize.height;

            this.direction.y = rb(0, sceneSize.height);
        }

    }

    wander(secondsPassed) {

        // Define entity for easier usage.
        const e = this.entity;

        // Resolve polar direction.
        const direction = pd(e.x, e.y, this.direction.x, this.direction.y).normalize();

        // Calculate distance.
        const distance = getDistance(e.x, this.direction.x, e.y, this.direction.y).toFixed(0);

        // If the direction disance is more than 1.
        if (distance > 1) {

            // Move entity to direction.
            e.x += (direction.directionX * this.moveSpeed) * secondsPassed;
            e.y += (direction.directionY * this.moveSpeed) * secondsPassed;

        } else { // If direction distance is less than 1.

            // If animation frame is less than max animation frame.
            if (this.animationFrame < this.maxAnimationFrame) {

                // Increate animation frame count.
                this.animationFrame += 1;

            } else { // If animation frames reaches its max.

                // Reset animation frames and max animation frames.
                this.animationFrame = 0;
                this.maxAnimationFrame = rb(10, 200);

                let i = 0, // Define index integer.
                    closeEntities = []; // Empty array of close entities.

                // Loop through array of AI controllers.
                while (i < controllers.length) {

                    /**@type {AIController} */
                    const controller = controllers[i], // Get looped controller.
                        controllerEntity = controller.entity; // Get attached entity of contorller.

                    // If looped controller is not equal to this controller.
                    if (controller.id !== this.id) {

                        // If controller entity is within a range of 200 pixels.
                        if (controllerEntity.x > e.x - 200 && controllerEntity.x < e.x + 200 && controllerEntity.y > e.y - 200 && controllerEntity.y < e.y + 200) {

                            // Push the entity to array 'closeEntities'.
                            closeEntities.push({
                                entity: controllerEntity,
                                controller: controller
                            });
                        }
                    };

                    i += 1;
                }

                // Pick a random close entity.
                const approachingEntity = closeEntities[Math.floor(Math.random() * closeEntities.length)];

                // Approach entity if existing.
                if (typeof approachingEntity !== "undefined") {
                    approachingEntity.controller.approach(this)
                } else {
                    this.direction = {
                        x: rb(e.x - rb(50, 1500), e.x + rb(50, 1500)),
                        y: rb(e.y - rb(50, 1500), e.y + rb(50, 1500))
                    }
                };

            }
        }
    }

    draw() {

        // If debug property or isVisible property of entity is set to false, ignore code below.
        if (!aiControllerOptions.debug || !this.entity.isVisible) return;

        // Define entity for easier usage.
        const e = this.entity;

        const direction = pd(e.x, e.y, this.direction.x, this.direction.y).addLength(10 + (e.size * 3));
        const distance = getDistance(e.x, this.direction.x, e.y, this.direction.y).toFixed(0);

        // If 'showDirection' property is set to true.
        if (aiControllerOptions.showDirection) {

            // Draws line facing end destination.
            ctx.save();
            ctx.beginPath();

            ctx.moveTo(e.x, e.y);
            ctx.lineTo(e.x + direction.directionX, e.y + direction.directionY);
            ctx.strokeStyle = "#000";
            ctx.stroke();

            ctx.closePath();
            ctx.restore();
        }

        if (aiControllerOptions.showEndDestination) {
            ctx.save();
            ctx.beginPath();

            ctx.arc(this.direction.x, this.direction.y, 10, 0, 2 * Math.PI);
            ctx.strokeStyle = "red";
            ctx.stroke();

            ctx.closePath();
            ctx.restore();
        }

        if (aiControllerOptions.showDirectionDistance) {
            ctx.save();
            ctx.beginPath();

            ctx.fillStyle = "red";
            ctx.font = "10px Consolas";

            ctx.fillText(`Distance: ${distance}`, this.direction.x + 20, this.direction.y + 3);

            ctx.closePath();
            ctx.restore();
        }
        if (aiControllerOptions.showAnimationFrame) {
            if (this.animationFrame > 0) {
                ctx.save();
                ctx.beginPath();

                ctx.fillStyle = "green";
                ctx.font = "10px Consolas";

                ctx.fillText(`Animation frame: ${this.animationFrame} / ${this.maxAnimationFrame}`, e.x + 20, e.y + 15);

                ctx.closePath();
                ctx.restore();
            }
        }
    }

    update(secondsPassed) {

        if (aiControllerOptions.updateAIInRenderView) {

            if (this.entity.isVisible) {
                switch (this.state) {
                    case "wander":
                        this.wander(secondsPassed);
                        break;
                }

                this.draw();
            }

        } else {
            switch (this.state) {
                case "wander":
                    this.wander(secondsPassed);
                    break;
            }

            this.draw();
        }

        this.handleBorderCollision();
    }

    Destroy() {
        let i = 0;

        while (i < controllers.length) {

            /**@type {AIController} */
            const controller = controllers[i];

            if (controller.id == this.id && controller.creationTimestamp == this.creationTimestamp) {
                controllers.splice(i, 1);
            }

            i += 1;
        }
    }
}

globalExports.AIController = AIController;
globalExports.aiControllerOptions = aiControllerOptions;

for (let i in globalExports) {
    if (typeof window[i] == "undefined") {
        window[i] = globalExports[i];
    }
}