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
    d3.select("body").append("h1").text("Percentage of women in science against consumer behaviour");
    d3.select("body").append("p").text("Name: Yara Djaidoen, studen number: 11123117");
    d3.select("body").append("p").text("This is a scatterplot that will show the percentage of women working in science to the consumer behaviour")
    d3.select("body").append("p").text("Source: https://opendata.cbs.nl/statline/portal.html?_la=nl&_catalog=CBS&tableId=37422ned&_theme=70")

    // Transform all data to nice datasets to work with
    dataset = transformResponse(response[0], response[1]);
    console.log(dataset)
    drawDatapoints(dataset)
.catch(function(e){
   throw(e);
  })

});

// Function that transoforms a dataset into something usable
function transformResponse(dataset1, dataset2, setnumber){

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

// Function to draw all datapoints
function drawDatapoints(dataset){
  //Define size of SVG element and margins
  var margins = {top: 30, bottom: 30, left: 30, right:30}
  var widthSVG = 900 - margins.left - margins.right;
  var heightSVG = 500 - margins.top - margins.bottom;

  //Create SVG canvas
  var svg = d3.select("body")
              .append("svg")
              .attr("width", widthSVG)
              .attr("height", heightSVG);

  // Create scales for the axis
  var yScale = d3.scaleLinear()
                 .domain([0, d3.max(dataset, function(d){
                   return d.datapoint.women;
                 })])
                 .rangeRound([heightSVG - margins.bottom, margins.top])
// VRAAG OVER HET INZOOMEN (OFTEWEL HET DOMEIN VERANDEREN)
  var xScale = d3.scaleLinear()
                 // .domain(d3.extent(dataset, d => d.datapoint.consumer)).nice()
                 .domain([0, d3.max(dataset, function(d){
                   return d.datapoint.consumer;
                 })])
                 .range([margins.left, widthSVG - margins.right])

  // Define x and y axes
  var yAxis = d3.axisLeft(yScale)
  var xAxis = d3.axisBottom(xScale)

  // Creates the yAxis and xAxis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0" + margins.left + ")")
    .call(yAxis)
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + (heightSVG - margins.bottom) + ")")
     .call(xAxis)

  // Draws Datapoints
  svg.append("g")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 1.5)
     .attr("fill", "none")
   .selectAll("circle")
   .data(dataset)
   .enter()
   .append("circle")
     .attr("cx", d => xScale(d.datapoint.consumer))
     .attr("cy", d => yScale(d.datapoint.women))
     .attr("r", 2);
}
