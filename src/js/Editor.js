'use strict';

function Editor () {
	if (!(this instanceof Editor)) {
	  throw new Error('Editor constructor called without "new".');
	}

	console.log('Constructor called ...');

	Editor.prototype.initialize = function () {
		console.log('Editor Initialized ...');
	}
}

// export Editor module
Editor.default = Editor;
module.exports = Editor;
