
function changeToCases() {

  d3.select("svg").selectAll("*").remove();
  document.getElementById("title").innerHTML = "Cumulative Cases per 100,000 Population";

  // The svg
  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");


  // Map and projection
  var path = d3.geoPath();
  var projection = d3.geoMercator()
    .scale(125)
    .center([35, 35])
    .translate([width / 2, height / 2]);

  // Data and color scale
  var data = d3.map();
  var colorScale = d3.scaleThreshold()
    .domain([10, 100, 1000, 5000, 10000])
    .range(d3.schemeBlues[6]);


  // Legend
  var g = svg.append("g")
    .attr("class", "legendThreshold");

  g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "10px")
    .text("Subscribers");

  var labels = ['0-10', '10-100', '100-1000', '1000-5000', '5000-10000' ,'> 10000'];

  var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(0)
    .orient('vertical')
    .shapeWidth(10)
    .shapeHeight(40)
    .scale(colorScale);

  svg.select(".legendThreshold")
    .style("fill","white")
    .style("font-size", "10px")
    .call(legend);


  // Load external data and boot
  d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "data/map-cases.csv", function (d) { data.set(d.code, d.cases); })
    .await(ready);


  // create a tooltip
  var Tooltip = d3.select("#container")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 1)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")


  function ready(error, topo) {

    let mouseOver = function (d) {
      Tooltip.style("opacity", 1);
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
    }

    let mousemove = function (d) {
      Tooltip
      .html("<b>" + d.properties.name + " (" + d.id + "</b>) <br><hr><i> Cumulative Cases per 100,000 Populations: </i> <br/>" + d.total + "")
      .style("left", (d3.mouse(this)[0] + 10) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
    }


    let mouseLeave = function (d) {
      Tooltip.style("opacity", 0);
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", 1)
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "black")
    }



    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter().append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })

      .style("stroke", "black")
      .attr("class", function (d) { return "Country" })
      .style("opacity", .8)
      .on("mouseover", mouseOver)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseLeave)

  }

}