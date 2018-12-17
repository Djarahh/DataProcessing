// Student: Yara Djaidoen
// Student Number: 11123117

window.onload = function() {

  console.log('Yes, you can!')
};

// https://ourworldindata.org/obesity
var requests = [d3.json("worlddata.json"), d3.json("output.json")];

Promise.all(requests).then(function(response) {
  d3.select("#t").text("Map of the world obesity");
  d3.select("#h").append("p").text("Name: Yara Djaidoen, studen number: 11123117");
  d3.select("#h").append("p").text("This is an interactive map that that will show the prevalence of obesity in adults over the world. If you click on a country you will see the percentage of obesity in adults over the past 40 years in the graph below.")

  var workData1 = workDataset(response[1], 2015) //Here the year can be ajusted
  var drawWorld = drawWorldMap(response[0], workData1, response[1]);
  var workData2 = workDataset2(response[1], "AFG")
  var otherGraph = drawLineGraph(workData2)
})

function workDataset(obesity, year){
  var data = []
  for (var i = 0; i < Object.keys(obesity).length; i++){
    if (year == obesity[i].Year){
      data.push(obesity[i])
}}
  return data
}

function workDataset2(obesity, country){
var data = []
for (var i = 0; i < Object.keys(obesity).length; i++){
  if (country == obesity[i].Code){
    data.push(obesity[i])
  }}
  return data
}

function drawWorldMap(dataWorld, obesity, rawObesity){

// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>";
            })

// Define margins and a canvas
var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

// Create list with all values and define and scale colors
obesityValues = d3.set(obesity.map(function(d)
                {return d.Obesity_Among_Adults})).values();
c = d3.scaleLinear().domain([Math.min(...obesityValues), Math.max(...obesityValues)]).range([255, 0])


// Create a SVG canvas
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

var projection = d3.geoMercator()
                   .scale(130)
                  .translate( [width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);
createLegend(c, svg, height)

// Draws the countries with colours according to their obesity
svg.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(dataWorld.features)
    .enter().append("path")
    .attr("d", path)
    .style("fill", function(d, i) {
        for (var i = 0; i < obesity.length; i++){
          if (d.id == obesity[i].Code){
            return "rgb(0, 0, " + c(obesity[i].Obesity_Among_Adults) + ")"
          }
        }
        return "rgb(220, 220, 220)"
    })
    .style('stroke', 'white')
    .style('stroke-width', 1.5)
    .style("opacity",0.8)
    // tooltips
      .style("stroke","white")
      .style('stroke-width', 0.3)
      .on('mouseover',function(d){
         tip.show(d);

        d3.select(this)
          .style("opacity", 1)
          .style("stroke","white")
          .style("stroke-width",0.5);
        })
      .on('mouseout', function(d){
        tip.hide(d);
      //
        d3.select(this)
          .style("opacity", 0.8)
          .style("stroke","white")
          .style("stroke-width",0.3);
      })
      .on("click", function(d){
        updateGraph(rawObesity, d.id)
      });

svg.call(tip)
}

function createLegend(c, svg, height){
  var colorDomain = [0, 10, 20, 30, 40, 50]
  var legendLabels = ["< 10%", "10% +", "20% +", "30% +", "40% +", "> 40%"]


  var legend = svg.selectAll("g.legend")
                  .data(colorDomain)
                  .enter().append("g")
                  .attr("class", "legend");

  var ls_w = 20, ls_h = 20;

  legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d) { return "rgb(0, 0, " + c(d) + ")"; })
        .style("opacity", 0.8);

  legend.append("text")
        .attr("x", 50)
        .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
        .text(function(d, i){ return legendLabels[i]; });
}

function drawLineGraph(dataset){
// Define margins for the SVG canvas
  margins = {top: 30, bottom: 30, left: 50, right:30}
  widthSVG = 900 - margins.left - margins.right;
  heightSVG = 500 - margins.top - margins.bottom;

  //Create SVG canvas
  svg1 = d3.select("body")
          .append("svg")
          .attr("class", "svg1")
          .attr("width", widthSVG + margins.left - margins.right)
          .attr("height", heightSVG +  margins.top + margins.bottom)

  // Append a title to the scatterplot
  svg1.append("text")
      .attr("class", "title")
      .attr("x", widthSVG/2)
      .attr("y", margins.top/2)
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("This graph shows the percentage of obese people in a country over time");


  // set the ranges
  var x = d3.scaleLinear("%Y").range([margins.left, widthSVG]);
  var y = d3.scaleLinear().range([heightSVG, margins.bottom]);

  // define the line
  var valueline = d3.line()
                    .x(function(d) { return x(d.Year); })
                    .y(function(d) { return y(d.Obesity_Among_Adults); });

  // Scale the range of the data
  x.domain(d3.extent(dataset, function(d) { return d.Year; }));
  y.domain([0, d3.max(dataset, function(d) {
	  return Math.max(d.Obesity_Among_Adults); })]);


  // Add the valueline path.
  svg1.append("path")
      .data([dataset])
      .attr("class", "line")
      .attr("d", valueline)
      .attr("stroke", "blue")
      .attr("fill", "None")
      .attr("transform", "translate(0," + (-margins.bottom) + ")")


  // A tooltip for the graph showing the value of a point on the line
  var bisectDate = d3.bisector(function(d) { return d.Year; }).left
  svg1.append("rect")
      .attr("transform", "translate(" + -margins.left + "," + -margins.bottom + ")")
      .attr("class", "overlay")
      .attr("width", widthSVG)
      .attr("height", heightSVG)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

  var focus = svg1.append("g")
                  .attr("class", "focus")
                  .style("display", "none");

      focus.append("circle")
           .attr("y", -margins.left)
           .attr("x", widthSVG)
           .attr("r", 2)

      focus.append("text")
           .attr("x", 15)
        	 .attr("dy", ".31em");

  function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(dataset, x0, 1),
          i = i - 3
          d0 = dataset[i - 1],
          d1 = dataset[i],
          d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.Year) + "," + (y(d.Obesity_Among_Adults)-margins.bottom) + ")");
      focus.select("text").text(function() { return (d.Obesity_Among_Adults + "%" )})
    }

  // Creates the yAxis
  svg1.append("g")
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margins.left) + "," + - margins.left + ")")
    .call(d3.axisLeft(y))

  // Add text-label to y ax
  svg1.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Obesity in selected country (%)");

  // Creates the xAxis
  svg1.append("g")
     .attr("class", "xAxis")
     .attr("transform", "translate(0, " + (heightSVG - margins.left) + ")")
     .call(d3.axisBottom(x).tickFormat(d3.format('.4')))

  // Add text to x-axis
  svg1.append("text")
      .attr("class", "label")
      .attr("x", widthSVG)
      .attr("y", heightSVG)
      .style("text-anchor", "end")
      .text("Years");

}

function updateGraph(rawObesity, country){

  data = workDataset2(rawObesity, country)

  // Define margins for the SVG canvas
    margins = {top: 30, bottom: 30, left: 50, right:30}
    widthSVG = 900 - margins.left - margins.right;
    heightSVG = 500 - margins.top - margins.bottom;

  // set the ranges
  var x = d3.scaleTime("%Y").range([margins.left, widthSVG]);
  var y = d3.scaleLinear().range([heightSVG, margins.bottom]);


  // define the line
  var valueline = d3.line()
                    .x(function(d) { return x(d.Year); })
                    .y(function(d) { return y(d.Obesity_Among_Adults); });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) {
    return Math.max(d.Obesity_Among_Adults); })]);

  // Updates the valueline path.
  svg1.selectAll(".line")
      .data([data])
      .transition()
      .duration(750)
      .attr("d", valueline)
      .attr("stroke", "red")
      .attr("fill", "None")

  // Updates the yAxis
  svg1.selectAll(".yAxis")
    .transition()
    .call(d3.axisLeft(y))

  // Append a title to the scatterplot
  svg1.selectAll(".title")
      .text("The percentage of obese people in " + data[0].Entity + " from 1975 to 2016")
      .transition()
      .duration(20)
      .attr("x", widthSVG/2)
      .attr("y", margins.top/2)
      .style("text-anchor", "middle")
      .style("font-weight", "bold")

  // A tooltip for the graph after it is updated
  var bisectDate = d3.bisector(function(d) { return d.Year; }).left

  svg1.append("rect")
            .attr("transform", "translate(" + -margins.left + "," + -margins.bottom + ")")
            .attr("class", "overlay")
            .attr("width", widthSVG)
            .attr("height", heightSVG)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

  var focus = svg1.append("g")
                  .attr("class", "focus")
                  .style("display", "none");

      focus.append("circle")
           .attr("y", -margins.left)
           .attr("x", widthSVG)
           .attr("r", 2)

      focus.append("text")
           .attr("x", 15)
        	 .attr("dy", ".31em");


  function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          i = i - 3
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.Year) + "," + (y(d.Obesity_Among_Adults)-margins.bottom) + ")");
      focus.select("text").text(function() { return (d.Obesity_Among_Adults + "% in " + d.Year)})

    }

}
