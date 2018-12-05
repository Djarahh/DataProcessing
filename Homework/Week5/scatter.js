// Student: Yara Djaidoen
// Student Number: 11123117

window.onload = function() {

  console.log('Yes, you can!')
};

var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

var requests = [d3.json(womenInScience), d3.json(consConf)];

Promise.all(requests).then(function(response) {
    // Insert all other text outside of the SVG canvas
    d3.select("#t").text("Percentage of women in science against consumer behaviour");
    d3.select("#h").append("p").text("Name: Yara Djaidoen, studen number: 11123117");
    d3.select("#h").append("p").text("This is a scatterplot that will show the percentage of women working in science to the consumer behaviour, hoover over the dots to see what year the dot represents. To get a better overview on how a country did, select a year from the dropdown menu")

    // Transforms all data to usable data
    dataset = transformResponse(response[0], response[1]);

    //Define size of SVG element and margins and colors
    margins = {top: 30, bottom: 30, left: 50, right:30}
    widthSVG = 900 - margins.left - margins.right;
    heightSVG = 500 - margins.top - margins.bottom;
    color = d3.schemeCategory10;

    // Define a tooltip area in the webpage
    tooltip = d3.select("body")
                    .append("div")
		                .attr("class", "tooltip")
		                .style("opacity", 0);

    //Create SVG canvas
    svg = d3.select("body")
            .append("svg")
            .attr("width", widthSVG)
            .attr("height", heightSVG)

    // Append a title to the scatterplot
    svg.append("text")
        .attr("class", "title")
        .attr("x", widthSVG/2)
        .attr("y", margins.top/2)
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Percentage of women working in science against consumer behaviour");

    // Create scales for the axes and datapoints
    yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset, function(d){
                 return d.datapoint.women;
               })])
               .rangeRound([heightSVG - margins.bottom, margins.top])
    xScale = d3.scaleLinear()
               .domain(d3.extent(dataset, d => d.datapoint.consumer)).nice()
               .range([margins.left, widthSVG - margins.right])

    // Drawing the axises and datapoints in the graph
    drawGraph(dataset)
    // Draws all point in different colors in the scatterplot
    getInfoDatapoint(dataset)
});

// Function that transoforms a dataset into usable dataset
function transformResponse(dataset1, dataset2){

       // access data property of the response
       let dataHere1 = dataset1.dataSets[0].series;
       let dataHere2 = dataset2.dataSets[0].series;

       // access variables in the response and save length for later
       let series1 = dataset1.structure.dimensions.series;
       let seriesLength1 = series1.length;

       let series2 = dataset2.structure.dimensions.series;
       let seriesLength2 = series2.length;

       // set up array of variables and array of lengths
       let varArray1 = [];
       let lenArray1 = [];

       let varArray2 = [];
       let lenArray2 = [];

       series1.forEach(function(serie){
           varArray1.push(serie);
           lenArray1.push(serie.values.length);
       });

       series2.forEach(function(serie){
           varArray2.push(serie);
           lenArray2.push(serie.values.length);
       });

       // get the time periods in the dataset
       let observation = dataset1.structure.dimensions.observation[0];

       // add time periods to the variables, but since it's not included in the
       // 0:0:0 format it's not included in the array of lengths
      varArray1.push(observation);
      varArray2.push(observation);

       // create array with all possible combinations of the 0:0:0 format
       let strings = Object.keys(dataHere1);

       // set up output array, an array of objects, each containing a single datapoint
       // and the descriptors for that datapoint
       let dataArray = [];

       // for each string that we created
       strings.forEach(function(string, stringindex){
           // for each observation and its index
           observation.values.forEach(function(obs, index){
             let data = dataHere1[string].observations[index];
             let data2 = dataHere2[stringindex+":0:0"].observations[index];
               if (data != undefined){

                   // set up temporary object
                   let tempObj = {};


                   tempString = string.split(":");
                   tempString.forEach(function(s, indexi){
                       tempObj[varArray1[indexi].name] = varArray1[indexi].values[s].name;
                   });

                   // every datapoint has a time and ofcourse a datapoint
                   tempObj["time"] = obs.name;
                   tempObj["datapoint"] = {women: data[0], consumer: data2[0]};
                   dataArray.push(tempObj);
               }
           });
       });

       // return the finished product!
       return dataArray;
   }

// Function to draw all the graph
function drawGraph(dataset){
  // Define the coordiantion of x and y ax
  var yAxis = d3.axisLeft(yScale)
  var xAxis = d3.axisBottom(xScale)

  // Creates the yAxis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0" + margins.left + ")")
    .call(yAxis)

  // Add text-label to y ax
  svg.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Women working in science (%)");

  // Creates the xAxis
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + (heightSVG - margins.bottom) + ")")
     .call(xAxis)

  // Add text to x-axis
  svg.append("text")
      .attr("class", "label")
      .attr("x", widthSVG)
      .attr("y", heightSVG)
      .style("text-anchor", "end")
      .text("Consumer Behaviour");

  createLegend(dataset, widthSVG)

  // Function that creates the legend
  function createLegend(dataset){
    legendValues = d3.set(dataset.map(function(d)
                    {return d.Country})).values()

    var legend = svg.selectAll(".legend")
              		  .data(legendValues)
              		  .enter().append("g")
              		  .attr("class", "legend")
              		  .attr("transform", function(d, i) { return "translate(10," + (i+7) * 20 + ")"; });

    	  // draw legend colored rectangles
    	  legend.append("rect")
        		  .attr("x", widthSVG - 18)
        		  .attr("width", 18)
        		  .attr("height", 18)
        		  .style("fill", function(d, i){return color[i]});

    	  // draw legend text
    	  legend.append("text")
        		  .attr("x", widthSVG - 24)
        		  .attr("y", 9)
        		  .attr("dy", ".35em")
        		  .style("text-anchor", "end")
        		  .text(function(d) { return d;})
  }
}

// Funcion that iterates over all datapoints in dataset
function getInfoDatapoint(dataset){
  for (i = 0; i < dataset.length; i++){
    datapoint = dataset[i]
    drawDatapoint(datapoint)
    }
  }

// Function that draws all datapoints
function drawDatapoint(data){
  c = d3.scaleOrdinal().domain(legendValues).range(color)
  svg.append("circle")
     .attr("class", "dot")
     .attr("cx", xScale(data.datapoint.consumer))
     .attr("cy", yScale(data.datapoint.women))
     .attr("r", 4)
     .style("fill", function(d){
       return c(data.Country)
     })
     .on('mouseover', d => {
      tooltip.transition()
         .duration(200)
         .style('opacity', 0.9);
      tooltip.html(data.time)
         .style('left', d3.event.pageX + 'px')
         .style('top', d3.event.pageY - 28 + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
      })
 }

// Function that resets the graph
function setGraph(){
   updateGraph((document.getElementById("value-year").value))
 }

// Function that updates the graph
function updateGraph(year){
  Promise.all(requests).then(function(response) {

   // Transforms all data to usable data
   dataset = transformResponse(response[0], response[1]);

   // Appends dataset to users input
   newdata = getNewData(dataset, year)

   // Removes the all dots in the graph
   d3.selectAll(".dot").remove()

   // Redraws all new datapoints in the scatterplot
   getInfoDatapoint(newdata)
 })
}

// Appends dataset to users input
function getNewData(dataset, year){
  if (year == "All years"){
    newdata = dataset
  }
  else{
     newdata = []
     for (i = 0; i < dataset.length; i++){
       if (dataset[i].time == year){
         newdata.push(dataset[i])
       }
     }
  }
  return newdata
}
