document.getElementById("divdeath").addEventListener("click", changeToDeaths);
document.getElementById("divcase").addEventListener("click", changeToCases);
document.getElementById("divvaccnine").addEventListener("click", changeToVaccines);


function LoadCountryList() {

	//Table Create

	createTable();

	changeToCases();

	LoadLatestUpdates();

	var csvobj;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			csvobj = CSVstring_to_Array(this.responseText);
			LoadCombo(csvobj);
		}
	};
	xmlhttp.open("GET", "data/countrylist.csv", true);
	xmlhttp.send();
}

function CSVstring_to_Array(data, delimiter = ',') {

	const titles = data.slice(0, data
		.indexOf('\n')).split(delimiter);

	const titleValues = data.slice(data
		.indexOf('\n') + 1).split('\n');

	const ansArray = titleValues.map(function (v) {
		const values = v.split(delimiter);
		const storeKeyValue = titles.reduce(
			function (obj, title, index) {
				obj[title] = values[index];
				return obj;
			}, {});
		return storeKeyValue;
	});
	return ansArray;
};

function LoadCombo(csvobj) {
	var x;
	for (x in csvobj) {
		const dataentry = document.createElement('option');
		const countryname = document.createTextNode(csvobj[x].country_name);

		dataentry.appendChild(countryname);
		dataentry.setAttribute('value', csvobj[x].country_name);
		document.getElementById("countrysl").appendChild(dataentry);
	}

	LoadscatterPlot1();
}

function LoadLatestUpdates() {
	d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.csv", function (error, data) {
		if (error) throw error;
		
		for (var i = 0; i < data.length; i++) {
			if (data[i].iso_code == "OWID_WRL"){
				d3.select("#lastupdate").text(data[i].last_updated_date);
				d3.select("#worldcases").text(FormatNumers(data[i].total_cases));
				d3.select("#worlddeaths").text(FormatNumers(data[i].total_deaths));
				d3.select("#worldvaccines").text(FormatNumers(data[i].total_vaccinations));	
				break;
			}
		}
	});
}

//to display with 1000 comma seperation
function FormatNumers(x) {
	x = parseInt(x);
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}