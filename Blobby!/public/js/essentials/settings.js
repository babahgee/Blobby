import { canvas } from "../canvas/renderer.js";
import { applicationClientCache, generateUniqueID } from "./essentials.js";
import { emit, listen } from "./socketConnectionHandler.js"

const settingToggles = document.querySelectorAll(".gui-settings-item-toggle"),
    settingsCloseButton = document.querySelector(".gui-settings-navbar-button.button-close"),
    mainSettingsContainer = document.querySelector(".app-gui-settings"),
    inputFields = document.querySelectorAll(".gui-settings-item-input"),
    settingButtons = document.querySelectorAll(".gui-settings-button"),
    bubbleButton = document.querySelector(".bubblebutton-button-settings"),
    mainApp = document.querySelector(".app"),
    globalExports = {};

// Button actions
const buttonActions = {
    /**Initializes button action methods */
    init: function () {

        const objectProperties = {};

        for (let property in this) {

            objectProperties[property] = typeof this[property];

        }

        return objectProperties;

    },
    removeMethod: function (methodName) {

    }
}

// Making it global
globalExports.buttonActions = buttonActions;


// States
let firstOpenedSettings = true;

function init() {

    const loader = document.querySelector(".sim-settings-bg-initloader");


    buttonActions["sm_openbgdir"] = function () {
        emit("app:open_file_explorer", {
            requestTime: Date.now()
        });
    }

    buttonActions["sm_bgreset"] = function () {
        canvas.removeAttribute("style");
    }


    // Receive background images in appdata directory.
    emit("app:request_backgrounds", {
        requestTime: Date.now(),
        priority: "high"
    });

    listen("app_response:request_backgrounds", function (data) {

        if (!loader.classList.contains("hidden")) loader.classList.add("hidden");

        const imageID = generateUniqueID(24),
            receivedTime = Date.now(),
            mainImageFile = new Image();

        // Set buffer data to main image file.
        mainImageFile.src = data;

        // Adds image to application client cache.
        applicationClientCache.images[imageID] = mainImageFile;

        // Create main element
        const element = document.createElement("div");
        element.className = "gui-settings-imageitem";

        // Set attributes to element.
        element.setAttribute("o-id", imageID);
        element.setAttribute("receive-time", receivedTime);

        element.addEventListener("click", function () {
            canvas.style.backgroundImage = `url(${data})`;
        });

        element.appendChild(mainImageFile);

        document.querySelector(".gui-settings-group-images").appendChild(element);

    });
}


settingsCloseButton.addEventListener("click", function () {

    mainSettingsContainer.classList.add("hidden");
    bubbleButton.classList.remove("active");

    mainApp.classList.remove("in-settings");

});

bubbleButton.addEventListener("click", function () {

    if (firstOpenedSettings) setTimeout(init, 1000);

    bubbleButton.classList.add("active");

    mainApp.classList.add("in-settings");

    mainSettingsContainer.classList.remove("hidden");

    firstOpenedSettings = false;

});

// Loop through array with toggles.
settingToggles.forEach(function (toggle) {

    // Get setting object name and setting property.
    const settingObjectName = toggle.getAttribute("setting-object-name");
    const settingProperty = toggle.getAttribute("setting-property");

    // Inline function to apply settings.
    function applySetting(value) {

        // Check 'settingObjectName'.
        switch (settingObjectName) {

            // Change any settings if the names matches.
            case "entityRenderOptions":

                if (typeof entityRenderOptions[settingProperty] !== "undefined") {
                    entityRenderOptions[settingProperty] = value;
                }

                break;
            case "aiControllerOptions":

                if (typeof aiControllerOptions[settingProperty] !== "undefined") {
                    aiControllerOptions[settingProperty] = value;
                }

                break;
        }
    }

    // Click event on elements.
    toggle.addEventListener("click", function () {

        // If toggle has 'active' classname.
        if (toggle.classList.contains("active")) {

            // Change setting to false.
            applySetting(false);

            // Remove classname.
            toggle.classList.remove("active");

        } else {

            // Change setting to true.
            applySetting(true);

            // Add classname.
            toggle.classList.add("active");
        }

    });

});


/*
 * TODO: Make settings more advanced.
 */

// Loop through array with input fields.
inputFields.forEach(function (input) {

    // Get 'type' attribute from element.
    const inputType = input.getAttribute("type");

    // Input event on input-field.
    input.addEventListener("input", function (event) {

        /**@type {string} */
        const value = this.innerText;

        switch (inputType) {

            // If input field type is number.
            case "number":

                // Create a empty list to store allowed characters.
                const allowedCharacters = [];

                // Check the string letter by letter
                for (let i = 0; i < value.length; i++) {

                    // Get character from string using looped integer.
                    const char = value.charAt(i);

                    // Check if character can be parsed into a number.
                    const num = parseFloat(char);

                    // Push number to array with allowed characters if its not NaN.
                    if (!isNaN(num)) allowedCharacters.push(num);

                }

                let fixedCharacterFormat = "";

                for (let i = 0; i < allowedCharacters.length; i++) {
                    fixedCharacterFormat += allowedCharacters[i];
                }


                // Clear inputfield
                this.innerHTML = fixedCharacterFormat;

                break;

            case null:

                break;

        }

    });

});

// Loop through array with buttons.
settingButtons.forEach(function (button) {

    const buttonAction = button.getAttribute("action"), // Get button action attribute.
        requiringElements = button.getAttribute("requires"), // Get button requiring elements.
        filterKeywordAttribute = button.getAttribute("get"); // Get button filter attribute.

    // Click event on button.
    button.addEventListener("click", function () {

        if (requiringElements == null) {

            if (typeof buttonActions[buttonAction] == "function") buttonActions[buttonAction]();

            return;
        }

        const parsedRequiredElements = [], // Create empty array to store requiring elements.
            elementsFilterFormat = requiringElements.split(","), // Split requiringElements attribute.
            allElements = document.querySelectorAll("*"); // Get all elements.

        // Loop through all elements.
        allElements.forEach(function (em) {

            // Loop through element filters.
            for (let i = 0; i < elementsFilterFormat.length; i++) {

                // Define looped filter.
                let filter = elementsFilterFormat[i];

                // Loop through length of filter
                for (let j = 0; j < filter.length; j++) {

                    // Get looped character.
                    const char = filter[j];

                    // If char is uqual to empty space, replace it with nothing.
                    if (char == " ") filter = filter.replace(" ", "");

                }

                // If name attribute value matches filter, push element to array.
                if (em.getAttribute("name") === filter) parsedRequiredElements.push(em);
            }

        });

        if (filterKeywordAttribute == null) {

            // Call buttonAction method if exists.
            if (typeof buttonActions[buttonAction] == "function") buttonAction(parsedRequiredElements);

        } else {

            // Split filterKeyword which will return an array.
            const filterFormat = filterKeywordAttribute.split(" ");

            // If filterFormat array includes 'from' value.
            if (filterFormat.includes("from")) {

                const filterProperty = filterFormat[0]; // Get filter property.
                const targetProperty = filterFormat[2]; // Get target property

                switch (filterProperty) {

                    // If text is going to filter out.
                    case "text":

                        // Temporary array to store strings
                        const tempStringArray = new Array();

                        switch (targetProperty) {

                            // Use requiring elements to filter.
                            case "$required_elements":

                                // Go through array with required elements if length is more than 0.
                                if (parsedRequiredElements.length > 0) {

                                    parsedRequiredElements.forEach(function (em) {

                                        // Push text from element to temporary string.
                                        tempStringArray.push(em.innerText);

                                    });

                                    // If button action method exists, call it with temporary array with strings.
                                    if (typeof buttonActions[buttonAction] == "function") buttonActions[buttonAction](tempStringArray);

                                } else {

                                    return [0];

                                }

                                break;

                            default:

                                break;
                        }

                        break;
                    case "color":

                        break;
                    default:
                        return 0;
                        break;

                }

            }

        }
    });

});

for (let i in globalExports) {
    if (typeof window[i] == "undefined") {
        window[i] = globalExports[i];
    }
}