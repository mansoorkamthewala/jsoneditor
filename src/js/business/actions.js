'use strict';
var domUtil = require('./../utilities/basicDOMUtil');

var actions = {
    editor: null
};

/**
 * Initialize actions with and hold reference to Editor 
 * @param {Object} editor - Editor object
 */
actions.initialize = function (editor) {
    this.editor = editor;
}

// actions.inputChange = function () {
//     console.log('Change event triggered ....!!!!');
// };

// actions.typeChange = function (a, b, c) {
//     console.log('Change event triggered from dropdown....!!!!');
// };

/**
 * Sets highlight on the JSON structure view for current level of data
 * @param {Number} level - Current level of the JSON tree structure
 */
actions.setFocus = function (level) {
    var i, keyNodes = document.querySelectorAll(`div[class^="key-level-${level + 1}"`);

    for (i = 0; i < keyNodes.length; i++) {
        keyNodes[i].classList.add('focused');
    }
};

/**
 * Start the breadcrumb when first time new JSON is uploaded
 * OR new JSON creation begins
 */
actions.startBreadcrumb = function () {
    var json = this.editor.json,
        root = domUtil.createDomElementWithClass('div', `path-${json.level}`);
    root.innerText = json.type;
    // start fresh
    this.editor.breadcrumb.innerHTML = '';
    this.editor.breadcrumb.appendChild(root);
};

module.exports = actions;