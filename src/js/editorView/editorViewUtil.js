'use strict';

var domUtil = require('../utilities/basicDOMUtil');
var TYPES = require('../constants').TYPES;
var DEFAULTS = require('../constants').DEFAULTS;
var actions = require('../business/actions');

/**
 * Extract the new value from the Value Input form depending on the type of the data.
 * @param {Element} form - Form from which new value needs to be extracted
 * @param {String} type - current type for the data
 * @param {Object} oldValue - old value which is being edited
 * @return {Any} New Value
 */
function getNewValue (form, type, oldValue) {
    var result;
    switch (type) {
    case TYPES.OBJECT:
        result = oldValue.type !== TYPES.OBJECT ? [] : oldValue.values;
        break;
    case TYPES.ARRAY:
        result = oldValue.type !== TYPES.ARRAY ? [] : oldValue.values;
        break;
    case TYPES.STRING:
        result = form.getElementsByTagName('textarea')[0].value;
        break;
    case TYPES.NUMBER:
        result = parseFloat(form.getElementsByTagName('input')[0].value);
        break;
    case TYPES.BOOLEAN:
        result = form.getElementsByTagName('input')[0].checked;
        break;
    case TYPES.NULL:
        result = null;
        break;
    default:
        break;
    }
    return result;
}

/**
 * Creates Form for the value field based on the type of the data.
 * @param {Object} data - data value which is being edited
 * @return {Element} DOM Element for value input based on type of the data
 */
function getFormForValue (data) {
    var result = domUtil.createDomElementWithClass('div', 'value-input-form-wrapper');
    switch (data.type) {
    case TYPES.OBJECT:
        result.innerText = '{...}';
        break;
    case TYPES.ARRAY:
        result.innerText = '[...]';
        break;
    case TYPES.STRING:
        result.appendChild(domUtil.createTextArea(data.values));
        break;
    case TYPES.NUMBER:
        result.appendChild(domUtil.createNumberInput(data.values));
        break;
    case TYPES.BOOLEAN:
        result.appendChild(domUtil.createCheckBox(data.values));
        break;
    case TYPES.NULL:
        result.innerText = 'null';
        break;
    default:
        break;
    }
    return result;
}

/**
 * Validate new Value entered.
 * @param {String} type - current type for the data
 * @param {Object} newValue - new value to be validated
 * @return {Boolean} returns boolean for validity
 */
function validateValue (type, newValue) {
    var valid = true;
    switch (type) {
    case TYPES.NUMBER:
        if (isNaN(newValue)) {
            valid = false;
            actions.notifyUser('Invalid number', 'error', 2500);
        }
        break;
    }

    return valid;
}

/**
 * Create a DOM element with key for Object type data
 * @param {String} key - innerText for the created DOM element representing key
 * @param {Number} index - index in the data structure
 * @return {Element} new DOM element
 */
exports.getKeyCard = function (key, index = 0) {
    var card = domUtil.createDomElementWithClass('div', `key-card-${index}`);
    card.innerText = key || '';
    return card;
};

/**
 * Create a DOM element with index for Array type data
 * @param {Number} index - innerText for the created DOM element representing index
 * @param {Number} index - index in the data structure
 * @return {Element} new DOM element
 */
exports.getIndexCard = function (index = 0) {
    var card = domUtil.createDomElementWithClass('div', `index-card-${index}`);
    card.innerText = index;
    return card;
};

/**
 * Create a DOM element with value for Object OR Array type data
 * @param {String} value - innerText for the created value DOM element representing value
 * @param {String} type - innerText for the created type DOM element representing type
 * @param {Number} index - index in the data structure
 * @return {Element} new DOM element
 */
exports.getValueCard = function (value, type, index = 0) {
    var wrapper = domUtil.createDomElementWithClass('div', `value-wrapper-${index}`),
        card = domUtil.createDomElementWithClass('div', `value-card-${index}`),
        typeCard = domUtil.createDomElementWithClass('div', `type-card-${index}`),
        edit = domUtil.createDomElementWithClass('i', 'fas fa-pen');
    card.innerText = value;
    typeCard.innerText = type;
    typeCard.appendChild(edit);
    wrapper.appendChild(card);
    wrapper.appendChild(typeCard);
    return wrapper;
};

/**
 * Create a DOM element with "Delete" and "Add" button. This action card will be placed
 * after value card on right side
 * @param {Number} index - index in the data structure
 * @return {Element} new DOM element
 */
exports.getRightActionCard = function (index) {
    var wrapper = domUtil.createDomElementWithClass('div', `right-action-wrapper-${index}`),
        buttonDel = domUtil.createDomElementWithClass('button', `btn-del-${index}`),
        buttonAdd = domUtil.createDomElementWithClass('button', `btn-add-${index}`);

    buttonAdd.appendChild(domUtil.createDomElementWithClass('i', 'fas fa-plus'));
    buttonDel.appendChild(domUtil.createDomElementWithClass('i', 'fas fa-times'));

    buttonAdd.onclick = actions.addItem.bind(actions, index);
    buttonDel.onclick = actions.deleteItem.bind(actions, index);

    wrapper.appendChild(buttonAdd);
    wrapper.appendChild(buttonDel);
    return wrapper;
};

/**
 * Create a DOM element with "Up" and "Down" button. This action card will be placed
 * before index card on left side. Will be only used for Array type data
 * @param {Number} index - index in the data structure
 * @return {Element} new DOM element
 */
exports.getLeftActionCard = function (index = -1) {
    var wrapper = domUtil.createDomElementWithClass('div', `left-action-wrapper-${index}`),
        buttonUp = domUtil.createDomElementWithClass('button', `btn-up-${index}`),
        buttonDown = domUtil.createDomElementWithClass('button', `btn-down-${index}`);

    buttonUp.appendChild(domUtil.createDomElementWithClass('i', 'fas fa-arrow-up'));
    buttonDown.appendChild(domUtil.createDomElementWithClass('i', 'fas fa-arrow-down'));

    buttonUp.onclick = actions.moveItem.bind(actions, index, 'up');
    buttonDown.onclick = actions.moveItem.bind(actions, index, 'down');

    wrapper.appendChild(buttonUp);
    wrapper.appendChild(buttonDown);
    return wrapper;
};

/**
 * Return value text for UI
 * @param {Object} item - Processed object data for which value string will be returned
 * @return {String} - returns value string
 */
exports.getValueText = function (item) {
    var result;
    switch (item.type) {
    case TYPES.OBJECT:
        result = '{...}';
        break;
    case TYPES.ARRAY:
        result = '[...]';
        break;
    case TYPES.NULL:
        result = 'null';
        break;
    default:
        result = item.values;
        break;
    }
    return result;
};

/**
 * Return click handler function
 * @param {Object} item - Processed object data click handler is requested
 * @param {Number} index - current position of the data in the JSON
 * @return {Function} - returns click handler function
 */
exports.getClickHandler = function (item, index) {
    var result;
    switch (item.type) {
    case TYPES.OBJECT:
    case TYPES.ARRAY:
        result = actions.handleObjectValueClick.bind(actions, item.key || index);
        break;
    default:
        result = _.noop;
        break;
    }
    return result;
};

/**
 * Saves new key to the JSON and update Editor and JSON view.
 * @param {String} oldValue - old key which will be passed to actions with new key
 */
function handleKeyInputFinish (oldValue) {
    var parent = this.keyInput.parentNode,
        newValue = this.keyInput.getElementsByTagName('input')[0].value;

    // run validation
    if (_.isEqual(oldValue, newValue)) {
        // if two values are equal, then it is valid and accept the change
    } else if (_.isEmpty(newValue)) {
        // if key is left empty, do nothing
        actions.notifyUser('Object Key cannot be empty', 'error', 2500);
        return;
    } else if (actions.isKeyInUse(newValue)) {
        // if key is in use, do nothing
        actions.notifyUser('Object Key already exist', 'error', 2500);
        return;
    }
    // remove input value
    this.keyInput.getElementsByTagName('input')[0].value = '';
    // remove onclick handler
    this.keyInput.getElementsByTagName('button')[0].onclick = null;
    // remove key input
    parent.removeChild(parent.childNodes[0]);
    // trigger action to save to the JSON
    actions.handleKeyChange(oldValue, newValue);
}

/**
 * Replace the key card with input field and populate current key.
 * @param {String} currentText - current/existing key
 * @param {Object} event - triggered event
 */
exports.handleKeyCardClick = function (currentText, event) {
    if (actions.keyInputInUse || actions.valueInputInUse) {
        // if in edit mode, do nothing and just return
        return;
    }
    var target = event.target,
        parent = target.parentNode;
    // mark it as in use
    actions.keyInputInUse = true;
    // set value on input
    this.keyInput.getElementsByTagName('input')[0].value = currentText;
    // set onclick for key input button
    this.keyInput.getElementsByTagName('button')[0].onclick = handleKeyInputFinish.bind(this, currentText);
    // replace card with key Input
    parent.replaceChild(this.keyInput, target);
};

/**
 * Saves new value to the JSON and update Editor and JSON view.
 * Before saving, validation is run against new value
 * @param {Object} oldValue - old value which will be passed to actions with new value
 * @param {Boolean} cancel - True if action was canceleed.
 */
function handleValueInputFinish (oldValue, cancel) {
    var parent = this.valueInput.parentNode,
        newType = this.valueInput.getElementsByClassName('dropbtn')[0].innerText,
        form = this.valueInput.getElementsByClassName('value-input-form')[0],
        newValue = getNewValue(form, newType, oldValue),
        childToRemove = parent.getElementsByClassName('value-wrapper-input')[0];
    // run validation
    if (!cancel && !validateValue(newType, newValue)) {
        return;
    }

    if (!cancel && !oldValue.key) {
        // if array, get the index being edited
        var indexCard = parent.querySelectorAll('div[class^="index-card-"')[0];
        // assign index to old value
        if (indexCard) {
            oldValue.key = parseInt(indexCard.innerText);
        }

    }
    // remove onclick handler
    this.valueInput.getElementsByTagName('button')[0].onclick = null;
    this.valueInput.getElementsByTagName('button')[1].onclick = null;
    domUtil.removeAllChildNodes(form);
    parent.removeChild(childToRemove);
    if (!cancel) {
        actions.handleValueChange(oldValue, {type: newType, values: newValue});
    } else {
        actions.handleCancel();
    }
}

/**
 * Handle type change from the dropdown and add default value based on selected type.
 * @param {Object} oldData - old value for which type is changing
 * @param {String} newType - New selected type for the data
 */
function handleTypeChange (oldData, newType) {
    var newData = {},
        form = this.valueInput.getElementsByClassName('value-input-form')[0];
    domUtil.removeAllChildNodes(form);
    newData.type = newType;
    newData.values = oldData.type === newType ? oldData.values :  _.clone(DEFAULTS[newType]);
    // set form for the current value
    form.appendChild(getFormForValue(newData));
}

/**
 * Replace the value card with Value Input form and populate current value.
 * @param {Object} node - Parent value node which needs to be replaced
 * @param {Object} data - current/existing value data
 */
exports.handleValueCardClick = function (node, data) {
    if (actions.valueInputInUse || actions.keyInputInUse) {
        // if in edit mode, do nothing and just return
        return;
    }
    var parentMost = node.parentNode,
        dropdown,
        form;
    // mark it as in use
    actions.valueInputInUse = true;
    // set type on dropdown
    dropdown = this.valueInput.getElementsByClassName('dropbtn')[0];
    form = this.valueInput.getElementsByClassName('value-input-form')[0];
    dropdown.innerText = data.type;
    dropdown.onchange = handleTypeChange.bind(this, data);

    // remove all children first for the form
    domUtil.removeAllChildNodes(form);
    // set form for the current value
    form.appendChild(getFormForValue(data));

    // set onclick for key input button
    this.valueInput.getElementsByTagName('button')[0].onclick = handleValueInputFinish.bind(this, {}, true);
    this.valueInput.getElementsByTagName('button')[1].onclick = handleValueInputFinish.bind(this, _.cloneDeep(data), false);
    // replace card with value Input form
    parentMost.replaceChild(this.valueInput, node);
};