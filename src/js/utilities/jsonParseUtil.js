'use strict';
var _ = require('lodash'),
    TYPES = require('../constants').TYPES;

/**
 * Process raw JSON data into a structure that is understood by Editor and JSON structure view.
 * This is called recursively to determine all data types and height of all data to all tree-leaf level.
 * @param {Object} data - data to be processed
 * @param {Number} level - level of data that is being processed, defaults to 0
 * @return {Object} new processed data
 */
function processData (data, level = 0) {
    var result = {
            type: '',
            level: level
        };

    if (_.isArray(data)) {
        result.type = TYPES.ARRAY;
        result.values = _.map(data, function (item) {
            return processData(item, level + 1);
        });
    } else if (_.isObject(data)) {
        result.type = TYPES.OBJECT;
        result.values = _.map(Object.keys(data), function (item) {
            return _.extend({key: item}, processData(data[item], level + 1));
        });
    } else {
        if (_.isString(data)) {
            result.type = TYPES.STRING;
        } else if (_.isBoolean(data)) {
            result.type = TYPES.BOOLEAN;
        } else if (_.isNumber(data)) {
            result.type = TYPES.NUMBER;
        } else if (_.isNull(data)) {
            result.type = TYPES.NULL;
        }
        result.values = data;
    }

    return result;
}

exports.processData = processData;