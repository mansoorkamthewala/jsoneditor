'use strict';
var domUtil = require('../utilities/basicDOMUtil');
var actions = require('../business/actions');

/**
 * Create a DOM element with open braces, either { OR [
 * @param {String} brace - innerText for the created DOM element
 * @param {Number} level - CSS class will be created using this level
 * @return {Element} new DOM element
 */
exports.getOpenBrace = function (brace, level) {
    var item = domUtil.createDomElementWithClass('div', `key-level-${level} open-brace`);
    item.innerText = brace;
    return item;
};

/**
 * Create a DOM element with close braces, either } OR ]
 * @param {String} brace - innerText for the created DOM element
 * @param {Number} level - CSS class will be created using this level
 * @return {Element} new DOM element
 */
exports.getCloseBrace = function (brace, level) {
    var item = domUtil.createDomElementWithClass('div', `key-level-${level} close-brace`);
    item.innerText = brace;
    return item;
};

/**
 * Handles Copy OR Paste action triggered from JSON structure view.
 * @param {Object} data - Data that is being copied or data where the data is being pasted.
 */
exports.handleCopyPaste = function (data) {
    if (!actions.copied) {
        data.copied = true;
        actions.handleCopy({
            value: data.values,
            type: data.type
        }, data);
    } else {
        actions.handlePaste(data);
    }
};