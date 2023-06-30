
function LoadscatterPlot1() {

  d3.select("#barviz1").selectAll("*").remove();

  var countryName = document.getElementById("countrysl").value;

  //set dynamic title
  document.getElementById("countrDcases").innerHTML = countryName + " Daily Cases";
  document.getElementById("countrDdeaths").innerHTML = countryName + " Daily Deaths";
  document.getElementById("countrCumCVD").innerHTML = countryName + " Cumulative Cases, Vaccines, and Deaths";

  var maxvalue = 0;

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 500 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#barviz1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv("data/bar-alldata.csv",

    // When reading the csv, I must format variables:
    function (d) {
      if (d.Country != countryName)
        return;
      else if (d.New_cases < 0)
        return;
      else {
        console.log(maxvalue + "-" + d.New_cases);
        if (Number(maxvalue) < Number(d.New_cases)) {
          maxvalue = d.New_cases;
          console.log("Max changed, " + maxvalue + "-" + d.New_cases);
        }

        console.log(maxvalue + "-" + d.New_cases);

        return { date: d3.timeParse("%Y-%m-%d")(d.Date_reported), value: d.New_cases }
      }
    },

    // Now I can use this dataset:
    function (data) {

      // Add X axis --> it is a date format
      var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axisWhite")
        .call(d3.axisBottom(x));


      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, maxvalue])
        .range([height, 0]);
      svg.append("g")
        .attr("class", "axisWhite")
        .call(d3.axisLeft(y));

      // Add the line
      /*svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
        .attr("d", d3.line()
          .curve(d3.curveBasis) // Just add that to have a curve instead of segments
          .x(function(d) { return x(d.date) })
          .y(function(d) { return y(d.value) })
          )*/

      // create a tooltip
      var Tooltip = d3.select("#barviz1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")

      const formatTime = d3.timeFormat("%d-%b-%Y");

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function (d) {
        Tooltip
          .style("opacity", 1)
      }
      var mousemove = function (d) {
        Tooltip
          .html("<b>" + d.value + " cases <br> Reported on  " + formatTime(d.date))
          .style("left", (d3.mouse(this)[0] + 100) + "px")
          .style("top", (d3.mouse(this)[1] + 850) + "px")
      }
      var mouseleave = function (d) {
        Tooltip
          .style("opacity", 0)
      }

      // Add the points
      svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function (d) { return x(d.date) })
        .attr("cy", function (d) { return y(d.value) })
        .attr("r", 1.5)
        .attr("stroke", "rgb(33, 113, 181)")
        .attr("stroke-width", 1)
        .attr("fill", "rgb(33, 113, 181)")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    });

  LoadscatterPlot2();

}

function LoadscatterPlot2() {

  d3.select("#barviz2").selectAll("*").remove();

  var countryName = document.getElementById("countrysl").value;

  var maxvalue = 0;

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 500 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#barviz2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv("data/bar-alldata.csv",

    // When reading the csv, I must format variables:
    function (d) {
      if (d.Country != countryName)
        return;
      else if (d.New_deaths < 0)
        return;
      else {
        console.log(maxvalue + "-" + d.New_deaths);
        if (Number(maxvalue) < Number(d.New_deaths)) {
          maxvalue = d.New_deaths;
          console.log("Max changed, " + maxvalue + "-" + d.New_deaths);
        }

        console.log(maxvalue + "-" + d.New_deaths);

        return { date: d3.timeParse("%Y-%m-%d")(d.Date_reported), value: d.New_deaths }
      }
    },

    // Now I can use this dataset:
    function (data) {

      // Add X axis --> it is a date format
      var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axisWhite")
        .call(d3.axisBottom(x));


      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, maxvalue])
        .range([height, 0]);
      svg.append("g")
        .attr("class", "axisWhite")
        .call(d3.axisLeft(y));

      // Add the line
      /*svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
        .attr("d", d3.line()
          .curve(d3.curveBasis) // Just add that to have a curve instead of segments
          .x(function(d) { return x(d.date) })
          .y(function(d) { return y(d.value) })
          )*/

      // create a tooltip
      var Tooltip = d3.select("#barviz2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")

      const formatTime = d3.timeFormat("%d-%b-%Y");

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function (d) {
        Tooltip
          .style("opacity", 1)
      }
      var mousemove = function (d) {
        Tooltip
          .html("<b>" + d.value + " cases <br> Reported on  " + formatTime(d.date))
          .style("left", (d3.mouse(this)[0] + 720) + "px")
          .style("top", (d3.mouse(this)[1] + 870) + "px")
      }
      var mouseleave = function (d) {
        Tooltip
          .style("opacity", 0)
      }

      // Add the points
      svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function (d) { return x(d.date) })
        .attr("cy", function (d) { return y(d.value) })
        .attr("r", 1.5)
        .attr("stroke", "rgb(203, 24, 29)")
        .attr("stroke-width", 1)
        .attr("fill", "rgb(203, 24, 29)")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    });

}

function LoadAreagraph(){
  
}