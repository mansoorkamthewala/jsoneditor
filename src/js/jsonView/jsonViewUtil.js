'use strict';
var domUtil = require('../utilities/basicDOMUtil');

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
