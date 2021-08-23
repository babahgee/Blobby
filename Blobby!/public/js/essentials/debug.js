const globalExports = {};

/**
 * Check if arguments are all string
 * @param {array} args
 */
function checkIfSring(args) {

    if (args.length > 0) {

        let isAllString = true;

        for (let i = 0; i < args.length; i++) {

            const arg = args[i];

            if (typeof arg !== "string") isAllString = false;

        }

        return isAllString;

    } else {
        return false;
    }

}


/**
 * Returns a normal message in the console.
 * @param {string} messageType
 * @param {string} message
 */
export function logNormal(messageType, message) {

    // First check if all arguments are a string.
    if (!checkIfSring(arguments)) return null;

    const messageFormat = `[${messageType}]`;

    console.log("%c" + messageFormat + "%c " + message, "color: red; background: #000", "color: #fff")

}

/**
 * Returns an error in the console.
 * @param {string} messageType
 * @param {string} message
 */
export function logError(messageType, message) {

    // First check if all arguments are a string.
    if (!checkIfSring(arguments)) return null;

    const messageFormat = `(ClientError):[${messageType}]`;

    console.log("%c" + messageFormat + "%c " + message, "color: red; background: #000", "color: red");
}


globalExports.logNormal = logNormal;

for (let i in globalExports) {
    if (typeof window[i] == "undefined") {
        window[i] = globalExports[i];
    }
}