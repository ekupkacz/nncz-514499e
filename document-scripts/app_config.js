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
	rb_ins_type: [
		{
			triggeringValue: 'a',
			fieldNames: [
				"nadstandard_storno",
				"Rizikove_sporty 2",
				"Covid20",
				"context",
				"platnost_od_1_af_date",
				"platnost_do_1_af_date",
				"pocet_dni",
				"Poisteny_2",
				"Poistne_vratane_dane_2",
				"Poisteny_3",
				"Poistne_vratane_dane_3",
				"Poisteny_4",
				"Poistne_vratane_dane_4",
				"Poisteny_5",
				"Poistne_vratane_dane_5",
				"Poisteny_6",
				"Poistne_vratane_dane_6",
				"jednorazove_poistne_vratane_dane 2",
				"z_toho_dan_z_poistenia 2",
				"jednorazove_poistne_bez_dane 2",
			]
		},
		{
			triggeringValue: 'b',
			fieldNames: [
				"platnost_od_2_af_date",
				"platnost_do_2_af_date",
				"pocet_dni2",
				"poistna_suma2",
				"jednorazove_poistne_vratane_dane_B 2",
				"z_toho_dan_z_poistenia_B 2",
				"jednorazove_poistne_bez_dane_B 2",
			]
		}
	],
	nadstandard_storno: [
		{
			triggeringValue: undefined,
			fieldNames: [
				"poistna_suma1",
				"Poistne_vratane_dane",
			]
		},
	],
};

