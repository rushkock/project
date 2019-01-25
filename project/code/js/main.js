window.onload = function()
{
  var requests = [d3.json("../../data/json/world_countries.json"),
                  d3.tsv("../../data/world_population.tsv"),
                  d3.json("../../data/json/suicide_pooled.json"),
                  d3.json("../../data/json/suicide.json"),
                  d3.json('https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json')];

  Promise.all(requests).then(function(response) {
     makeMap(response);
     allData = processDate(response[2], 2005);
     data = processDate(response[3], 2005);
     filterSunburst(allData, data, "10");
     makeBar(response);
  }).catch(function(e){
      throw(e);
  });
};

// this function returns the data for the chosen year
function processDate(data, year){
  var date = [];
  var yearF = parseFloat(year);
  for (var i in data){
    if (data[i].year === yearF){
      date.push(data[i]);
    }
  }
  return date;
}

// this functions gets the states that the mouse is hovering over
function getSelectedCountry(d, pooledData, country, property, property2){
   var selectedState = "";
   if (country === "country"){
     f = d[property][property2]
  }
  else{
    f = d[property]
  }
   pooledData.forEach(function(e) {
     if (e[country] == f){ selectedState = e;}
   });
   return selectedState;
}


// this functions makes the legends and writes the text
// source : https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
function makeLegend(select, color, min, max, ticks, start, stop)
{
  console.log(start)
  console.log(stop)
  var width = 400;
  var height = 200;
  var startColor = start;
  var stopColor = stop;
  var defs = d3.select(select)
               .append("defs");

 var svg = defs.append("svg")
               .attr("width", width)
               .attr("height", height)
               .append('g')
               .attr('class', 'legend');


  var linearGradient = svg.append("linearGradient")
                           .attr("id", "linear-gradient");

      // chosen horizontal gradient
      linearGradient.attr("x1", "0%")
                    .attr("y1", "0%")
                    .attr("x2", "100%")
                    .attr("y2", "0%");

      // set the color for the start
      linearGradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", start);

      // set the color for the end
      linearGradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", stop);

    // draw the rectangle and fill with gradient
    svg.append("rect")
       .attr("width", 300)
       .attr("x", 30)
       .attr("y", 15)
       .attr("height", 20)
       .style("fill", "url(#linear-gradient)");

    //Set scale for x-axis
    var xScale = d3.scaleLinear()
    	             .range([0, 300])
    	             .domain([Math.round(min), Math.round(max)]);

    // make xAxis
    var xAxis = d3.axisBottom(xScale)
                  .ticks(ticks);

    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate("+ 30 + "," + 35 + ")")
       .call(xAxis);
}
