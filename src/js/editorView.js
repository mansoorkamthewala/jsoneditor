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
 * @param {Object} item - Processed object data for which value string will be returned
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
 * Return click handler function
 * @param {Object} item - Processed object data click handler is requested
 * @param {Number} index - current position of the data in the JSON
 * @return {Function} - returns click handler function
 */
function getClickHandler (item, index) {
    var result;
    switch (item.type) {
    case TYPES.OBJECT:
    case TYPES.ARRAY:
        result = actions.handleObjectValueClick.bind(actions, item.key || index);
        break;
    default:
        result = _.noop;
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
editorView.populateEditor = function (json, parent, path = []) {
    var getLineElement = function () {
            // crates a line item 
            var line = domUtil.createDomElementWithClass('div', 'line-item');
            // @return {Element}
            return line;
        },
        data = json,
        lineItem,
        valueCard;

    if (path && path.length) {
        _.forEach(path, function (r) {
            if (_.isString(r)) {
                data = data.values.find(function (i) {
                    return i.key === r;
                })
            } else if (_.isNumber(r)) {
                data = data.values[r];
            }
        });
    }

    switch (data.type) {
    case TYPES.OBJECT:
        _.forEach(data.values, function (i, idx) {
            lineItem = getLineElement();
            lineItem.appendChild(jsonUtil.getKeyCard(i.key, idx));
            valueCard = jsonUtil.getValueCard(getValueText(i), i.type, idx);

            // add click event listener
            valueCard.addEventListener('click', getClickHandler(i));

            lineItem.appendChild(valueCard);
            lineItem.appendChild(jsonUtil.getRightActionCard(idx));
            parent.appendChild(lineItem);
        });
        break;
    case TYPES.ARRAY:
        _.forEach(data.values, function (i, idx) {
            lineItem = getLineElement();
            lineItem.appendChild(jsonUtil.getLeftActionCard(idx));
            lineItem.appendChild(jsonUtil.getIndexCard(idx));
            valueCard = jsonUtil.getValueCard(getValueText(i), i.type, idx);

            // add click event listener
            valueCard.addEventListener('click', getClickHandler(i, idx));

            lineItem.appendChild(valueCard);
            lineItem.appendChild(jsonUtil.getRightActionCard(idx));
            parent.appendChild(lineItem);
        });
        break;
    case TYPES.STRING:
    case TYPES.NUMBER:
    case TYPES.BOOLEAN:
    case TYPES.NULL:
        lineItem = getLineElement();
        lineItem.appendChild(jsonUtil.getKeyCard(data.key));
        lineItem.appendChild(jsonUtil.getValueCard(getValueText(data), data.type));
        parent.appendChild(lineItem);
        break;
    default:
        break;
    }
};
module.exports = editorView;