// Ruchella kock
// 12460796
// description: this script makes a map of the US and a bar chart with tooltips
// Realized with help from:
// https://bl.ocks.org/mbostock/4090848
// http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f

window.onload = function()
{
  var requests = [d3.json("../../data/json/us_states.json"),
                  d3.json("../../data/json/suicides_us.json"),
                  d3.json("../../data/json/depression.json"),
                  d3.json('https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json')];

  Promise.all(requests).then(function(response) {

     var states = preprocessing(response, 1);
     range = ["#f1eef6", "#d0d1e6", "#74a9cf", "#2b8cbe", "#045a8d"]
     makeUSMap(".USmap", ".boxMap", ".subBoxMap", range, response, states, "#f1eef6", "#045a8d");

     states = preprocessing(response, 2);
     range = ["#ffeda0", "#fed976", "#fd8d3c", "#fc4e2a", "#7f0000"]
     makeUSMap(".USmap2", ".boxMap2", ".subBoxMap2", range, response, states, "#ffeda0", "#7f0000");

  }).catch(function(e){
      throw(e);
  });
};

function makeUSMap(select, legendPos, subBox, range, response, states, start, stop){
  // this functions makes a svg, draws a map of united states and has a tooltip
  // with data information

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 960 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

  var svg = d3.select(select)
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

  var max = d3.max(states, function(d) { return d.percentage;});
  var min = d3.min(states, function(d) { return d.percentage;});
  var five = (max-min)/5;

  //http://colorbrewer2.org/#type=sequential&scheme=PuBu&n=5
  var color = d3.scaleLinear()
                .domain([min, min+five, min+five*2, min+five*3, max])
                .range(range);

    svg.append("g")
       .attr("class", "states")
       .selectAll("path")
       .data(topojson.feature(response[0], response[0].objects.states).features)
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
           usTooltip.transition()
                  .duration(10)
                  .style("opacity", 1)
                  .style("stroke","black")
                  .style("stroke-width", 5);

            selectedState = getSelectedCountry(d, states, "FIPS", "id", "")
            if (subBox ===  ".subBoxMap"){
              subBoxMap(selectedState, "");
            }
            else{
              subBoxMap(selectedState, "2");
            }

            d3.select(subBox).selectAll("*").style("visibility", "visible");
            usTooltip.html("<div id='thumbnail'><span> State: "
                         + selectedState.state + "<br> Percentage: "
                         + selectedState.percentage + "%")
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY) + "px");
        })
       .on("mouseout", function(d) {
         d3.select(subBox).selectAll("*").style("visibility", "hidden");
           usTooltip.transition()
                  .duration(500)
                  .style("stroke","white")
                  .style("opacity", 0);
          });

    svg.append("path")
    .attr("class", "state-borders")
    .attr("d", usPath(topojson.mesh(response[0], response[0].objects.states,
        function(a, b) { return a !== b; })));

      makeLegend(legendPos, color, min, max, 6, start, stop);


}

// this function writes the text in the subBox (small box with borders on the right of the page)
function subBoxMap(data, value){
    if (data != ""){
    d3.select(".subBoxMapCountry" + value).select("h1")
        .text(data.state);
    d3.select(".subBoxMapSuicidesPercentage" + value)
        .text(data.percentage + " %");
    d3.select(".subBoxMapUpper" + value)
        .text(data.lower_CI + "%");
   d3.select(".subBoxMapLower" + value)
      .text(data.upper_CI + "%");
   }
}

///////////////////////////////////////////////////////////////////////////////
/////////////////        Functions that process data    //////////////////////
//////////////////////////////////////////////////////////////////////////////


// this function processes the whole data set (states)
function preprocessing(response, number){
  var states = [];
  for (var i in response[number]){
    if (response[number][i].state === response[number][i].substate){
      states.push(response[number][i]); }
  }
  console.log(states)
  return states;
}
