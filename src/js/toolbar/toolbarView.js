'use strict';

var actions = require('../business/actions');
var domUtil = require('../utilities/basicDOMUtil');

var toolbar = {};

/**
 * Creates toolbar view.
 * Toolbar  consist of buttons to upload JSON, start new JSON and download JSON
 * @return {Element} toolbar
 */
toolbar.createToolBar = function () {
    var _this = this,
        bar,
        button,
        input,
        downloadButton,
        startNewButton,
        fileNameBox;

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // create toolbar
        bar = domUtil.createDomElementWithClass('div', 'editor-toolbar row');

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

        downloadButton = domUtil.createDomElementWithClass('button', 'download-button');
        downloadButton.setAttribute('id', 'download-button');
        downloadButton.innerText = 'Download JSON';

        startNewButton = domUtil.createDomElementWithClass('button', 'start-new-button');
        startNewButton.setAttribute('id', 'start-new-button');
        startNewButton.innerText = 'Start New';

        fileNameBox = domUtil.createDomElementWithClass('span', 'file-name-box');


        // handle file selection by User
        var handleFileSelect = function (event) {
            var uploadedFile = event.target.files[0];
            // matches for correct JSON type, if not alert User.
            if (!uploadedFile.type.match('json')) {
                alert('Please upload a valid JSON file');
                return;
            }
            _this.setFileName(uploadedFile.name);

            var reader = new FileReader();
            // triggers when reading file is complete
            reader.onload = function (readFile) {
                // set's JSON on editor
                actions.setJSON(readFile.target.result);
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

        downloadButton.addEventListener('click', function () {
            var fileNameBox = document.getElementsByClassName('file-name-box')[0];
            actions.downloadJSON(fileNameBox.innerText || 'data.json');
        }, false);

        startNewButton.addEventListener('click', function () {
            _this.setFileName('data.json');
            actions.startNewJSON();
        }, false);

        bar.appendChild(button);
        bar.appendChild(input);
        bar.appendChild(startNewButton);
        bar.appendChild(downloadButton);
        bar.appendChild(fileNameBox);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    return bar;
};

/**
 * Sets the file name for the JSON being worked on.
 */
toolbar.setFileName = function (fName = '') {
    var fileNameBox = document.getElementsByClassName('file-name-box')[0];
    fileNameBox.innerText = fName;
};

module.exports = toolbar;