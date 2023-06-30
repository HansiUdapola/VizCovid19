function createCaseContinentBarPlot() {

	// set the dimensions and margins of the graph
	const margin = { top: 10, right: 30, bottom: 20, left: 80 },
		width = 460 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	const svg = d3.select("#my_dataviz")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	var maxCasesHeight = 0;
	var caseHeight = 0;
	var deathHeight = 0;
	var maxDeathsHeight = 0;

	var dataClone = [];

	var domainCountryList = ["Asia", "Africa", "North America", "South America", "Europe", "Oceania",];
	var columnNames = ["total_cases_per_million", "total_deaths_per_million"];


	d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.csv", function (error, data) {
		if (error) throw error;

		for (var i = 0; i < data.length; i++) {

			if (domainCountryList.includes(data[i].location)) {

				caseHeight = Number(data[i].total_cases_per_million);
				deathHeight = Number(data[i].total_deaths_per_million);

				dataClone.push(data[i]);

				if (maxCasesHeight < caseHeight)
					maxCasesHeight = caseHeight;

				if (maxDeathsHeight < deathHeight)
					maxDeathsHeight = deathHeight;
			}

		}

		// List of subgroups = header of the csv files = soil condition here
		const subgroups = columnNames;
		//console.log(dataClone);

		// List of groups = species here = value of the first column called group -> I show them on the X axis
		const groups = dataClone.map(d => d.location)

		// Add X axis
		const x = d3.scaleBand()
			.domain(groups)
			.range([0, width])
			.padding([0.3])
		svg.append("g")
			.attr("class", "axisWhite")
			.attr("transform", `translate(0, ${height})`)
			.call(d3.axisBottom(x).tickSizeOuter(0));

		// Add Y axis
		const y = d3.scaleLinear()
			.domain([0, maxCasesHeight + maxDeathsHeight + maxCasesHeight * 0.1])
			.range([height, 0]);
		svg.append("g")
			.attr("class", "axisWhite")
			.call(d3.axisLeft(y));

		// color palette = one color per subgroup
		const color = d3.scaleOrdinal()
			.domain(subgroups)
			.range(["#FFC300", "#C70039"])

		//stack the data? --> stack per subgroup
		const stackedData = d3.stack()
			.keys(subgroups)
			(dataClone)

		// ----------------
		// Create a tooltip
		// ----------------
		const tooltip = d3.select("#my_dataviz")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "1px")
			.style("border-radius", "5px")
			.style("padding", "10px")

		// Three function that change the tooltip when user hover / move / leave a cell
		const mouseover = function (event, d) {
			tooltip
				.html("<span style='color:#C70039;'> Total Deaths (PMP): <b>" + dataClone[d].total_deaths_per_million + "</b></span><br><span style='color:#FFC300;'>" + "Total Cases (PMP): <b>" + dataClone[d].total_cases_per_million + "</b></span>")

				.style("opacity", 1)
		}
		const mousemove = function (event, d) {
			tooltip.style("transform", "translateY(-55%)")
				.style("left", (d3.mouse(this)[0] + 100) + "px") 
				.style("top", (d3.mouse(this)[1] + 300) + "px")
		}
		const mouseleave = function (event, d) {
			tooltip
				.style("opacity", 0)
		}

		// Show the bars
		svg.append("g")
			.selectAll("g")
			// Enter in the stack data = loop key per key = group per group
			.data(stackedData)
			.enter().append("g")
			.attr("fill", function (d) { return color(d.key); })
			.selectAll("rect")
			// enter a second time = loop subgroup per subgroup to add all rectangles
			.data(function (d) { return d; })
			.enter().append("rect")
			.attr("x", function (d) { return x(d.data.location); })
			.attr("y", function (d) { return y(d[1]); })
			.attr("height", function (d) { return y(d[0]) - y(d[1]); })
			.attr("width", x.bandwidth())
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)


	});

}