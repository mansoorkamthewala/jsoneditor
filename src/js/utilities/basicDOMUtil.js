'use strict';

var TYPES = require('./../constants').TYPES;

/**
 * Create a DOM element with div and add classes
 * @param {String} tag - tag to be used to creat DOM element
 * @param {String} cssClass - CSS classes to be added to the new Div DOM element
 * @return {Object} new DOM element
 */
function createDomElementWithClass(tag, cssClass) {
    if (!tag) {
        throw new Error('tag cannot be empty.');
    }
    var item = document.createElement(tag);
    if (cssClass) {
        item.setAttribute('class', cssClass);
    }
    return item;
}
exports.createDomElementWithClass = createDomElementWithClass;

/**
 * Removes all child element from the given element
 * @param {Element} element - parent element
 */
function removeAllChildNodes (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
exports.removeAllChildNodes = removeAllChildNodes;

/**
 * Creates dropdown menu with supported types
 * @returns {Element} - returns element with dropdown
 */
function createDropdownMenu () {
    var wrapper = createDomElementWithClass('div', `dropdown`),
        button = createDomElementWithClass('button', `dropbtn`),
        icon = createDomElementWithClass('i', `fa fa-caret-down`),
        content = createDomElementWithClass('div', `dropdown-content`),
        typeKeys = Object.keys(TYPES),
        handleOptionClick = function (newValue) {
            button.innerText = newValue;
            button.onchange && button.onchange(newValue);
        };

    button.appendChild(icon);

    for (var i = 0; i < typeKeys.length; i++) {
        var item = createDomElementWithClass('a');
        item.innerText = TYPES[typeKeys[i]];
        item.onclick = handleOptionClick.bind(this, item.innerText);
        content.appendChild(item);

    }
    wrapper.appendChild(button);
    wrapper.appendChild(content);
    return wrapper;
}

/**
 * Creates Input DOM element for Key update with submit icon
 * @returns {Element} - returns element with key input
 */
function createKeyInput () {
    var keyCard = createDomElementWithClass('div', 'key-card-'),
        keyInput = createDomElementWithClass('div', 'key-input-wrapper'),
        input = createDomElementWithClass('input', 'key-input-text'),
        button = createDomElementWithClass('button', 'key-input-button'),
        icon = createDomElementWithClass('i', 'fas fa-check');

    button.appendChild(icon);
    keyInput.appendChild(input);
    keyInput.appendChild(button);
    keyCard.appendChild(keyInput);

    return keyCard;;
}
exports.createKeyInput = createKeyInput;

/**
 * Creates DOM Value Input element for value update with submit icon and
 * type dropdown
 * @returns {Element} - returns element with value input
 */
function createValueInput () {
    var valueCard = createDomElementWithClass('div', 'value-wrapper-input'),
        valueInputToolbar = createDomElementWithClass('div', 'value-input-toolbar'),
        valueInputForm = createDomElementWithClass('div', 'value-input-form'),
        typeDropdown = createDropdownMenu(),
        button = createDomElementWithClass('button', 'value-input-button'),
        icon = createDomElementWithClass('i', 'fas fa-check');

    button.appendChild(icon);
    valueInputToolbar.appendChild(button);
    valueInputToolbar.appendChild(typeDropdown);
    valueCard.appendChild(valueInputToolbar);
    valueCard.appendChild(valueInputForm);

    return valueCard;;
}
exports.createValueInput = createValueInput;

/**
 * Creates Text area field for updating String type data.
 * @returns {Element} - returns element with Text area
 */
function createTextArea (value) {
    var textArea = createDomElementWithClass('textarea'),
        keyPressListener = function (event) {
            // ignore enter keypress
            if (event.which === 13) {
                event.preventDefault();
                return false;
            }
        };
    textArea.setAttribute('rows', '4');
    textArea.innerText = value;
    textArea.onkeypress = keyPressListener;
    return textArea;
}
exports.createTextArea = createTextArea;

/**
 * Creates Number Input field for updating Number type data.
 * @returns {Element} - returns element with Number input
 */
function createNumberInput (value) {
    var input = createDomElementWithClass('input');
    input.setAttribute('type', 'number');
    input.setAttribute('value', value);
    return input;
}
exports.createNumberInput = createNumberInput;

/**
 * Creates Checkbox field for updating Boolean type data.
 * @returns {Element} - returns element with Checkbox input
 */
function createCheckBox (value) {
    var input = createDomElementWithClass('input');
    input.setAttribute('type', 'checkbox');
    input.checked = value;
    return input;
}
exports.createCheckBox = createCheckBox;