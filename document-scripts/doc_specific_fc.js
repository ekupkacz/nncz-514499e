/**
 * Copyright ©2021 Lukáš Kupka <development@ekupka.cz>
 */

function vypocetPoistnehoZaPoisteneho(index) {
	var supportedIndices = ["2", "3", "4", "5", "6"];
	if (!inArray(index, supportedIndices)) {
		consoleDump("Error: Unsupported field index!");
		return;
	}
	var poistneField = this.getField("Poistne_vratane_dane_" + index);
	poistneField.value = '';
	var pocetDni = this.getField("pocet_dni").value * 1;
	if (pocetDni < 1) {
		return;
	}
	if (isEmpty("context")) {
		return;
	}

	var context = this.getField("context").valueAsString;
	var f = this.getField("Poisteny_" + index);
	var selIndex = f.currentValueIndices;
	var poistneZaStornoNadRamec = parseFloat(this.getField("Poistne_vratane_dane").value);
	console.println(poistneZaStornoNadRamec);
	var finalFieldValue = '';
	if (typeof selIndex == "number") {
		var personType = f.getItemAt(selIndex, true);
		if (!personType) {
			return;
		}
		var covid19 = this.getField("Covid20").isBoxChecked(0);
		var rate = documentConst.manDayRate[context][personType];
		rate += covid19 ? documentConst.covidEur : 0;
		var koef = 1;
		var rizikoveSporty = this.getField("Rizikove_sporty 2").isBoxChecked(0);
		koef += rizikoveSporty ? documentConst.riskCoef : 0;
		finalFieldValue = rate * koef * pocetDni;
		if (index === 2 && poistneZaStornoNadRamec > 0) {
			finalFieldValue += poistneZaStornoNadRamec;
		}
		poistneField.value = finalFieldValue.toFixed(2);
	} else { // Multiple selections
		consoleDump("Error: Multiple selection is not supported!");
	}
}

function sucetJednorazovehoPojistneho() {
	var sumFields = [
		"Poistne_vratane_dane_2",
		"Poistne_vratane_dane_3",
		"Poistne_vratane_dane_4",
		"Poistne_vratane_dane_5",
		"Poistne_vratane_dane_6",
	];
	var poistneCelkem = 0;
	var dan = 0;
	sumFields.forEach(function (name) {
		poistneCelkem += this.getField(name).value * 1;
	})
	var poistneField = this.getField("jednorazove_poistne_vratane_dane 2");
	poistneField.value = poistneCelkem.toFixed(2);
	var danField = this.getField("z_toho_dan_z_poistenia 2");
	dan = (poistneCelkem / 100) * 8;
	danField.value = dan.toFixed(2);
	var poistneBezDaneField = this.getField("jednorazove_poistne_bez_dane 2");
	poistneBezDaneField.value = (poistneCelkem - dan).toFixed(2);
}

function vypocetPoistnehoZaStornoNadRamec(cenaZajazdu) {
	if (cenaZajazdu > 10800) {
		formAlert("Maximální cena zájazdu je 10 800 €!");
		return false;
	} else if (cenaZajazdu > 7200) {
		return cenaZajazdu / 100 * 3;
	} else if (cenaZajazdu > 0) {
		return cenaZajazdu / 100 * 2.75;
	} else {
		return false;
	}
}

function sucetJednorazovehoPojistneho2() {
	var dan = 0;
	var poistneCelkem = this.getField("jednorazove_poistne_vratane_dane_B 2").value * 1;
	var danField = this.getField("z_toho_dan_z_poistenia_B 2");
	dan = (poistneCelkem / 100) * 8;
	danField.value = dan.toFixed(2);
	var poistneBezDaneField = this.getField("jednorazove_poistne_bez_dane_B 2");
	poistneBezDaneField.value = (poistneCelkem - dan).toFixed(2);
}

function validatePocatekPojisteni(datumPodpis, datumPocatek) {

	const validPeriodMonths = 3; // Počet měsíců, po kolik je po datu podpisu datum platnosti pojištení validní

	if (datumPodpis != '' && datumPocatek != '') {
		var podpisDate = parseDateFromCzechFormat(datumPodpis);
		if (!podpisDate) {
			consoleDump("Error: Invalid date string for parameter datumPodpis!");
			return false;
		}

		var pocatekDate = parseDateFromCzechFormat(datumPocatek);
		if (!pocatekDate) {
			consoleDump("Error: Invalid date string for parameter datumPocatek!");
			return false;
		}

		var maxDate = new Date(podpisDate.getTime());
		maxDate.setMonth(podpisDate.getMonth() + validPeriodMonths);

		if (DefaultFormConfig.debugMode) {
			consoleDump("podpisDate: " + podpisDate.toString());
			consoleDump("pocatekDate: " + pocatekDate.toString());
			consoleDump("maxDate: " + maxDate.toString());
		}

		if (pocatekDate.getTime() > maxDate.getTime()) {
			formAlert("Dátum začiatku poistenia musí byť maximálne " + validPeriodMonths + " mesiace od dátumu podpisu!");
			return false;
		}
	}
	return true;
}