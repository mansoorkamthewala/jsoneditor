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
    this.dragging = false;
    // initialize actions
    actions.initialize(this);
    this.wrapperDiv = domUtil.createDomElementWithClass('div', 'wrapper');

    // append items to wrapper
    // notifications
    this.wrapperDiv.appendChild(notify.initialize());
    // toolbar
    this.toolbar = toolbarView.createToolBar();
    this.wrapperDiv.appendChild(this.toolbar);
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
    var windowHeight = window.innerHeight,
        editorHeight = Math.floor(88 / 100 * windowHeight);
    this.editorWrapper = domUtil.createDomElementWithClass('div', 'editor-wrapper row');
    this.editorDiv = domUtil.createDomElementWithClass('div', 'editor-view');
    this.treeView = domUtil.createDomElementWithClass('div', 'display-view');

    this.editorDiv.style.height = `${editorHeight}px`;
    this.editorDiv.style.width = '50%';
    this.treeView.style.height = `${editorHeight}px`;
    this.treeView.style.width = '50%';

    this.displayEditor = domUtil.createDomElementWithClass('div', 'editor');
    this.editorDiv.appendChild(this.displayEditor);

    this.displayJSON = domUtil.createDomElementWithClass('div', 'json');
    this.verticalDragBar = this.addVerticalDragBar();
    this.adjustVerticalBarHeight();
    this.treeView.appendChild(this.verticalDragBar);
    this.treeView.appendChild(this.displayJSON);

    this.editorWrapper.appendChild(this.editorDiv);
    this.editorWrapper.appendChild(this.treeView);
    this.editorWrapper.appendChild(this.addDragBar());

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
    var breadcrumb = domUtil.createDomElementWithClass('div', 'breadcrumb row');
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
        // add height to vertical drag bar
        this.adjustVerticalBarHeight();
    }
    // start with emptying editor view
    editorView.target.innerHTML = '';
    // redraws editor
    editorView.populateEditor(this.json, editorView.target, path);
};

/**
 * Adds dragbar at the bottom of the Editor and will be used for
 * resizing editor. A minimum of 55px height will be maintained.
 * @returns {Element} returns Dragbar element
 */
Editor.prototype.addDragBar = function () {
    var barWrapper = domUtil.createDomElementWithClass('div', 'dragbar-wrapper'),
        bar = domUtil.createDomElementWithClass('div', 'dragbar'),
        _this = this,
        mouseDrag = function (e) {
            // sets the new location for the ghostbar
            var ghostBar = document.getElementsByClassName('ghostbar')[0];
            ghostBar && ghostBar.setAttribute('style', `top:${e.pageY}px;width:${ghostBar.style.width}`);
        },
        removeListeners = function () {
            // remove mousemove listener
            document.removeEventListener('mousemove', mouseDrag);
            // remove mouseup listener
            document.removeEventListener('mouseup', mouseUp);
        },
        mouseUp = function (event) {
            event.preventDefault();
            if (_this.dragging) {
                var ghostBar = document.getElementsByClassName('ghostbar')[0],
                    leftEditor = document.getElementsByClassName('editor-view')[0],
                    rightEditor = document.getElementsByClassName('display-view')[0],
                    newHeight = event.pageY - _this.toolbar.offsetHeight - _this.breadcrumb.offsetHeight - 8;

                // keep the minimum height to 55
                newHeight = newHeight <= 55 ? 55 : newHeight;

                ghostBar.parentNode.removeChild(ghostBar);
                leftEditor.style.height = `${newHeight}px`;
                rightEditor.style.height = `${newHeight}px`;

                // reassign vertical toolbar height
                _this.adjustVerticalBarHeight();
                _this.dragging = false;

                setTimeout(removeListeners, 0);
            }
        };

    // listens to mousedown, adds a ghostbar which will be dragged until mouseup
    barWrapper.addEventListener('mousedown', function (event) {
        event.preventDefault();
        var wrapper = document.getElementsByClassName('dragbar-wrapper')[0],
            ghostBar = domUtil.createDomElementWithClass('div', 'ghostbar');
        ghostBar.setAttribute('style', `width:${wrapper.scrollWidth}px;`);
        _this.dragging = true;
        wrapper.appendChild(ghostBar);

        // add mousemove listener
        document.addEventListener('mousemove', mouseDrag);
        // listens to mouseup, removes the ghostbar and sets the new height for the editor
        document.addEventListener('mouseup', mouseUp);
    });

    
    barWrapper.appendChild(bar);
    return barWrapper;
};

/**
 * Adds dragbar in the middle of Editor and JSON structure view and will be used for
 * resizing editors. A minimum of 10% OR 90% Width will be maintained for Editor view.
 * @returns {Element} returns Vertical Dragbar element
 */
Editor.prototype.addVerticalDragBar = function () {
    var barWrapper = domUtil.createDomElementWithClass('div', 'v-dragbar-wrapper'),
        bar = domUtil.createDomElementWithClass('div', 'v-dragbar'),
        _this = this,
        mouseDrag = function (e) {
            // sets the new location for the ghostbar
            var ghostBar = document.getElementsByClassName('v-ghostbar')[0];
            ghostBar && ghostBar.setAttribute('style', `left:${e.pageX}px;height:${_this.treeView.style.height}`);
        },
        removeListeners = function () {
            // remove mousemove listener
            document.removeEventListener('mousemove', mouseDrag);
            // remove mouseup listener
            document.removeEventListener('mouseup', mouseUp);
        },
        mouseUp = function (event) {
            event.preventDefault();
            if (_this.dragging) {
                var percentage = (event.pageX / window.innerWidth) * 100,
                    ghostBar = document.getElementsByClassName('v-ghostbar')[0],
                    leftEditor = document.getElementsByClassName('editor-view')[0],
                    rightEditor = document.getElementsByClassName('display-view')[0];

                if (percentage < 10) {
                    percentage = 10;
                } else if (percentage > 90) {
                    percentage = 90;
                }

                ghostBar.parentNode.removeChild(ghostBar);
                leftEditor.style.width = `${percentage}%`;
                rightEditor.style.width = `${100 - percentage}%`;
                _this.dragging = false;

                setTimeout(removeListeners, 0);
            }
        };

    // listens to mousedown, adds a ghostbar which will be dragged until mouseup
    barWrapper.addEventListener('mousedown', function (event) {
        event.preventDefault();
        var wrapper = document.getElementsByClassName('v-dragbar-wrapper')[0],
            ghostBar = domUtil.createDomElementWithClass('div', 'v-ghostbar');
        ghostBar.setAttribute('style', `height:${_this.treeView.style.height};`);
        _this.dragging = true;
        wrapper.appendChild(ghostBar);

        // add mousemove listener
        document.addEventListener('mousemove', mouseDrag);
        // listens to mouseup, removes the ghostbar and sets the new height for the editor
        document.addEventListener('mouseup', mouseUp);
    });
    barWrapper.appendChild(bar);
    return barWrapper;
};

/**
 * Adds height to the vertical dragbar. Height depends on JSON view element if JSON
 * has been populated otherwise it falls back to treeview.
 */
Editor.prototype.adjustVerticalBarHeight = function () {
    var height1 = this.displayJSON.offsetHeight,
        height2 = parseInt(this.treeView.style.height.replace('px', ''), 10);
    this.verticalDragBar.style.height = `${Math.max(height1, height2)}px`;
};

// export Editor module
Editor.default = Editor;
module.exports = Editor;
