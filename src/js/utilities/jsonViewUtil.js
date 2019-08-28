'use strict';
var domUtil = require('./basicDOMUtil');
var TYPES = require('./../constants').TYPES;

// function createDropdownMenu (value) {
//     var wrapper = domUtil.createDomElementWithClass('div', `dropdown`),
//         button = domUtil.createDomElementWithClass('button', `dropbtn`),
//         icon = domUtil.createDomElementWithClass('i', `fa fa-caret-down`),
//         content = domUtil.createDomElementWithClass('div', `dropdown-content`),
//         typeKeys = Object.keys(TYPES);

//     button.innerText = value;
//     button.appendChild(icon);

//     for (var i = 0; i < typeKeys.length; i++) {
//         var item = domUtil.createDomElementWithClass('a');
//         item.innerText = TYPES[typeKeys[i]];
//         content.appendChild(item);

//     }
//     wrapper.appendChild(button);
//     wrapper.appendChild(content);
//     return wrapper;
// }

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

// exports.getKeyInputText = function (value, name, index = 0) {
//     var form = domUtil.createDomElementWithClass('form');
//     var input = domUtil.createDomElementWithClass('input', `input-${index}`);
//     var button = domUtil.createDomElementWithClass('button');
//     var icon = domUtil.createDomElementWithClass('i', 'fas fa-check');

//     input.setAttribute('type', 'text');
//     input.setAttribute('name', name);
//     input.setAttribute('value', value);

//     button.appendChild(icon);
//     form.appendChild(input);
//     form.appendChild(button);
//     return form;
// };

/**
 * Create a DOM element with key for Object type data
 * @param {String} key - innerText for the created DOM element representing key
 * @param {Number} index - index in the data structure
 * @return {Element} new DOM element
 */
exports.getKeyCard = function (key, index = 0) {
    var card = domUtil.createDomElementWithClass('div', `key-card-${index}`);
    card.innerText = key || '';
    return card;
}

/**
 * Create a DOM element with index for Array type data
 * @param {Number} index - innerText for the created DOM element representing index
 * @param {Number} index - index in the data structure
 * @return {Element} new DOM element
 */
exports.getIndexCard = function (index = 0) {
    var card = domUtil.createDomElementWithClass('div', `index-card-${index}`);
    card.innerText = index;
    return card;
}

/**
 * Create a DOM element with value for Object OR Array type data
 * @param {String} value - innerText for the created value DOM element representing value
 * @param {String} type - innerText for the created type DOM element representing type
 * @param {Number} index - index in the data structure
 * @return {Element} new DOM element
 */
exports.getValueCard = function (value, type, index = 0) {
    var wrapper = domUtil.createDomElementWithClass('div', `value-wrapper-${index}`),
        card = domUtil.createDomElementWithClass('div', `value-card-${index}`),
        typeCard = domUtil.createDomElementWithClass('div', `type-card-${index}`);
    card.innerText = value;
    typeCard.innerText = type;
    wrapper.appendChild(card);
    wrapper.appendChild(typeCard);
    return wrapper;
}

/**
 * Create a DOM element with "Delete" and "Add" button. This action card will be placed
 * after value card on right side
 * @param {Number} index - index in the data structure
 * @return {Element} new DOM element
 */
exports.getRightActionCard = function (index) {
    var wrapper = domUtil.createDomElementWithClass('div', `right-action-wrapper-${index}`),
        buttonDel = domUtil.createDomElementWithClass('button', `btn-del-${index}`),
        buttonAdd = domUtil.createDomElementWithClass('button', `btn-add-${index}`);
    
    buttonAdd.appendChild(domUtil.createDomElementWithClass('i', 'fas fa-plus'));
    buttonDel.appendChild(domUtil.createDomElementWithClass('i', 'fas fa-times'));
    wrapper.appendChild(buttonAdd);
    wrapper.appendChild(buttonDel);
    return wrapper;
}

/**
 * Create a DOM element with "Up" and "Down" button. This action card will be placed
 * before index card on left side. Will be only used for Array type data
 * @param {Number} index - index in the data structure
 * @return {Element} new DOM element
 */
exports.getLeftActionCard = function (index) {
    var wrapper = domUtil.createDomElementWithClass('div', `left-action-wrapper-${index}`),
        buttonDel = domUtil.createDomElementWithClass('button', `btn-up-${index}`),
        buttonAdd = domUtil.createDomElementWithClass('button', `btn-down-${index}`);
    
    buttonAdd.appendChild(domUtil.createDomElementWithClass('i', 'fas fa-arrow-up'));
    buttonDel.appendChild(domUtil.createDomElementWithClass('i', 'fas fa-arrow-down'));
    wrapper.appendChild(buttonAdd);
    wrapper.appendChild(buttonDel);
    return wrapper;
}