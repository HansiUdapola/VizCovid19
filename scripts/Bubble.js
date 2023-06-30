function createBubblePlot() {

  //flag to toggle between show and hide continent bubbles
  var displayFlags = [false, false, false, false, false, false]; //asia - 0, africa - 1, Namerica - 2, SAmerica - 3, Eur - 4, Oce - 5

  // set the dimensions and margins of the graph
  const margin = { top: 100, right: 150, bottom: 60, left: 100 },
    width = 1200 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#bubble-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  var perCapita;
  var maxPerCapita = 0;
  var minPerCapita = 1000;

  var deaths;
  var maxDeaths = 0;
  var minDeaths = 100;

  var dataBundle = [];

  var domainCountryList = ["Asia", "Africa", "North America", "South America", "Europe", "Oceania",];
  var columnNames = ["new_cases", "new_deaths"];


  d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.csv", function (error, data) {
    if (error) throw error;

    for (var i = 0; i < data.length; i++) {

      if (data[i].gdp_per_capita != 0 && data[i].total_deaths_per_million != 0 && data[i].people_vaccinated_per_hundred != 0
        && data[i].gdp_per_capita != "" && data[i].total_deaths_per_million != "" && data[i].people_vaccinated_per_hundred != ""
        && data[i].location != "World" && data[i].location != "Asia" && data[i].location != "Africa" && data[i].location != "North America"
        && data[i].location != "South America" && data[i].location != "Europe" && data[i].location != "Oceania") {

        perCapita = Number(data[i].gdp_per_capita);
        deaths = Number(data[i].total_deaths_per_million);


        if (maxPerCapita < perCapita)
          maxPerCapita = perCapita;

        if (minPerCapita > perCapita)
          minPerCapita = perCapita;

        if (maxDeaths < deaths)
          maxDeaths = deaths;

        if (minDeaths > deaths)
          minDeaths = deaths;

        dataBundle.push(data[i]);
      }

    }
    console.log(dataBundle[0]);
    console.log("PCMAX" + maxPerCapita);
    console.log("PCMIN" + minPerCapita);
    console.log("DMAX" + maxDeaths);
    console.log("DMIN" + minDeaths);


    // Add X axis
    const x = d3.scaleLinear()
      .domain([minPerCapita, maxPerCapita])
      .range([0, width]);
    svg.append("g")
      .attr("class", "axisWhite")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(3));

    // Add X axis label:
    svg.append("text")
      .style('fill', 'darkOrange')
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 50)
      .text("GDP per Capita");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([minDeaths, maxDeaths])
      .range([height, 0]);
    svg.append("g")
      .attr("class", "axisWhite")
      .call(d3.axisLeft(y));

    // Add Y axis label:
    svg.append("text")
      .style('fill', 'darkOrange')
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20)
      .text("Total Deaths per Million")
      .attr("text-anchor", "start")

    // Add a scale for bubble size
    const z = d3.scaleSqrt()
      .domain([0, 100])
      .range([2, 20]);

    // Add a scale for bubble color
    const myColor = d3.scaleOrdinal()
      .domain(domainCountryList)
      .range(d3.schemeSet1);

    // ---------------------------//
    //      TOOLTIP               //
    // ---------------------------//

    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3.select("#bubble-plot")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip = function (event, d) {
      console.log(dataBundle[d].location);

      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html("Country: " + dataBundle[d].location + "</br>" + "Vaccinated per Hundred: " + dataBundle[d].people_vaccinated_per_hundred)

    }
    const moveTooltip = function (event, d) {
      // console.log(d);
      // tooltip
      //   .style("left", (event.x)/2 + "px")
      //   .style("top", (event.y)/2 + "px")
      tooltip.style("transform", "translateY(-55%)")
        .style("left", (d3.mouse(this)[0] + 100) + "px")
        .style("top", (d3.mouse(this)[1] + 850) + "px")
    }
    const hideTooltip = function (event, d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }
    // ----------------
    // End tooltip
    // ----------------

    // ---------------------------//
    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    const highlight = function (event, d) {
      console.log(domainCountryList[d]);

      if(domainCountryList[d] == "Asia"){
        if(displayFlags[0]){
          displayFlags[0] = false;
          d3.selectAll(".Asia").style("opacity", 1)
        }else{
          displayFlags[0] = true;
          d3.selectAll(".Asia").style("opacity", 0)
        }
      }

      if(domainCountryList[d] == "Africa"){
        if(displayFlags[1]){
          displayFlags[1] = false;
          d3.selectAll(".Africa").style("opacity", 1)
        }else{
          displayFlags[1] = true;
          d3.selectAll(".Africa").style("opacity", 0)
        }
      }

      if(domainCountryList[d] == "North America"){
        if(displayFlags[2]){
          displayFlags[2] = false;
          d3.selectAll(".North").style("opacity", 1)
        }else{
          displayFlags[2] = true;
          d3.selectAll(".North").style("opacity", 0)
        }
      }

      if(domainCountryList[d] == "South America"){
        if(displayFlags[3]){
          displayFlags[3] = false;
          d3.selectAll(".South").style("opacity", 1)
        }else{
          displayFlags[3] = true;
          d3.selectAll(".South").style("opacity", 0)
        }
      }

      if(domainCountryList[d] == "Europe"){
        if(displayFlags[4]){
          displayFlags[4] = false;
          d3.selectAll(".Europe").style("opacity", 1)
        }else{
          displayFlags[4] = true;
          d3.selectAll(".Europe").style("opacity", 0)
        }
      }

      if(domainCountryList[d] == "Oceania"){
        if(displayFlags[5]){
          displayFlags[5] = false;
          d3.selectAll(".Oceania").style("opacity", 1)
        }else{
          displayFlags[5] = true;
          d3.selectAll(".Oceania").style("opacity", 0)
        }
      }
    }

    // And when it is not hovered anymore
    // const noHighlight = function (event, d) {
    //   d3.selectAll(".bubbles").style("opacity", 1)
    // }

    // ---------------------------//
    //       CIRCLES              //
    // ---------------------------//

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(dataBundle)
      .enter().append('circle')
      .attr("class", function (d) {

        if (d.continent == "North America")
          return "bubbles North"

        if (d.continent == "South America")
          return "bubbles South"

        return "bubbles " + d.continent;

      })
      .attr("cx", d => x(d.gdp_per_capita))
      .attr("cy", d => y(d.total_deaths_per_million))
      .attr("r", d => z(Number(d.people_vaccinated_per_hundred)))
      .style("fill", d => myColor(d.continent))
      // -3- Trigger the functions for hover
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)



    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

    // Add legend: circles
    const valuesToShow = [0.1, 10, 100]
    const xCircle = 390
    const xLabel = 440

    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter().append('circle')
      .attr("cx", width)
      .attr("cy", d => height - 100 - z(d))
      .attr("r", d => z(d))
      .style("fill", "none")
      .attr("stroke", "white")

    // Add legend: segments
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter().append('line')
      .attr('x1', d => width + 25 + z(d))
      .attr('x2', width)
      .attr('y1', d => height - 102 - z(d))
      .attr('y2', d => height - 102 - z(d))
      .attr('stroke', 'white')
      .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter().append('text')
      .attr('x', d => width + 25 + z(d))
      .attr('y', d => height - 100 - z(d))
      .text(d => d)
      .style("font-size", 8)
      .attr('alignment-baseline', 'middle')
      .style('fill', 'white')

    // Legend title
    svg.append("text")
      .attr('x', width)
      .attr("y", height - 100 + 30)
      .text("Population (M)")
      .attr("text-anchor", "middle")
      .style('fill', 'white')

    // Add one dot in the legend for each name.
    const size = 20;
    const allgroups = domainCountryList;
    svg.selectAll("myrect")
      .data(allgroups)
      .enter().append('circle')
      .attr("cx", width)
      .attr("cy", (d, i) => 10 + i * (size + 5))
      .attr("r", 7)
      .style("fill", d => myColor(d))
      .on("click", highlight)
     //.on("mouseleave", noHighlight)

    // Add labels beside legend dots
    svg.selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
      .attr("x", width + size * .8)
      .attr("y", (d, i) => i * (size + 5) + (size / 2)) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", d => myColor(d))
      .text(d => d)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("click", highlight)
      //.on("mouseleave", noHighlight)

  });

}