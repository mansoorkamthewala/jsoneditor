'use strict';

var _ = require('lodash');
var domUtil = require('./utilities/basicDOMUtil');
var TYPES = require('./constants').TYPES;
var jsonUtil = require('./utilities/jsonViewUtil');
var actions = require('./business/actions');

var editorView = {};

/**
 * Creates root div for editor view
 * @returns {Element} editor root element
 */
editorView.create = function () {
    var result = domUtil.createDomElementWithClass('div', 'editor-root');
    result.innerHTML = '';
    editorView.target = result;
    return result;
};

/**
 * Return value text for UI
 * @param {Object} item - Processed onject data for which value string will be returned
 * @return {String} - returns value string
 */
function getValueText (item) {
    var result = '';
    switch (item.type) {
    case TYPES.OBJECT:
        result = '{...}';
        break;
    case TYPES.ARRAY:
        result = '[...]';
        break;
    case TYPES.NULL:
        result = 'null';
        break;
    default:
        result = item.values;
        break;
    }
    return result;
}

/**
 * Populate Editor view with the JSON data at current level
 * @param {Object} json - Processed JSON data
 * @param {Element} parent - Parent element
 * @return {Element} - return parent element, now with children data appended
 */
editorView.populateEditor = function (json, parent, level = 0) {
    var getLineElement = function () {
            // crates a line item 
            var line = domUtil.createDomElementWithClass('div', 'line-item');
            // @return {Element}
            return line;
        },
        lineItem;

    // start setting focus on JSON view
    actions.setFocus(json.level);
    // next push root type on to the breadcrumb
    actions.startBreadcrumb();

    switch (json.type) {
    case TYPES.OBJECT:
        _.forEach(json.values, function (i, idx) {
            lineItem = getLineElement();
            lineItem.appendChild(jsonUtil.getKeyCard(i.key, idx));
            lineItem.appendChild(jsonUtil.getValueCard(getValueText(i), i.type, idx));
            lineItem.appendChild(jsonUtil.getRightActionCard(idx));
            parent.appendChild(lineItem);
        });
        break;
    case TYPES.ARRAY:
        _.forEach(json.values, function (i, idx) {
            lineItem = getLineElement();
            lineItem.appendChild(jsonUtil.getLeftActionCard(idx));
            lineItem.appendChild(jsonUtil.getIndexCard(idx));
            lineItem.appendChild(jsonUtil.getValueCard(getValueText(i), i.type, idx));
            lineItem.appendChild(jsonUtil.getRightActionCard(idx));
            parent.appendChild(lineItem);
        });
        break;
    case TYPES.STRING:
    case TYPES.NUMBER:
    case TYPES.BOOLEAN:
    case TYPES.NULL:
        lineItem = getLineElement();
        lineItem.appendChild(jsonUtil.getKeyCard(json.key));
        lineItem.appendChild(jsonUtil.getValueCard(getValueText(json), json.type));
        parent.appendChild(lineItem);
        break;
    default:
        break;
    }
};
module.exports = editorView;