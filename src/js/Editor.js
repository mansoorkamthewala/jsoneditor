'use strict';

var domUtil = require('./utilities/basicDOMUtil');

// load css
var css = require('../css/editor.css');


function Editor (targetElement) {
    if (!(this instanceof Editor)) {
        throw new Error('Editor constructor called without "new".');
    }
    // initialize editor
    this.create(targetElement);
}

Editor.prototype.create = function (targetElement) {
    this.targetElement = targetElement;
    this.wrapperDiv = domUtil.createDomWithClass('wrapper row');
    this.editorDiv = domUtil.createDomWithClass('editor col-50');
    this.displayDiv = domUtil.createDomWithClass('display col-50');

    // append editor and display view to wrapper
    this.wrapperDiv.appendChild(this.editorDiv);
    this.wrapperDiv.appendChild(this.displayDiv);

    // now append wrapper to target element
    this.targetElement.appendChild(this.wrapperDiv);
}

// export Editor module
Editor.default = Editor;
module.exports = Editor;
