// Ruchella kock
// 12460796
// description: this script makes a map of the world
// Realized with help from:
// http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f


window.onload = function()
{
  var requests = [d3.json("../data/json/world_countries.json"), d3.tsv("../data/world_population.tsv"), d3.json("../data/json/suicide_pooled.json")];

  Promise.all(requests).then(function(response) {
    console.log(response[0])
    console.log(response[2])
     make_map(response)

  }).catch(function(e){
      throw(e);
  });
}

function make_map(response){
  var tooltip = d3.select("body")
                  .append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

  var format = d3.format(",");

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

  var color = d3.scaleThreshold()
                .domain([0,10,100,200,500,1000,5000,10000,15000,20000])
                .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)",
                        "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

  var path = d3.geoPath();

  var svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append('g')
              .attr('class', 'map');

  var projection = d3.geoMercator()
                     .scale(130)
                     .translate( [width / 2, height / 1.5]);

  var path = d3.geoPath()
               .projection(projection);

  data = response[0]
  population = response[1]
  var populationById = {};

  population.forEach(function(d) { populationById[d.id] = +d.population; });
  data.features.forEach(function(d) { d.population = populationById[d.id] });
  year = makeSlider()
  pooledData = processDate(response[2], year)

  svg.append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d){
        foundColor = "";
        console.log(pooledData)
        pooledData.forEach(function(t){
          if (t.country === d.properties["name"]){
            foundColor = color(t.suicides_no);}
        })
        return foundColor;
      })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
      .style("stroke","white")
      .style('stroke-width', 0.3)
      .on('mouseover',function(d){
          tooltip.transition()
                  .duration(10)
                  .style("opacity", 1)
                  .style("stroke","black")
                  .style("stroke-width", 5);

          selectedState = getSelectedState(d, pooledData)
          console.log(selectedState)
          if (selectedState === "") {
            tooltip.html("<div id='thumbnail'><span> No Data")
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY) + "px");
          }
          else {
            tooltip.html("<div id='thumbnail'><span> Country: "
                         + selectedState.country + "<br> Suicides: "
                         + selectedState.suicides_no + "<br> Population Size: "
                         + selectedState.population)
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY) + "px");
            }

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
      })
      .on('mouseout', function(d){
          tooltip.transition()
                 .duration(500)
                 .style("stroke","white")
                 .style("opacity", 0);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
      });

  svg.append("path")
     .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
     .attr("class", "names")
     .attr("d", path);
}

// this function makes the slider for the years and it also returns which year is chosen
// source: https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
function makeSlider(){
  // slider Time
  var dataTime = d3.range(0, 30).map(function(d) {
    return new Date(1987 + d, 1, 1);
  });

  var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(900)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(2010, 10, 3))
    .on('onchange', val => {
      d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
    });

  var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 1100)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gTime.call(sliderTime);

  year = d3.timeFormat('%Y')(sliderTime.value())
  d3.select('p#value-time').text(year);
  return year
}


///////////////////////////////////////////////////////////////////////////////
/////////////////        Functions that process data    //////////////////////
//////////////////////////////////////////////////////////////////////////////

// this function returns the data for the chosen year
function processDate(data, year){
  date = []
  yearF = parseFloat(year)
  console.log(year)
  for (i in data){
    if (data[i].year === yearF){
      date.push(data[i])
    }
  }
  return date
}

// this functions gets the states that the mouse is hovering over
function getSelectedState(d, pooledData){
   selectedState = "";
   pooledData.forEach(function(e) {
     if (e.country == d.properties["name"]){ selectedState = e;}
   })
   return selectedState;
};
