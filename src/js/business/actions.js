'use strict';
var domUtil = require('./../utilities/basicDOMUtil');

var actions = {
    editor: null,
    path: []
};

/**
 * Helper function to extract data out of processed json
 * using the current path.
 */
actions.extractData = function () {
    var data = this.editor.json;
    if (this.path && this.path.length) {
        _.forEach(this.path, function (r) {
            if (_.isString(r)) {
                data = data.values.find(function (i) {
                    return i.key === r;
                });
            } else if (_.isNumber(r)) {
                data = data.values[r];
            }
        });
    }
    return data;
};

/**
 * Initialize actions with and hold reference to Editor 
 * @param {Object} editor - Editor object
 */
actions.initialize = function (editor) {
    this.editor = editor;
};

/**
 * resets path for the breadcrumb, resets focus on
 * JSON structure view and add root to the breadcrumb.
 */
actions.resetPath = function () {
    this.path = [];
    // set focus
    this.setFocus();
    // start breadcrumb
    this.startBreadcrumb();
};

/**
 * Sets highlight on the JSON structure view for current level of data
 * @param {Number} level - Current level of the JSON tree structure
 */
actions.setFocus = function () {
    var i,
        keyNodes,
        parentContainer,
        childElem = [],
        query = '.data-level-0';
    // start removing exiting focus
    keyNodes = document.querySelectorAll(`div[class$="focused`);
    for (i = 0; i < keyNodes.length; i++) {
        keyNodes[i].classList.remove('focused');
    }
    // build query based on current path
    for (i = 0; i < this.path.length; i++) {
        if (_.isString(this.path[i])) {
            query += ` .${this.path[i]}`;
        }
        if (_.isNumber(this.path[i])) {
            query += ` .data-level-${this.path.length}.array-${this.path[i]}`;
        }
    }
    //get parent data-level container
    parentContainer = document.querySelectorAll(`${query}`)[0];
    keyNodes = parentContainer ? parentContainer.childNodes : [];

    for (i = 0; i < keyNodes.length; i++) {
        var elem = keyNodes[i].querySelectorAll(`div[class^="key-level-${this.path.length + 1}"]`);

        if (!elem.length) {
            elem = keyNodes[i].querySelectorAll(`div[class^="value-level-${this.path.length + 1}"]`);
        }
        if (elem.length) {
            childElem.push(elem[0]);
        }
    }

    for (i = 0; i < childElem.length; i++) {
        childElem[i].classList.add('focused');
    }
};

/**
 * Start the breadcrumb when first time new JSON is uploaded
 * OR new JSON creation begins
 */
actions.startBreadcrumb = function () {
    var json = this.editor.json,
        root = domUtil.createDomElementWithClass('div', `path-root`);
    root.innerText = json.type;

    // add click event listener
    root.addEventListener('click', this.handleBreadcrumbClick.bind(this, []));

    this.editor.breadcrumb.appendChild(root);
};

/**
 * Event callback when object Value item is clicked.
 * Will push the key to the path, reset focus for new path,
 * updates breadcrumb and redraws editor view.
 * @param {String} key - Associated key for the value item
 */
actions.handleObjectValueClick = function (key) {
    // set path
    this.path.push(key);
    // set focus
    this.setFocus();
    // update Breadcrumb
    this.pushToBreadcrumb(key, this.path.length - 1);
    // redraw editor
    this.editor.applyChange(this.path);
};

/**
 * Helper function which creates breadcrumb item with separator
 * and push it on breadcrumb view with click handler
 * @param {String|Number} key - key value for breadcrumb
 * @param {Number} index - path index value
 */
actions.pushToBreadcrumb = function (key, index) {
    var item = domUtil.createDomElementWithClass('div', `path-${index}-${key}`),
        dot = domUtil.createDomElementWithClass('div', `dot-${index}`);
    item.innerText = _.isString(key) ? key : `[${key}]`;
    dot.innerText = '.';

    // add click event listener
    item.addEventListener('click', this.handleBreadcrumbClick.bind(this, _.cloneDeep(this.path)));
    this.editor.breadcrumb.appendChild(dot);
    this.editor.breadcrumb.appendChild(item);
};

/**
 * Helper function which removes item from breadcrumb with separator
 * based on the current path
 */
actions.removeFromBreadcrumb = function () {
    var lastNotPopped = true,
        classOnLastChild = `dot-${this.path.length}`,
        breadcrumb = document.querySelectorAll('.breadcrumb')[0],
        breadcrumbChildNodes = breadcrumb.childNodes;

    while (lastNotPopped) {
        var lastIndex = breadcrumbChildNodes.length - 1,
            lastNode = breadcrumbChildNodes[lastIndex];
        if (lastNode.className.includes(classOnLastChild)) {
            lastNotPopped = false;
        }
        breadcrumb.removeChild(lastNode);
    }
};

/**
 * Event callback when breadcrumb item is clicked.
 * Will replace new path values, reset focus for new path,
 * updates breadcrumb and redraws editor view.
 * @param {Array} newPath- new path
 */
actions.handleBreadcrumbClick = function (newPath) {
    if (_.isEqual(this.path, newPath)) {
        // nothing to do
        return;
    }
    this.path = _.cloneDeep(newPath);
    // set focus
    this.setFocus();
    //update Breadcrumb
    this.removeFromBreadcrumb();
    this.editor.applyChange(this.path);
};

/**
 * Event callback when Key for an object is changed.
 * new key will be updated in the json and editor and json view
 * will be updated
 * @param {String} oldValue - old key value
 * @param {String} newValue - new key value
 */
actions.handleKeyChange = function (oldValue, newValue) {
    var data = this.extractData();

    var itemToUpdate = _.find(data.values, {key: oldValue});
    if (itemToUpdate) {
        itemToUpdate.key = newValue;
    }
    // apply change with update to JSON structure view
    this.editor.applyChange(this.path, true);

    // sets back the focus
    this.setFocus();
};

/**
 * Event callback when Value for an object is changed.
 * new value will be updated in the json and editor and json view
 * will be updated
 * @param {Object} oldValue - old value
 * @param {Object} newValue - new value
 */
actions.handleValueChange = function (oldValue, newValue) {
    var itemToUpdate,
        isRootEdited = false,
        data = this.extractData();

    if (_.isString(oldValue.key)) {
        itemToUpdate = _.find(data.values, {key: oldValue.key});
    } else if (_.isNumber(oldValue.key)) {
        itemToUpdate = data.values[oldValue.key];
    } else {
        isRootEdited = true;
        itemToUpdate = data;
    }

    _.extend(itemToUpdate, newValue);
    // apply change with update to JSON structure view
    this.editor.applyChange(this.path, true);

    // sets back the focus
    this.setFocus();

    // if root was edited, breadcrumb must be initialized again
    if (isRootEdited) {
        this.editor.breadcrumb.innerHTML = '';
        this.startBreadcrumb();
    }
};
module.exports = actions;