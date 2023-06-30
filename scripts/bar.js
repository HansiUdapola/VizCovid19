
function LoadBarChart(){

d3.select("#barviz1").selectAll("*").remove();

var countryName = document.getElementById("countrysl").value;

var maxvalue = 0;

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
  function(d){
	  if(d.Country != countryName)
		  return;
	  else if(d.New_cases<0)
		  return;
	  else {
		  console.log(maxvalue + "-" + d.New_cases);
		  if(Number(maxvalue) < Number(d.New_cases)){
			  maxvalue = d.New_cases;
			  console.log("Max changed, "+ maxvalue + "-" + d.New_cases);
		  }
		  
		  console.log(maxvalue + "-" + d.New_cases);
		  
         return { date : d3.timeParse("%Y-%m-%d")(d.Date_reported), value : d.New_cases }
	  }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
	  .attr("class", "axisWhite")
      .call(d3.axisBottom(x));

	
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, maxvalue])
      .range([ height, 0 ]);
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
      .style("background-color", "red")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
      }
      var mousemove = function(d) {
        Tooltip
          .html("Exact value: " + d.value)
          .style("left", (d3.mouse(this)[0]+70) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
      }
      var mouseleave = function(d) {
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
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 3)
        .attr("stroke", "rgb(35, 139, 69)")
        .attr("stroke-width", 1)
        .attr("fill", "rgb(35, 139, 69)")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
});

}