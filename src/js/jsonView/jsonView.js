'use strict';

var _ = require('lodash');
var domUtil = require('../utilities/basicDOMUtil');
var jsonUtil = require('./jsonViewUtil');
var TYPES = require('../constants').TYPES;

var jsonView = {};

/**
 * Creates root div for JSON structure view
 * @returns {Element} JSON root element
 */
jsonView.create = function () {
    var result = domUtil.createDomElementWithClass('div', 'json-root');
    result.innerHTML = '';
    jsonView.target = result;
    return result;
};

/**
 * Populate JSON structure view with the JSON data
 * @param {Object} json - Processed JSON data
 * @param {Element} parent - Parent element
 * @param {Boolean} hasSibling - Flag to indicate to put comma separator
 * @return {Element} - return parent element, now with children data appended
 */
jsonView.populateJSON = function (json, parent, keyIndex = 0, hasSibling = false) {
    var getLineElement = function (indent) {
            // crates a line item with appropriate indentation
            var space = '&nbsp;',
                line = domUtil.createDomElementWithClass('div', 'line-item');
            if (indent > 0) {
                var indentElement = (domUtil.createDomElementWithClass('span', `indent-level-${indent}`));
                indentElement.innerHTML = space.repeat(indent * 4);
                line.appendChild(indentElement);
            }
            // @return {Element}
            return line;
        },
        getKey = function (key, level) {
            // creates key attribute element with proper css with level
            var keyElement = domUtil.createDomElementWithClass('div', `key-level-${level}-index-${keyIndex}`);
            keyElement.innerHTML = `"${key}":&nbsp;`;
            // @return {Element}
            return keyElement;
        },
        getValue = function (value, level, isString) {
            // creates value element with proper css with level
            var valueElement = domUtil.createDomElementWithClass('div', `value-level-${level}`),
                quote = isString ? '"' : '',
                comma = hasSibling ? ',' : '';
            valueElement.innerHTML = `${quote}${value}${quote}${comma}`;
            // @return {Element}
            return valueElement;
        },
        comma,
        braceOpen,
        braceClose,
        lineItem1,
        lineItem2,
        objectDataWrapper;

    switch (json.type) {
    case TYPES.OBJECT:
    case TYPES.ARRAY:
        comma = hasSibling ? ',' : '';
        braceOpen = json.type === TYPES.OBJECT ? '{' : '[';
        braceClose = json.type === TYPES.OBJECT ? `}${comma}` : `]${comma}`;
        lineItem1 = getLineElement(json.level);
        lineItem2 = getLineElement(json.level);

        // start with adding key if available
        if (json.key) {
            lineItem1.appendChild(getKey(json.key, json.level));
        }
        // next add open brace, either { OR [
        lineItem1.appendChild(jsonUtil.getOpenBrace(braceOpen, json.level));
        // append to parent
        parent.appendChild(lineItem1);

        // populate data within { } | [ ]
        objectDataWrapper = domUtil.createDomElementWithClass('div', `data-level-${json.level} ${json.key || `array-${keyIndex}`}`);
        // recursively populate each Object property OR array item into data wrapper
        _.forEach(json.values, function (i, idx) {
            objectDataWrapper = jsonView.populateJSON(i, objectDataWrapper, idx, idx !== json.values.length - 1);
        });
        // append data wrapper to parent
        parent.appendChild(objectDataWrapper);

        // finish with adding a line item containing closing brace, either } OR ]
        lineItem2.appendChild(jsonUtil.getCloseBrace(braceClose, json.level));
        // finally append to parent
        parent.appendChild(lineItem2);
        break;
    case TYPES.STRING:
    case TYPES.NUMBER:
    case TYPES.BOOLEAN:
    case TYPES.NULL:
        lineItem1 = getLineElement(json.level);
        // start with adding key if available
        if (json.key) {
            lineItem1.appendChild(getKey(json.key, json.level));
        }
        // append value
        lineItem1.appendChild(getValue(json.values, json.level, json.type === TYPES.STRING));
        // and finally append line item to the parent
        parent.appendChild(lineItem1);
        break;
    default:
        break;
    }

    return parent;
};

module.exports = jsonView;