import { readFileSync, rb, generateUniqueID, pd } from "../essentials/essentials.js";

const bubbleButton = document.querySelector(".bubblebutton-button-simoverview"),
    simOverviewCloseButton = document.querySelector(".simdetails-navbar-button.close"),
    simOverviewContainer = document.querySelector(".app-gui-simdetails"),
    mainApp = document.querySelector(".app");


export const simulationSettings = {
    simulationName: "Ayo! the pizza here",
    simulationStart: 0,
}

export const lifeCycle = {
    _updateTickSpeed: 10,
    _updateTickSpeedReach: 100,
    date: {
        year: 1,
        month: 1,
        day: 1,

        /**Gets the correct format */
        getFormat() {

            return this.year + "-" + this.month + "-" + this.day;

        }
    },

    // Time object.
    time: {
        hours: 12,
        minutes: 0,

        /**Gets the correct format */
        getFormat() {

            return this.hours + ":" + this.minutes

        }
    },

    // Resets the time cycle.
    reset() {


        this.date = { year: 1, month: 1, day: 1 }

        this.time = { hours: 12,  minutes: 0 }

        return this;
    },

    // Getters and setters

    /**
     * @param {number} speed
     */
    set updateTickSpeed(speed) {

        this.updateTickSpeed = speed;

        return this;
    }
}

function createItemElement(name, value, id) {

    const item = document.createElement("div");
    item.className = "simdetails-items-item";

    id !== undefined && item.classList.add(id);

    const titleNode = document.createElement("div");
    titleNode.className = "simdetails-items-item-title";
    titleNode.innerHTML = `<span>${name}</span>`;

    const valueNode = document.createElement("div");
    valueNode.className = "simdetails-items-item-value";
    valueNode.innerHTML = `<span>${value}</span>`;

    item.appendChild(titleNode);
    item.appendChild(valueNode);


    return item;
}

export async function init() {
    const items = await readFileSync("./data/generic/simdetails_items.json"),
        parsedItems = items.parse(),
        mainItemsContainer = document.querySelector(".simdetails-items");

    for (let i = 0; i < parsedItems.length; i++) {

        const item = parsedItems[i];

        const x = createItemElement(item.name, item.value, item.uniqueID);

        mainItemsContainer.appendChild(x);
    }
}

export function updateSimulation() {

}

bubbleButton.addEventListener("click", function () {

    if (simOverviewContainer.classList.contains("hidden")) {

        mainApp.classList.add("in-simoverview");

        simOverviewContainer.classList.remove("hidden");
    }

});

simOverviewCloseButton.addEventListener("click", function () {

    if (!simOverviewContainer.classList.contains("hidden")) {

        mainApp.classList.remove("in-simoverview");

        simOverviewContainer.classList.add("hidden");
    }

});