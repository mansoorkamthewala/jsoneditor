/**
 * Create a DOM element with div and add classes
 * @param {String} cssClass - CSS classes to be added to the new Div DOM element
 * @return {Object} new DOM element
 */
exports.createDomWithClass = function (cssClass) {
	var item = document.createElement('div');
	item.setAttribute('class', cssClass);
	return item;
}