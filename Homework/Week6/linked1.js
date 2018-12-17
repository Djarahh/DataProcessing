window.onload = function() {

  console.log('Yes, you can!')
};

// data source = https://opendata.cbs.nl/statline/portal.html?_la=nl&_catalog=CBS&tableId=37422ned&_theme=70
d3.json("births.json").then(function(data) {
  keys = Object.keys(data["value"]);

// Put the data in an array you can work with
dataArray = []
for (i = 0; i < Object.keys(data["value"]).length; i++){
  dataArray.push(data["value"][keys[i]])
}


d3.select("#t").text("Map of the world obesity");
d3.select("#h").append("p").text("Name: Yara Djaidoen, studen number: 11123117");
d3.select("#h").append("p").text("This is an interactive map that that will show the prevalence of obesity in adults over the world")

// Draw the two different graphs
drawStacked = drawStackedBar(dataArray)
drawPie = drawPieChart(dataArray)
})

function drawStackedBar(data){
  // Define SVG canvas
  var margin = {top: 20, right: 160, bottom: 35, left: 30},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      barPadding = 1,
      colors = d3.schemeCategory10;



  // Create an SVG canvas
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // // Define a tooltip area in the webpage
  // tooltip = d3.select("body")
  //                 .append("div")
  //                 .attr("class", "tooltip")
  //                 .style("opacity", 0);

  // Append a title to the scatterplot
  svg.append("text")
      .attr("class", "title")
      .attr("x", width/2)
      .attr("y", margin.top/2)
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Children born in the Netherlands");

  // Create scales for the axes and datapoints
  yScale = d3.scaleLinear()
             .domain([0, d3.max(data, function(d){
               return d.TotaalLevendGeborenKinderen_4;
             })])
             .rangeRound([height - margin.bottom, margin.top])
  xScale = d3.scaleBand()
             .domain([2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016])
             .range([margin.left * 2, width])

    // Define the coordiantion of x and y ax
    var yAxis = d3.axisLeft(yScale)
    var xAxis = d3.axisBottom(xScale)

    // Creates the yAxis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0" + margin.left * 2 + ")")
      .call(yAxis)

    // Add text-label to y ax
    svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Children Born in the Netherlands");

    // Creates the xAxis
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + (height - margin.bottom) + ")")
       .call(xAxis)

    // Add text to x-axis
    svg.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", height)
        .style("text-anchor", "end")
        .text("Years");

    // // Transpose the data into layers
    // var stack = d3.stack()(["EnkelvoudigeGeboorten_34", "TotaalTweelinggeboorten_36",
    //                         "DrieOfMeervoudigeGeboorten_40"].map(function(kids) {
    //         return dataArray.map(function(d) {
    //     return {x: d.Perioden, y: +d[kids]};
    //   });
    // }))

    // dataClean = cleanData(data)
z = d3.scaleSequential(d3.interpolateBlues)
      .domain([-0.5 * dataArray.length, 1.5 * dataArray.length])

  svg.selectAll("rect")
      .data(dataArray)
      .enter()
      .append("rect")
      // .attr("fill", (d, i) => z(i));
   // .selectAll("rect")
     // .data(d => d)
     // .enter()
     // .append("rect")
     .attr("x", (d, i) => xScale(i))
     .attr("y", height - margin.bottom)
     .attr("width", (width / keys.length - barPadding))
     .attr("height", 40);


}

function drawPieChart(data) {
  var margin = {top:50,bottom:50,left:50,right:50};
		var width = 500 - margin.left - margin.right,
		height = width,
		radius = Math.min(width, height) / 2;
		var donutWidth = 75;
		var legendRectSize = 18;
		var legendSpacing = 4;
    c = d3.schemeCategory10

    var color = d3.scaleOrdinal()
  		            .range(c);

      var svg = d3.select("pie")
    		.append("svg")
    		.attr("width", width)
    		.attr("height", height)
    		.append("g")
    		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

        var arc = d3.arc()
    		.outerRadius(radius - 10)
    		.innerRadius(radius - donutWidth);

    		var pie = d3.layout.pie()
    		.sort(null)
    		.value(function(d) { return d.value; });
}
