// Ruchella kock
// 12460796
// description: this script makes a map of the US and a bar chart with tooltips
// Realized with help from:
// https://bl.ocks.org/mbostock/4090848
// http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f
// note: sorry didnt have enough time to optimize my code

var bars;

///////////////////////////////////////////////////////////////////////////////
/////////////////        Functions for the map          //////////////////////
//////////////////////////////////////////////////////////////////////////////

function makeUSMap(response, states){
  // this functions makes a svg, draws a map of united states and has a tooltip
  // with data information
  // onclick update the barchart

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 960 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

  var svg = d3.select(".USmap")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append('g')


  var usTooltip = d3.select(".USmap")
                    .append("div")
                    .attr("class", "usTooltip")
                    .style("opacity", 0);

  var usPath = d3.geoPath();

  var countryById = {};

  //http://colorbrewer2.org/#type=sequential&scheme=PuBu&n=5
  var color = d3.scaleLinear()
                .domain([15, 17, 19, 21, 23])
                .range(["#f1eef6", "#d0d1e6", "#74a9cf", "#2b8cbe", "#045a8d"]);

    svg.append("g")
       .attr("class", "states")
       .selectAll("path")
       .data(topojson.feature(response[5], response[5].objects.states).features)
       .enter()
       .append("path")
       .attr("d", usPath)
       .attr("fill", function(d, i) {
            foundColor = "";
            states.forEach(function(t) { if (t.FIPS == d.id){
            foundColor = color(t.percentage);}
        })
        return foundColor;})
       .style('stroke', 'white')
       .style('stroke-width', 1.5)
       .style("opacity",0.8)
       //on mouseover show tooltip
       .on("mouseover", function(d) {
         console.log(d);
           usTooltip.transition()
                  .duration(10)
                  .style("opacity", 1)
                  .style("stroke","black")
                  .style("stroke-width", 5);

            selectedState = getSelectedState(d)
            usTooltip.html("<div id='thumbnail'><span> State: "
                         + selectedState.state + "<br> Percentage: "
                         + selectedState.percentage + "%")
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY) + "px");
        })
       .on("mouseout", function(d) {
           usTooltip.transition()
                  .duration(500)
                  .style("stroke","white")
                  .style("opacity", 0);
          });

  // svg.append("path")
  //     .attr("class", "state-borders")
  //     .attr("d", usPath(topojson.mesh(response[5], response[5].objects.states,
  //         function(a, b) { return a !== b; })));
  makeLegend(svg, color, width);

};

// this functions makes the legends and writes the text
// source : https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
function makeLegend(svg, color, width)
{
  var defs = svg.append("defs");

  var linearGradient = defs.append("linearGradient")
                           .attr("id", "linear-gradient");

      // chosen horizontal gradient
      linearGradient.attr("x1", "0%")
                    .attr("y1", "0%")
                    .attr("x2", "100%")
                    .attr("y2", "0%");

      // set the color for the start
      linearGradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", "#f1eef6");

      // set the color for the end
      linearGradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", "#045a8d");

    // draw the rectangle and fill with gradient
    svg.append("rect")
        .attr("width", 300)
        .attr("x", width/3)
        .attr("y", 10)
        .attr("height", 20)
        .style("fill", "url(#linear-gradient)");

    // append title
    svg.append("text")
    	 .attr("class", "legendTitle")
    	 .attr("x", width/3)
    	 .attr("y", 10)
    	 .text("Percentage of people with a mental disorder");

    //Set scale for x-axis
    var xScale = d3.scaleLinear()
    	             .range([0, 300])
    	             .domain([15, 23]);

    // make xAxis
    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate("+ width/3+ "," + 30 + ")")
       .call(xAxis);
}


///////////////////////////////////////////////////////////////////////////////
/////////////////        Functions that process data    //////////////////////
//////////////////////////////////////////////////////////////////////////////


// this function processes the whole data set (states)
function preprocessing(response){
  var states = [];
  for (var i in response[6]){
    if (response[6][i].state === response[6][i].substate){
      states.push(response[6][i]); }
  }
  return states;
};

// this functions gets the states that the mouse is hovering over
function getSelectedState(d){
   selectedState = "";
   states.forEach(function(e) {
     if (e.FIPS == d.id){ selectedState = e;}
   })
   return selectedState;
};
