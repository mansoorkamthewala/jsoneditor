'use strict';

var domUtil = require('./utilities/basicDOMUtil');
var actions = require('./business/actions');
var jsonView = require('./jsonView/jsonView');
var toolbarView = require('./toolbar/toolbarView');
var notify = require('./notification/notify');
var editorView = require('./editorView/editorView');

// load css
var css = require('../css/editor.css');

/**
 * Editor Class
 * @constructor Editor
 * @param {Element} targetElement target container element
 */
function Editor (targetElement) {
    if (!(this instanceof Editor)) {
        throw new Error('Editor constructor called without "new".');
    }
    // initialize editor
    this.create(targetElement);
}

/**
 * Creates editor, toolbar and navbar of the editor
 * @param {Element} targetElement target container element
 */
Editor.prototype.create = function (targetElement) {
    this.targetElement = targetElement;
    this.json = {};
    this.active = false;
    // initialize actions
    actions.initialize(this);
    this.wrapperDiv = domUtil.createDomElementWithClass('div', 'wrapper');

    // append items to wrapper
    // notifications
    this.wrapperDiv.appendChild(notify.initialize());
    // toolbar
    this.wrapperDiv.appendChild(toolbarView.createToolBar());
    // breadcrumb
    this.breadcrumb = this.createBreadcrumb();
    this.wrapperDiv.appendChild(this.breadcrumb);
    // editor
    this.wrapperDiv.appendChild(this.createViews());

    // now append wrapper to target element
    this.targetElement.appendChild(this.wrapperDiv);
};

/**
 * Creates editor wrapper view.
 * Editor arapper consists of 2 view side by side, one is editor on left (for editing JSON) and
 * second view on right is JSON structure view (to view JSON)
 * @return {Element} editor wrapper view
 */
Editor.prototype.createViews = function () {
    this.editorWrapper = domUtil.createDomElementWithClass('div', 'editor-wrapper row');
    this.editorDiv = domUtil.createDomElementWithClass('div', 'editor-view col-50');
    this.treeView = domUtil.createDomElementWithClass('div', 'display-view col-50');

    this.displayEditor = domUtil.createDomElementWithClass('div', 'editor');
    this.editorDiv.appendChild(this.displayEditor);

    this.displayJSON = domUtil.createDomElementWithClass('div', 'json');
    this.treeView.appendChild(this.displayJSON);

    this.editorWrapper.appendChild(this.editorDiv);
    this.editorWrapper.appendChild(this.treeView);

    this.displayJSON.appendChild(jsonView.create());
    this.displayEditor.appendChild(editorView.create());

    return this.editorWrapper;
};

/**
 * Creates Breadcrumb view.
 * Breadcrumb view will be used for easy navigation through JSON
 * @return {Element} breadcrumb
 */
Editor.prototype.createBreadcrumb = function () {
    var breadcrumb = domUtil.createDomElementWithClass('div', 'breadcrumb row');;
    return breadcrumb;
};

/**
 * Apply any changes to editor view and redraw it.
 * @param {Array} json - Array representing current selected path
 * @param {Boolean} updateJSONView - flag that determined if json view needs to be redrawn
 */
Editor.prototype.applyChange = function (path, updateJSONView = false) {
    // only update JSON structure view if needed
    if (updateJSONView) {
        // start with emptying json view
        jsonView.target.innerHTML = '';
        // redraws JSON structure view
        jsonView.populateJSON(this.json, jsonView.target);
    }
    // start with emptying editor view
    editorView.target.innerHTML = '';
    // redraws editor
    editorView.populateEditor(this.json, editorView.target, path);
}

// export Editor module
Editor.default = Editor;
module.exports = Editor;
