'use strict';

/**
 * Create a DOM element with div and add classes
 * @param {String} tag - tag to be used to creat DOM element
 * @param {String} cssClass - CSS classes to be added to the new Div DOM element
 * @return {Object} new DOM element
 */
exports.createDomElementWithClass = function (tag, cssClass) {
	if (!tag) {
		throw new Error('tag cannot be empty.');
	}
	var item = document.createElement(tag);
	if (cssClass) {
		item.setAttribute('class', cssClass);
	}
	return item;
}