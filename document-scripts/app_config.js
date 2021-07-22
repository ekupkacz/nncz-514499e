/**
 * Copyright ©2021 Lukáš Kupka <development@ekupka.cz>
 */

/**
 * Documents specific constants for calculations
 */
var documentConst = {};

var DefaultFormConfig = {
	debugMode: false,
	fieldNamesExcludedFromInitialization: [],
	textFieldFillColor: ["RGB", 1, 1, 1],
	textFieldTextFont: "Arial",
	textFieldTextSize: 10,
	textFieldDoNotScroll: true,
	maskFieldFillColor: ["RGB", 1, 1, 1],
	tooltipFieldFillColor: ["RGB", 0.666656494140625, 0.666656494140625, 0.666656494140625],
	tooltipFieldTextColor: ["RGB", 1, 1, 1],
	tooltipFieldtextFont: "Arial",
	tooltipFieldtextSize: 7,
	/** groupName may be anything and orGoups are lists of fieldnames, from which any non-empty value triggers "affectChildren" */
	orGroups: {
		groupName: [],
	}
};

/**
 * Initial values in format:
 * {
 *   someTextFieldName: 'someValue', // for text fields
 *   someComboboxName: ['someValue1', 'someValue2'], // for comboboxes
 *   someCheckBoxName: true // meant to be always checked
 * }
 **/
var initialValues = {};

/** List of tooltip field names */
var tooltipFields = [];

/** List of field names used for masking (white backgound) */
var maskFields = [];


// set current date to fields
//this.getField("someFieldName").value = parse8CharStringFromDateObject(new Date());

// overall debug flag
var debuggingOutput = true;

var groupTriggers = {
	someGroupName: {
		triggerNames: [ /* fields in group */
			"fieldToCheck1",
			"fieldToCheck2",
			"fieldToCheck3",
			"fieldToCheck4",
		],
		type: "OR", /* OR = at least one of fields in group is nonempty, AND = all fields in group are nonempty*/
		showFieldNames: [ /* these field will be shown up */
			"fieldToShow1",
			"fieldToShow2",
			"fieldToShow3",
		],
		hideFieldNames: [ /* and these fields will be hid */
			"fieldToHide1",
			"fieldToHide2",
		]
	},
};

var triggers = {
	spolecnost_rezident: [
		{
			triggeringValue: 'y',
			fieldNames: [
				"spolecnost_zeme",
				"spolecnost_cislo",
			]
		}
	],
	oddila_akcie: [
		{
			triggeringValue: 'y',
			fieldNames: [
				"oddila_nazev",
				"oddila_ico",
			]
		}
	],
	oddilb_prohlaseni: [
		{
			triggeringValue: "b1",
			fieldNames:[
				"oddilb_exponovana_osoba",
			]
		},
		{
			triggeringValue: "b2",
			fieldNames:[
				"oddilb_prohlaseni_odlisne_jmeno1",
				"oddilb_prohlaseni_odlisne_datum1",
				"oddilb_prohlaseni_odlisne_obcanstvi1",
				"oddilb_prohlaseni_odlisne_adresa1",
				"oddilb_prohlaseni_odlisne_zeme1",
				"oddilb_prohlaseni_odlisne_majitel1",
				"oddilb_prohlaseni_odlisne_jmeno2",
				"oddilb_prohlaseni_odlisne_datum2",
				"oddilb_prohlaseni_odlisne_obcanstvi2",
				"oddilb_prohlaseni_odlisne_adresa2",
				"oddilb_prohlaseni_odlisne_zeme2",
				"oddilb_prohlaseni_odlisne_majitel2",
				"oddilb_prohlaseni_odlisne_jmeno3",
				"oddilb_prohlaseni_odlisne_datum3",
				"oddilb_prohlaseni_odlisne_obcanstvi3",
				"oddilb_prohlaseni_odlisne_adresa3",
				"oddilb_prohlaseni_odlisne_zeme3",
				"oddilb_prohlaseni_odlisne_majitel3",
				"oddilb_prohlaseni_odlisne_jmeno4",
				"oddilb_prohlaseni_odlisne_datum4",
				"oddilb_prohlaseni_odlisne_obcanstvi4",
				"oddilb_prohlaseni_odlisne_adresa4",
				"oddilb_prohlaseni_odlisne_zeme4",
				"oddilb_prohlaseni_odlisne_majitel4",
			]
		},
		{
			triggeringValue: "b3",
			fieldNames:[
				"oddilb_prohlaseni_neni_majitel",
			]
		},
	],
	oddilb_exponovana_osoba: [
		{
			triggeringValue: "y",
			fieldNames:[
				"oddilb_jmeno1",
				"oddilb_datum1",
				"oddilb_obcanstvi1",
				"oddilb_adresa1",
				"oddilb_zeme1",
				"oddilb_jmeno2",
				"oddilb_datum2",
				"oddilb_obcanstvi2",
				"oddilb_adresa2",
				"oddilb_zeme2",
				"oddilb_jmeno3",
				"oddilb_datum3",
				"oddilb_obcanstvi3",
				"oddilb_adresa3",
				"oddilb_zeme3",
				"oddilb_jmeno4",
				"oddilb_datum4",
				"oddilb_obcanstvi4",
				"oddilb_adresa4",
				"oddilb_zeme4",
				"oddilb_jmeno5",
				"oddilb_datum5",
				"oddilb_obcanstvi5",
				"oddilb_adresa5",
				"oddilb_zeme5",
			]
		}
	],
};

