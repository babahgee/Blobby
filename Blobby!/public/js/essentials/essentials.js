const globalExports = {};

/* ================= Private functions ================= */
function resolveFile(path) {

    return new Promise(function (resolve, reject) {

        const xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {

            if (this.readyState === 4) {
                switch (this.status) {
                    case 200:

                        const x = {
                            text: this.responseText,
                            /**
                             * Makes the string pretty and split it into seperate lines, returning an array with strings.
                             * @param {boolean} addToCache Adds returning array to cache?
                             */
                            prettySplit: function (addToCache) {

                                const o = [],
                                    h = this.text.split("\r");

                                for (let i = 0; i < h.length; i++) {

                                    let l = h[i];

                                    for (let z = 0; z < l.length; z++) {

                                        const c = l.charAt(z);

                                        if (l.indexOf("\n") > -1 || l.indexOf("\n") > -1) {
                                            l = l.replace("\n", "");
                                            l = l.replace("\r", "");
                                        }

                                    }

                                    o.push(l);

                                }

                                if (addToCache) this["cache"] = o;

                                return o;
                            },
                            /**
                             * Gets first digits from each line from cache array.
                             * @param {string} digitLetters
                             */
                            getFirstDigits(digitLetters) {

                                if (typeof digitLetters !== "string") return null;

                                if (typeof this.cache == "object") {

                                    let i = 0,
                                        o = [];

                                    while (i < this.cache.length) {

                                        const c = this.cache[i];

                                        if (c.substring(0, digitLetters.length) == digitLetters) {

                                            o.push(c);
                                        }

                                        i += 1;
                                    }

                                    return o;

                                } else {
                                    return [];
                                }
                            },
                            splitBySpaceFromCache: function () {

                                const o = [];

                                if (typeof this.cache == "object") {

                                    let i = 0;

                                    while (i < this.cache.length) {

                                        let l = this.cache[i];

                                        l = l.split(" ");

                                        o.push(l);

                                        i += 1;
                                    }

                                    return o;
                                }
                            },
                            parse() {

                                const x = JSON.parse(xhr.responseText);

                                this.cache = x;

                                return x;

                            }
                        };

                        resolve(x);
                        break;
                    default:
                        reject("FILE_NOT_FOUND");
                        break;
                }
            }

        });

        xhr.open("get", path);
        xhr.send(null);
    });

}


/* ================= Private exports ================= */

export const applicationClientCache = {
    images: {},
    getCache() {
        
    }
}

/**
 * Returns an unique id.
 * @param {any} len
 */
export function generateUniqueID(len) {
    const characters = "abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    let generatedID = "";

    if (typeof len !== "number") len = 12;

    for (let i = 0; i < len; i++) {
        generatedID += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return generatedID;

}

/**
 * Returns a random number between two integers/
 * @param {number} number1
 * @param {number} number2
 */
export function rb(number1, number2) {
    if (typeof number1 == "number" && typeof number2 == "number") {
        let randomNumber = Math.floor(Math.random() * (number2 - number1 + 1) + number1);

        return randomNumber;
    }
}

/**
 * Returns a Atan 2 value.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {object}
 */
export function pd(x1, y1, x2, y2) {

    const a = Math.atan2(y2 - y1, x2 - x1);

    return {
        formula: a,
        directionX: Math.cos(a),
        directionY: Math.sin(a),
        normalize: function () {
            return {
                directionX: parseFloat(this.directionX.toFixed(2)),
                directionY: parseFloat(this.directionY.toFixed(2)),
            }
        },
        complete: function () {
            return {
                directionX: parseInt(this.directionX),
                directionY: parseInt(this.directionY)
            }
        },
        addLength: function (len) {

            if (typeof len == "number") {
                return {
                    directionX: this.directionX * len,
                    directionY: this.directionY * len
                }
            } else {
                return this;
            }
        }
    }
}

/**
 * Resolves distance between two points.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 */
export function getDistance(x1, x2, y1, y2) {
    if (typeof x1 == "number" && typeof x2 == "number" && typeof y1 == "number" && typeof y2 == "number") {

        let d1 = x1 - x2,
            d2 = y1 - y2,
            distance = Math.sqrt(d1 * d1, d2 * d2);

        return distance;
        
    } else {
        return 0;
    }
}

/**
 * Reads a file asynchronously.
 * @param {string} filename
 */
export async function readFileSync(filename) {

    if (typeof filename == "string")
        return await resolveFile(filename);

}

/* ================= Other essential thingies ================= */

/**Parses string into a float */
String.prototype.toFloat = function () {

    const x = parseFloat(this);

    return isNaN(x) == false ? x : 0;

}

String.prototype.toVector = function () {

}


/* ================= Lmao i like this seperator thingy ================= */

console.log("%cPress CTRL+D to toggle debug. Press CTRL+S to toggle settings", "color: red; font-family: Consolas, monospace; font-size: 20px;");

globalExports.pd = pd;
globalExports.rb = rb;
globalExports.generatedID = generateUniqueID;
globalExports.readFileSync = readFileSync;


for (let i in globalExports) {
    if (typeof window[i] == "undefined") {
        window[i] = globalExports[i];
    }
}