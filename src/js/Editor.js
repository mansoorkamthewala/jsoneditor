'use strict';

var domUtil = require('./utilities/basicDOMUtil');
var jsonUtil = require('./utilities/jsonParseUtil');
var jsonView = require('./jsonView');

// load css
var css = require('../css/editor.css');

/**
 * Editor Class
 * @constructor Editor
 * @param {Element} targetElement target container element
 */
function Editor(targetElement) {
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
    this.wrapperDiv = domUtil.createDomElementWithClass('div', 'wrapper');

    // append items to wrapper
    this.wrapperDiv.appendChild(this.createToolBar());
    this.wrapperDiv.appendChild(this.createEditor());

    // now append wrapper to target element
    this.targetElement.appendChild(this.wrapperDiv);
};

/**
 * Creates editor wrapper view.
 * Editor arapper consists of 2 view side by side, one is editor on left (for editing JSON) and
 * second view on right is JSON structure view (to view JSON)
 * @return {Element} editor wrapper view
 */
Editor.prototype.createEditor = function () {
    this.editorWrapper = domUtil.createDomElementWithClass('div', 'editor-wrapper row');
    this.editorDiv = domUtil.createDomElementWithClass('div', 'editor col-50');
    this.treeView = domUtil.createDomElementWithClass('div', 'display col-50');

    this.displayJSON = domUtil.createDomElementWithClass('div', 'json');

    this.treeView.appendChild(this.displayJSON);

    this.editorWrapper.appendChild(this.editorDiv);
    this.editorWrapper.appendChild(this.treeView);
    this.displayJSON.appendChild(jsonView.create());

    return this.editorWrapper;
};

/**
 * Creates toolbar view.
 * Toolbar  consist of buttons to upload JSON, start new JSON and download JSON
 * @return {Element} toolbar
 */
Editor.prototype.createToolBar = function () {
    var toolbar,
        button,
        input,
        _this = this;

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // create toolbar
        toolbar = domUtil.createDomElementWithClass('div', 'editor-toolbar row');

        // input button to upload JSON file and is set to not display
        input = domUtil.createDomElementWithClass('input', 'file-input');
        input.type = 'file';
        input.setAttribute('id', 'file-upload');
        input.setAttribute('style', 'display:none');
        // button to proxy action for input (type=file)
        button = domUtil.createDomElementWithClass('button', 'upload-button');
        button.setAttribute('id', 'upload-button');
        button.setAttribute('for', 'file-upload');
        button.innerText = 'Upload JSON';

        // handle file selection by User
        var handleFileSelect = function (event) {
            var uploadedFile = event.target.files[0];
            // matches for correct JSON type, if not alert User.
            if (!uploadedFile.type.match('json')) {
                alert('Please upload a valid JSON file');
                return;
            }
            
            var reader = new FileReader();
            // triggers when reading file is complete
            reader.onload = function (readFile) {
                // set's JSON on editor
                _this.setJSON(readFile.target.result.replace(/\s/g, ''));
            };
            // reading file begins
            reader.readAsText(uploadedFile);
        }

        // button click event which in return trigger click for input(type=file)
        button.addEventListener('click', function () {
            document.getElementById('file-upload').click();
        }, false);
        // change event for input (type=file)
        input.addEventListener('change', handleFileSelect, false);
        // must set value to null on click, so upload of same file can 
        // trigger change event
        input.addEventListener('click', function () {
            this.value = null;
        }, false);

        toolbar.appendChild(button);
        toolbar.appendChild(input);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    return toolbar;
};

/**
 * Process JSON and set it on Editor.
 * Triggers JSON structure view to re-render with loaded JSON.
 * @param {String} json - Stringified JSON structure which is read from File
 */
Editor.prototype.setJSON = function (json) {
    var parsedJSON;
    try {
        parsedJSON = JSON.parse(json);
    } catch (error) {
        alert('Uploaded JSON file is not valid JSON');
    }
    // process parsed JOSN
    this.json = jsonUtil.processData(parsedJSON);
    jsonView.populateJSON(this.json);
};


// export Editor module
Editor.default = Editor;
module.exports = Editor;
