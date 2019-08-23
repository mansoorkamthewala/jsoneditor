'use strict';
var domUtil = require('./basicDOMUtil');

/**
 * Create a DOM element with open braces, either { OR [
 * @param {String} brace - innerText for the created DOM element
 * @param {Number} level - CSS class will be created using this level
 * @return {Element} new DOM element
 */
exports.getOpenBrace = function (brace, level) {
	var item = domUtil.createDomElementWithClass('div', `open-brace key-level-${level}`);
	item.innerText = brace;
	return item;
}

/**
 * Create a DOM element with close braces, either } OR ]
 * @param {String} brace - innerText for the created DOM element
 * @param {Number} level - CSS class will be created using this level
 * @return {Element} new DOM element
 */
exports.getCloseBrace = function (brace, level) {
	var item = domUtil.createDomElementWithClass('div', `close-brace key-level-${level}`);
	item.innerText = brace;
	return item;
}