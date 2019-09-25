'use strict';

var _ = require('lodash');
var domUtil = require('../utilities/basicDOMUtil');
var TYPES = require('../constants').TYPES;
var editorUtil = require('./editorViewUtil');

var editorView = {};

/**
 * Creates root div for editor view
 * @returns {Element} editor root element
 */
editorView.create = function () {
    var result = domUtil.createDomElementWithClass('div', 'editor-root');
    result.innerHTML = '';
    editorView.target = result;

    // while in create, create all helper HTML elements
    editorView.keyInput = domUtil.createKeyInput();
    editorView.keyInputInUse = false;

    editorView.valueInput = domUtil.createValueInput();
    editorView.valueInputInUse = false;

    // finally return editor root.
    return result;
};

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
        keyCard,
        valueCard;

    if (path && path.length) {
        _.forEach(path, function (r) {
            if (_.isString(r)) {
                data = data.values.find(function (i) {
                    return i.key === r;
                });
            } else if (_.isNumber(r)) {
                data = data.values[r];
            }
        });
    }

    switch (data.type) {
    case TYPES.OBJECT:
        if (data.values.length) {
            _.forEach(data.values, function (i, idx) {
                lineItem = getLineElement();
                keyCard = editorUtil.getKeyCard(i.key, idx);

                // add click event listener
                keyCard.onclick = editorUtil.handleKeyCardClick.bind(editorView, i.key);

                lineItem.appendChild(keyCard);
                valueCard = editorUtil.getValueCard(editorUtil.getValueText(i), i.type, idx);

                // add click event listener
                valueCard.childNodes[0].onclick = editorUtil.getClickHandler(i, idx);
                valueCard.childNodes[1].onclick = editorUtil.handleValueCardClick.bind(editorView, i);

                lineItem.appendChild(valueCard);
                lineItem.appendChild(editorUtil.getRightActionCard(idx));
                parent.appendChild(lineItem);
            });
        } else {
            lineItem = getLineElement();
            keyCard = editorUtil.getKeyCard();
            lineItem.appendChild(keyCard);
            valueCard = editorUtil.getValueCard('-', data.type, -1);
            valueCard.childNodes[1].onclick = editorUtil.handleValueCardClick.bind(editorView, data);
            lineItem.appendChild(valueCard);
            lineItem.appendChild(editorUtil.getRightActionCard(-1));
            parent.appendChild(lineItem);
        }
        break;
    case TYPES.ARRAY:
        if (data.values.length) {
            _.forEach(data.values, function (i, idx) {
                lineItem = getLineElement();
                lineItem.appendChild(editorUtil.getLeftActionCard(idx));
                lineItem.appendChild(editorUtil.getIndexCard(idx));
                valueCard = editorUtil.getValueCard(editorUtil.getValueText(i), i.type, idx);

                // add click event listener
                valueCard.childNodes[0].onclick = editorUtil.getClickHandler(i, idx);
                valueCard.childNodes[1].onclick = editorUtil.handleValueCardClick.bind(editorView, i);

                lineItem.appendChild(valueCard);
                lineItem.appendChild(editorUtil.getRightActionCard(idx));
                parent.appendChild(lineItem);
            });
        } else {
            lineItem = getLineElement();
            lineItem.appendChild(editorUtil.getLeftActionCard());
            lineItem.appendChild(editorUtil.getIndexCard('-'));
            valueCard = editorUtil.getValueCard('-', data.type, -1);
            valueCard.childNodes[1].onclick = editorUtil.handleValueCardClick.bind(editorView, data);
            lineItem.appendChild(valueCard);
            lineItem.appendChild(editorUtil.getRightActionCard(-1));
            parent.appendChild(lineItem);
        }
        break;
    case TYPES.STRING:
    case TYPES.NUMBER:
    case TYPES.BOOLEAN:
    case TYPES.NULL:
        lineItem = getLineElement();
        keyCard = editorUtil.getKeyCard(data.key);

        lineItem.appendChild(keyCard);

        valueCard = editorUtil.getValueCard(editorUtil.getValueText(data), data.type);
        // add click event listener
        valueCard.childNodes[1].onclick = editorUtil.handleValueCardClick.bind(editorView, data);
        lineItem.appendChild(valueCard);
        parent.appendChild(lineItem);
        break;
    default:
        break;
    }
};
module.exports = editorView;