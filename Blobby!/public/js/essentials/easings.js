export const easings = {
    /**
     * 
     * @param {number} x Percent
     * @param {number} t Current time
     * @param {number} b Beginning value
     * @param {number} c Change in value
     * @param {number} d Duration
     */
    easeInQuad: function (x, t, b, c, d) {

        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        } else {
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }

    }
}