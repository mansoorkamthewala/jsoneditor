'use strict';
var domUtil = require('./basicDOMUtil');

/**
 * Create a DOM element with div and add classes
 * @param {String} tag - tag to be used to creat DOM element
 * @param {String} cssClass - CSS classes to be added to the new Div DOM element
 * @return {Object} new DOM element
 */
exports.getOpenCurly = function (level, indent) {
	var item = domUtil.createDomElementWithClass('div', `open-curly level-${level}`);
	item.innerText = '{';
	return item;
}

/**
 * Create a DOM element with div and add classes
 * @param {String} tag - tag to be used to creat DOM element
 * @param {String} cssClass - CSS classes to be added to the new Div DOM element
 * @return {Object} new DOM element
 */
exports.getCloseCurly = function (level, indent) {
	var item = domUtil.createDomElementWithClass('div', `close-curly level-${level}`);
	item.innerText = '}';
	return item;
}