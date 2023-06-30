
//Loading cases for selected country
function LoadscatterPlot1() {

  d3.select("#barviz1").selectAll("*").remove();

  var countryName = document.getElementById("countrysl").value;

  //set dynamic title
  document.getElementById("countrDcases").innerHTML = countryName + " Daily Cases";
  document.getElementById("countrDdeaths").innerHTML = countryName + " Daily Deaths";

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
  d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv",

    // When reading the csv, format v'bles:
    function (d) {
      if (d.location != countryName) //--
        return;
      else if (d.new_cases < 0)
        return;
      else {
        //console.log(maxvalue + "-" + d.new_cases);
        if (Number(maxvalue) < Number(d.new_cases)) {
          maxvalue = d.new_cases;
          //console.log("Max changed, " + maxvalue + "-" + d.new_cases);
        }

        //console.log(maxvalue + "-" + d.new_cases);

        return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.new_cases }
      }
    },

    function (data) {

      // Add X axis --> it is a date format
      var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);
      var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axisWhite")
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, maxvalue])
        .range([height, 0]);
      var yAxis = svg.append("g")
        .attr("class", "axisWhite")
        .call(d3.axisLeft(y));

      // To set the clipPath to limit the drawing area width x height area.
      var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      // Create the scatter variable: where both the circles and the brush take place
      var scatter = svg.append('g')
        .attr("clip-path", "url(#clip)")

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

      //add resizeable scattors
      scatter
        .append("g")
        .selectAll("circle")
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
        .on("mouseleave", mouseleave);

      // Set the zoom and Pan features
      var zoom = d3.zoom()
        .scaleExtent([0.5, 15])  // zoom in and zoom out levels 0.8 , 15 times
        .extent([[0, 0], [width, height]])
        .on("zoom", updateChart);

      // This add an invisible rect on top of the chart area
      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);


      // update the chart to rescale x,y axis and dots
      function updateChart() {

        // update the new scale
        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);

        // update axes with new boundaries
        xAxis.call(d3.axisBottom(newX))
        yAxis.call(d3.axisLeft(newY))

        // update circle position
        scatter
          .selectAll("circle")
          .attr('cx', function (d) { return newX(d.date) })
          .attr('cy', function (d) { return newY(d.value) });
      }
    });

  LoadscatterPlot2();
}

//Loading deaths for selected country
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
  d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv",

    // When reading the csv, format v'bles:
    function (d) {
      if (d.location != countryName)
        return;
      else if (d.new_deaths < 0)
        return;
      else {
        //console.log(maxvalue + "-" + d.new_deaths);
        if (Number(maxvalue) < Number(d.new_deaths)) {
          maxvalue = d.new_deaths;
          //console.log("Max changed, " + maxvalue + "-" + d.new_deaths);
        }

        //console.log(maxvalue + "-" + d.new_deaths);

        return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.new_deaths }
      }
    },

    function (data) {

      // Add X axis --> it is a date format
      var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);
      var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axisWhite")
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, maxvalue])
        .range([height, 0]);
      var yAxis = svg.append("g")
        .attr("class", "axisWhite")
        .call(d3.axisLeft(y));

      // To set the clipPath to limit the drawing area width x height area.
      var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      // Create the scatter variable: where both the circles and the brush take place
      var scatter = svg.append('g')
        .attr("clip-path", "url(#clip)")

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

      //add resizeable scattors
      scatter
        .append("g")
        .selectAll("circle")
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
        .on("mouseleave", mouseleave);

      // Set the zoom and Pan features
      var zoom = d3.zoom()
        .scaleExtent([0.5, 15])  // zoom in and zoom out levels 0.8 , 15 times
        .extent([[0, 0], [width, height]])
        .on("zoom", updateChart);

      // This add an invisible rect on top of the chart area
      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);


      // update the chart to rescale x,y axis and dots
      function updateChart() {

        // update the new scale
        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);

        // update axes with new boundaries
        xAxis.call(d3.axisBottom(newX))
        yAxis.call(d3.axisLeft(newY))

        // update circle position
        scatter
          .selectAll("circle")
          .attr('cx', function (d) { return newX(d.date) })
          .attr('cy', function (d) { return newY(d.value) });
      }
    });

}