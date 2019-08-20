'use strict';

var _ = require('lodash');
var domUtil = require('./utilities/basicDOMUtil');
var jsonUtil = require('./utilities/jsonViewUtil');

var view = {};

/**
 * Creates root div for JSON structure view
 * @returns {Element} JSON rool element
 */
view.create = function () {
    var result = domUtil.createDomElementWithClass('div', 'json-root');
    view.target = result;
    return result;
}

/**
 * Populate JSON structure view with the JSON data
 * @param {Object} json - Processed JSON data
 */
view.populateJSON = function (json) {
    // start emptying target first
    view.target.innerHTML = '';
    if (_.isArray(json)) {
        // todo
    }
    if (_.isObject(json)) {
        view.target.appendChild(jsonUtil.getOpenCurly(0));
        view.target.appendChild(jsonUtil.getCloseCurly(0));
    }
}

module.exports = view;