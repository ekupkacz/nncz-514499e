/**
 * Copyright ©2021 Lukáš Kupka <development@ekupka.cz>
 */


var SmartCalc = {
	/**
	 * Preventing calculated value to apply
	 * when field has been already changed manually
	 */
	preventIfAlreadyManuallyChanged: function (event) {
		if (!event || event.type !== "Field" || event.name !== "Calculate") {
			consoleDump("Only calculation events are handled by this method!");
			return false;
		}
		if (event.source !== null && event.source.name === event.target.name) {
			this._addManuallyChangedField(event.target.name);
		}
		event.rc = !this._isFieldManuallyChanged(event.target.name);
	},
	_addManuallyChangedField: function (fieldName) {
		if (fieldName && !inArray(fieldName, this._manuallyChangedFields)) {
			this._manuallyChangedFields.push(fieldName);
		}
		consoleDump("\nSmartCals's manually changed fields array updated:\n" + this._manuallyChangedFields.join("\n"));
	},
	removeManuallyChangedField: function (fieldName) {
		this._manuallyChangedFields = this._manuallyChangedFields.filter(function(item) {
			var flag = item !== fieldName;
			if (!flag) {
				consoleDump("\nSmartCals's manually changed field array removed:\n" + fieldName);
			}
			return flag;
		});
	},
	_isFieldManuallyChanged: function (fieldName) {
		return inArray(fieldName, this._manuallyChangedFields);
	},
	_manuallyChangedFields: []
};

function unifyArial() {
	var omitFont = '3of9Barcode';
	var newFont = 'Arial';
	var newFontBold = newFont + ',Bold';
	console.clear();
	var changedFields = [];
	for (var i = 0; i < this.numFields; i++) {
		var f = this.getField(this.getNthFieldName(i));
		switch (f.type) {
			case 'text':
			case 'button':
			case 'combobox':
			case 'listbox':
				if (f.textFont !== newFont && f.textFont !== newFontBold && f.textFont !== omitFont) {
					if (f.textFont.indexOf(',Bold') < 0) {
						f.textFont = newFont;
					} else {
						f.textFont = newFontBold;
					}
					changedFields.push(f.name);
				}
				break;
			case 'checkbox':
			case 'radiobutton':
			case 'signature':
			default:
				break;
		}

	}
	console.println('Changed fields total: ' + changedFields.length);
	console.println('Changed fields:\n' + changedFields.join('\n'));
}


/** OR group for setting required state */
var GroupManager = {
	/**
	 *
	 * @param name
	 * @returns {*}
	 */
	getGroupByFieldName: function (name) {
		for (var orGroupName in this.orGroups) {
			if (inArray(name, this.orGroups[orGroupName])) {
				return this.orGroups[orGroupName];
			}
		}
		return false;
	},
	/**
	 *
	 * @param name
	 * @returns {*}
	 */
	getGroupNameByFieldName: function (name) {
		for (var orGroupName in this.orGroups) {
			if (inArray(name, this.orGroups[orGroupName])) {
				return orGroupName;
			}
		}
		return false;
	},
	/**
	 *
	 * @param orGroup
	 */
	setOrGroupRequired: function (orGroup) {
		if (!this.orGroups.hasOwnProperty(orGroup)) {
			consoleDump("\nGroupManagerError: Undefined orGroup: '" + orGroup + "'!");
		}
		var groupValid = false;
		for (var i = 0; i < this.orGroups[orGroup].length; i++) {
			if (!isEmpty(this.orGroups[orGroup][i])) {
				groupValid = true;
				setRequired(this.orGroups[orGroup][i], true);
			} else {
				setRequired(this.orGroups[orGroup][i], false);
			}
		}
		if (!groupValid) {
			for (var i2 = 0; i2 < this.orGroups[orGroup].length; i2++) {
				setRequired(this.orGroups[orGroup][i2], true);
			}
		}
		initFields(this.orGroups[orGroup]);
	},
	/**
	 *
	 * @param fieldName
	 */
	handleOrGroupMemeberChange: function (fieldName) {
		var g = this.getGroupNameByFieldName(fieldName);
		if (g) {
			this.setOrGroupRequired(g);
		} else {
			//consoleDump("\nGroupManagerError: No orGroup found for field name: '" + fieldName + "'!");
		}
	},
	/**
	 * OR groups definitions
	 */
	orGroups: DefaultFormConfig.orGroups
};

function isEmpty(name) {
	var f = this.getField(name);
	if (!f) {
		consoleDump("\nError isEmpty() called with non-existing field name: '" + name + "'");
		return;
	}
	return f.value === false || f.value === "Off" || this.getField(name).value === "" || this.getField(name).value === "undefined";
}

/**
 * Define field fill color for different states
 */

function setFieldState(name, state) {

	var preset = {
		highlightFillColor: ["RGB", 1, 1, 0.25],
		highlightNoRequiredFillColor: ["RGB", 1, 1, 0.75],
		requiredFillColor: ["RGB", 1, 0.85, 0.85],
		errorFillColor: ["RGB", 1, 0, 0],
		okFillColor: ["RGB", 0.75, 1, 0.75],
		defaultFillColor: color.transparent
	};

	var f = this.getField(name);

	if (state === "highlight") {
		f.fillColor = preset.highlightFillColor;
	} else if (state === "highlightNoRequired") {
		f.fillColor = preset.highlightNoRequiredFillColor;
	} else if (state === "required") {
		f.fillColor = preset.requiredFillColor;
	} else if (state === "ok") {
		f.fillColor = preset.okFillColor;
	} else if (state === "error") {
		f.fillColor = preset.errorFillColor;
	} else if (state === "default") {
		//consoleDump(preset.defaultFillColor);
		f.fillColor = preset.defaultFillColor;
	} else {
		consoleDump("Wrong state parameter: " + state + "!");
	}
}



maskFields.forEach(function (fname) {
	this.getField(fname).fillColor = DefaultFormConfig.maskFieldFillColor;
})

var fieldsExcludedFromInitialization = DefaultFormConfig.fieldNamesExcludedFromInitialization.concat(tooltipFields, maskFields);

tooltipFields.forEach(function (fname) {
	this.getField(fname).textColor = DefaultFormConfig.tooltipFieldTextColor;
	this.getField(fname).fillColor = DefaultFormConfig.tooltipFieldFillColor;
	this.getField(fname).textFont = DefaultFormConfig.tooltipFieldtextFont;
	this.getField(fname).textSize = DefaultFormConfig.tooltipFieldtextSize;
});


function initFields(names) {
	if (typeof names === "undefined") {
		names = [];
		for (var x = 0; x < this.numFields; x++) {
			names[x] = this.getNthFieldName(x);
		}
	}
	for (var i = 0; i < names.length; i++) {
		if (isArray(names[i])) {
			initFields(names[i]);
		} else {
			var f = this.getField(names[i]);
			if (f === null) {
				consoleDump("\nError: Field '" + names[i] + "' not found in document!");
				return;
			}
			if (f.type !== "button" && !inArray(names[i], fieldsExcludedFromInitialization)) {
				if (!f.readonly) {
					if (f.required) {
						setFieldState(f.name, 'highlight');
					} else {
						setFieldState(f.name, 'highlightNoRequired');
						//setFieldState(f.name, 'default');
					}
					if (!isEmpty(f.name)) {
						//setFieldState(f.name, "ok");
					}
				} else {
					setFieldState(f.name, "default");
				}
			}
			if (f.type === "text" && !inArray(names[i], fieldsExcludedFromInitialization)) {
				switch (f.name) {
					default:
						f.textFont = DefaultFormConfig.textFieldTextFont;
						f.textSize = DefaultFormConfig.textFieldTextSize;
						f.doNotScroll = DefaultFormConfig.textFieldDoNotScroll;
						break;
				}
			}
		}
	}
}

function consoleDump(str) {
	if (DefaultFormConfig.debugMode)
		console.println(str);
}

function setVisible(fieldNames, flag) {
	if (isArray(fieldNames)) {
		for (var i = 0; i < fieldNames.length; i++) {
			setVisible(fieldNames[i], flag);
		}
	} else if (typeof fieldNames === "string") {
		var f = this.getField(fieldNames);
		if (f === null) {
			consoleDump("\nError: Field '" + fieldNames + "' not found in document!");
			return;
		}
		f.display = flag ? display.visible : display.hidden;
	} else {
		consoleDump("setVisible() - Unsupported type provided: '" + typeof fieldNames + "'! Supports only array and string!");
	}
}

function affectChildren(fieldNames, flag) {
	//setRequired(fieldNames, flag);
	setVisible(fieldNames, flag);
	if (flag === false) {
		clearValues(fieldNames);
		//setRequired(fieldNames, true);
	}
	initFields(fieldNames);
}

function clearValues(fieldNames) {

	if (!isArray(fieldNames) && typeof fieldNames !== "undefined") {
		fieldNames = [fieldNames];
	}
	for (var i = 0; i < fieldNames.length; i++) {
		if (isArray(fieldNames[i])) {
			clearValues(fieldNames[i]);
		} else {
			var f = this.getField(fieldNames[i]);
			if (f === null) {
				consoleDump("\nError: Field '" + fieldNames[i] + "' not found in document!");
				return;
			}
			var initialValue = initialValues.hasOwnProperty(fieldNames[i]) ? initialValues[fieldNames[i]] : "";
			//consoleDump("\nFound initial value for '" + fieldNames[i] + "' : " + initialValue);
			switch (f.type) {
				case "checkbox":
					f.value = initialValue !== "" ? initialValue : "Off";
					break;
				case "text":
					f.value = initialValue;
					break;
				case "radiobutton":
					f.value = initialValue !== "" ? initialValue : undefined;
					break;
				case "combobox":
					if (initialValue !== "") {
						f.setItems(initialValue);
					}
					break;
				default:
					break;
			}
			SmartCalc.removeManuallyChangedField(fieldNames[i]);
		}
	}
}

function isArray(obj) {
	return (!!obj) && (obj.constructor === Array);
}

function recursiveResolveChildren(triggerName) {

	this.calculate = false;

	var resolvedTrigger;
	if (typeof triggerName === "undefined") {
		if (typeof event.target !== "undefined") {
			resolvedTrigger = event.target;
		} else {
			consoleDump("Error: Calling resolveChildren without parameter when not in MouseUp Event context!");
		}
	} else {
		resolvedTrigger = this.getField(triggerName);
		if (!resolvedTrigger) {
			consoleDump("\nError: Calling resolveChildren for non-existing field '" + triggerName + "' !");
			return;
		}
	}
	if (triggers.hasOwnProperty(resolvedTrigger.name)) {
		for (var i = 0; i < triggers[resolvedTrigger.name].length; i++) {
			var fieldNames = triggers[resolvedTrigger.name][i].fieldNames;
			var triggeringValue = triggers[resolvedTrigger.name][i].triggeringValue;
			var newFlag;
			if (typeof triggeringValue === "undefined") {
				newFlag = !isEmpty(resolvedTrigger.name);
			} else if (triggeringValue === "negate") {
				newFlag = isEmpty(resolvedTrigger.name);
			} else if (isArray(triggeringValue)) {
				/** @todo Check is this really can happen and its handled properly */
				consoleDump("\nUsing " + triggeringValue.shift() + " for fields: " + triggeringValue + "!");
				newFlag = isEmpty(resolvedTrigger.name);
			} else newFlag = resolvedTrigger.value === triggeringValue;
			affectChildren(fieldNames, newFlag);

			for (var i2 = 0; i2 < fieldNames.length; i2++) {
				GroupManager.handleOrGroupMemeberChange(fieldNames[i2]);
				recursiveResolveChildren(fieldNames[i2]);
			}
		}
	}

	/** searching groupTriggers for resolvedTrigger.name */
	var groupName;
	for (groupName in groupTriggers) {
		var triggerNames = groupTriggers[groupName]["triggerNames"];
		var type = groupTriggers[groupName]["type"];
		var showFieldNames = groupTriggers[groupName]["showFieldNames"];
		var hideFieldNames = groupTriggers[groupName]["hideFieldNames"];
		if (inArray(resolvedTrigger.name, triggerNames)) {
			//consoleDump("Resolving child fields for AND/OR trigger '" + resolvedTrigger.name + "' in group " + groupName + "...");
			var allEmpty = true;
			var allNonEmpty = true;
			for (var i3 = 0; i3 < triggerNames.length; i3++) {
				var f = this.getField(triggerNames[i3]);
				if (!f) {
					consoleDump("\nError group trigger field with name '" + triggerNames[i3] + "' not found!");
					return false;
				}
				if (type === "OR" && !isEmpty(triggerNames[i3])) {
					allEmpty = false;
					break;
				} else if (type === "AND" && isEmpty(triggerNames[i3])) {
					allNonEmpty = false;
					break;
				}
			}
			if (type === "OR") {
				affectChildren(showFieldNames, !allEmpty);
				affectChildren(hideFieldNames, allEmpty);
			} else if (type === "AND") {
				affectChildren(showFieldNames, allNonEmpty);
				affectChildren(hideFieldNames, !allNonEmpty);
			}
			for (var i4 = 0; i4 < showFieldNames.length; i4++) {
				//consoleDump("\nCalling recursively for " + showFieldNames[i4]);
				GroupManager.handleOrGroupMemeberChange(showFieldNames[i4]);
				recursiveResolveChildren(showFieldNames[i4]);
			}
			for (var i5 = 0; i5 < hideFieldNames.length; i5++) {
				//consoleDump("\nCalling recursively for " + hideFieldNames[i5]);
				recursiveResolveChildren(hideFieldNames[i5]);
			}
		}
	}

	this.calculate = true;
}

function resolveChildren(triggerName) {
	recursiveResolveChildren(triggerName);
	this.calculateNow();
}

function inArray(needle, haystack) {
	for (var i = 0; i < haystack.length; i++) {
		if (haystack[i] == needle)
			return true;
	}
	return false;
}

function clearRadios() {
	var clearedFieldNames = [];
	for (var x = 0; x < this.numFields; x++) {
		var f = this.getField(this.getNthFieldName(x));
		if (f.type === "radiobutton" && !inArray(f.name, fieldsExcludedFromInitialization)) {
			if (f.value !== "undefined") {
				f.value = undefined;
				resolveChildren(f.name);
				clearedFieldNames.push(f.name);
			}
		}
	}
	console.println("\nCleared fields:\n\n" + clearedFieldNames.join("\n") + "\n\n");
}

/**
 * Parses date object form DD.MM.YYYY format with spaces and day/month leading zeroes allowed
 */
function parseDateFromCzechFormat(dateString, allowPastDate, allowFutureDate) {

	allowPastDate = typeof allowPastDate === 'undefined' ? true : allowPastDate;
	allowFutureDate = typeof allowFutureDate === 'undefined' ? true : allowFutureDate;

	// Remove whitespace
	dateString = dateString.replace(/\s/g, '');

	// Check for the pattern DD.MM.YYYY
	if (!/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateString)) {
		return false;
	}

	// Parse the date parts to integers
	var parts = dateString.split(".");

	var day = parseInt(parts[0], 10);
	var month = parseInt(parts[1], 10);
	var year = parseInt(parts[2], 10);

	// Check the ranges of month and year
	if (year < 1000 || year > 3000 || month === 0 || month > 12) {
		return false;
	}

	var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	// Adjust for leap years
	if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
		monthLength[1] = 29;

	// Check the range of the day
	if (day === 0 || day > monthLength[month - 1]) {
		return false;
	}

	var parsedDate = new Date(year, month - 1, day);
	if (!parsedDate) {
		return false;
	}

	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	// Check if it is past date
	if (!allowPastDate) {
		if (today.getTime() > parsedDate.getTime()) {
			return false;
		}
	}

	// Check if it is future date
	if (!allowFutureDate) {
		if (today.getTime() < parsedDate.getTime()) {
			return false;
		}
	}

	return parsedDate;
}

function formAlert(message, nIc, nType) {
	if (typeof nIc === "undefined") {
		nIc = 0;
	}
	nType = typeof nType === "undefined" ? 0 : nType;
	return app.alert({
		cMsg: message,
		cTitle: "Kontrola formuláře",
		nIcon: nIc,
		nType: nType
	});
}

function getDaysBetween(startDate, endDate) {
	var startDateObj = parseDateFromCzechFormat(startDate);
	var endDateObj = parseDateFromCzechFormat(endDate);
	if (!startDateObj || !endDateObj) {
		consoleDump("Error: start date od end date string is invalid!");
		return false;
	}
	const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	return Math.round(Math.abs((startDateObj - endDateObj) / oneDay)) + 1;
}