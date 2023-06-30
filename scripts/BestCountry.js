function createBestCountryTable() {

	d3.select(".table").append("h4").text("Well Managed Country List").style("color", "white");

	d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.csv", function (error, data) {
		if (error) throw error;
		
		d3.select("#date").text(data[1].last_updated_date);
		
		var minDeathsPerMill = 100;
		var maxDeathsPerMill = 0;

		var minCasesPerMill = 100;
		var maxCasesPerMill	= 0;

		var deathMill, caseMill;

		for (var i = 0; i < data.length; i++) {

			caseMill = Number(data[i].total_cases_per_million);
			deathMill = Number(data[i].total_deaths_per_million);

			deathOverCases = deathMill/caseMill*100;

			if (data[i].total_deaths != 0 && data[i].continent != 0) {
				
				//Population Based
				if(minDeathsPerMill>deathMill)
				minDeathsPerMill = deathMill;

				if(maxDeathsPerMill<deathMill)
				maxDeathsPerMill = deathMill;

				if(minCasesPerMill>caseMill)
				minCasesPerMill = caseMill;

				if(maxCasesPerMill<caseMill)
				maxCasesPerMill = caseMill;

			}

		}

		for (var j = 0; j < data.length; j++) {
			
			caseMill = Number(data[j].total_cases_per_million);
			deathMill = Number(data[j].total_deaths_per_million);

			deathOverCases = deathMill/caseMill*100;

			if (data[j].total_deaths != 0 && data[j].continent != 0) {
			

				if(deathMill==maxDeathsPerMill){
					d3.select("#highest-deaths-country").text(data[j].location+", "+data[j].continent);
				}
				
				if(deathMill==minDeathsPerMill){
					d3.select("#lowest-deaths-country").text(data[j].location+", "+data[j].continent);
				}

				if(caseMill==minCasesPerMill){
					d3.select("#lowest-cases-country").text(data[j].location+", "+data[j].continent);
				}

				if(caseMill==maxCasesPerMill){
					d3.select("#highest-cases-country").text(data[j].location+", "+data[j].continent);
				}

			}
		}

	});

	createCaseContinentBarPlot();
	createDailyContinentBarPlot();
	createBubblePlot();

}