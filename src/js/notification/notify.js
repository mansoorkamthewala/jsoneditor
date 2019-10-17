'use strict';

var domUtil = require('../utilities/basicDOMUtil');
var notify = {};

/**
 * Initialize Notification module and returns the component to the caller
 * @returns {Element} Notification element
 */
notify.initialize = function () {
    var banner = domUtil.createDomElementWithClass('div', 'alert'),
        textNode = domUtil.createDomElementWithClass('div', 'alert-text');
    banner.appendChild(textNode);
    this.banner = banner;
    return banner;
};

/**
 * Displays the notification banner to the User with correct text and color.
 * If banner already displaying, it removes it first and readd new banner.
 * @param {String} text - Text to be added to the banner
 * @param {String} level - Banner level, error and success is supported
 * @param {Number} time - Duration for the banner to be displayed
 */
notify.displayNotification = function (text, level, time) {
    var toggleDisplay = function (clearTimer) {
            if (clearTimer) {
                this.timer = null;
            }
            this.banner.classList.toggle('alert-is-shown');
        };

    this.banner.childNodes[0].innerText = text;

    if (level === 'error') {
        this.banner.style.background = '#dc3545';
    } else if (level === 'success') {
        this.banner.style.background = '#28a745';
    }
    if (this.timer) {
        clearTimeout(this.timer);
        toggleDisplay.call(this, true);
    }
    this.timer = setTimeout(toggleDisplay.bind(this, true), time);
    toggleDisplay.call(this);
};

module.exports = notify;