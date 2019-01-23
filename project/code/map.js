// Ruchella kock
// 12460796
// description: this script makes a map of the world
// Realized with help from:
// http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f

function makeMap(response){
  var data = response[0];
  var population = response[1];
  var populationById = {};

  population.forEach(function(d) { populationById[d.id] = +d.population; });
  data.features.forEach(function(d) { d.population = populationById[d.id]; });

  var pooledData = processDate(response[2], 1998);
  var filterData =  processDate(response[3], 1998);
  var tooltip = d3.select(".worldMap")
                  .append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

  var format = d3.format(",");

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;
 var min = d3.min(pooledData, function(d) { return d.suicides_per_10000;});
 var max = d3.max(pooledData, function(d) { return d.suicides_per_10000;});
 var seven = (max-min)/7;

  var color = d3.scaleLinear()
                .domain([min, min+seven,min+seven*2,min+seven*3,min+seven*4,min+seven*5,min+seven*6, max])
                .range(["#d0d1e6", "#a6bddb" ,"#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"]);

  var path = d3.geoPath();
  var year = makeSlider(response, color, tooltip);
  onclick(response, pooledData, filterData, color, tooltip);
  var svg = d3.select(".worldMap")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append('g')
              .attr('class', 'map');

  var projection = d3.geoMercator()
                     .scale(130)
                     .translate( [width / 2, height / 1.5]);

  path = d3.geoPath()
           .projection(projection);


  svg.append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d){
        foundColor = "";
        pooledData.forEach(function(t){
          if (t.country === d.properties.name){
            foundColor = color(t.suicides_per_10000);}
        });
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

          var selectedState = getSelectedState(d, pooledData);
          subBoxMap(selectedState);
          if (selectedState === "") {
            d3.select(".noData")
              .style("visibility", "visible");

            tooltip.html("<div id='thumbnail'><span> No Data")
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY) + "px");
          }
          else {
            d3.select(".subBoxMap").selectAll("*").style("visibility", "visible");
            tooltip.html("<div id='thumbnail'><span> Country: "+
                         selectedState.country + "<br> Suicides per 10000: " +
                         Math.round(selectedState.suicides_per_10000))
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY) + "px");
            }

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
      })
      .on('mouseout', function(d){
          d3.select(".subBoxMap").selectAll("*").style("visibility", "hidden");
          d3.select(".noData").style("visibility", "hidden");
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

     makeLegend(svg, color, width, max);
}

// this function makes the slider for the years and it also returns which year is chosen
// source: https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
function makeSlider(data, color, tooltip){
  // slider Time
  var dataTime = d3.range(0, 30).map(function(d) {
    return new Date(1987 + d, 1, 1);
  });

  var sliderTime = d3.sliderBottom()
                     .min(d3.min(dataTime))
                     .max(d3.max(dataTime))
                     .step(1000 * 60 * 60 * 24 * 365)
                     .width(900)
                     .tickFormat(d3.timeFormat('%Y'))
                     .tickValues(dataTime)
                     .default(new Date(2002, 10, 3))
                     .on('onchange', function(val){
                       d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
                       var newData = processDate(data[2], d3.timeFormat('%Y')(sliderTime.value()));
                       var filteredData = processDate(data[3], d3.timeFormat('%Y')(sliderTime.value()));
                       var ageFiltered = filter(data, newData, filteredData, color, tooltip);
                       filterSunburst(newData, filteredData, sunburstValue)

                       update(data, newData, ageFiltered, color, tooltip);
                       updateBar(newData, color);
                       onclick(data, newData, filteredData, color, tooltip)
                      });

  var gTime = d3.select('div#slider-time')
                .append('svg')
                .attr('width', 1100)
                .attr('height', 100)
                .append('g')
                .attr('transform', 'translate(30,30)');

  gTime.call(sliderTime);
  var year = d3.timeFormat('%Y')(sliderTime.value());
  d3.select('p#value-time').text(year);
  return year;
}

// this functions makes the legends and writes the text
// source : https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
function makeLegend(gr, color, w, max)
{
  var width = 400;
  var height = 200;
  var defs = d3.select(".boxMap")
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
                    .attr("stop-color", "#f1eef6");

      // set the color for the end
      linearGradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", "#045a8d");

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
    	             .domain([0, max]);

    // make xAxis
    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate("+ 30 + "," + 35 + ")")
       .call(xAxis);
}

// this function writes the text in the subBox (small box with borders on the right of the page)
function subBoxMap(data){
    var box = d3.select(".subBoxMap");
    if (data != ""){
    d3.select(".subBoxMapCountry").select("h1")
        .text(data.country);
    d3.select(".subBoxMapSuicidesPer10000")
        .text(Math.round(data.suicides_per_10000));
    d3.select(".subBoxMapSuicidesPercentage")
        .text(data.percentage_suicides.toFixed(2) + " %");
    d3.select(".subBoxMapSuicides")
        .text(data.suicides_no);
   d3.select(".subBoxMapPopulation")
      .text(data.population);
   }
}



// this function updates the data of the map, changes the colors and the tooltip
function update(response, newData, filtered, color, tooltip){
  if (ageValue === "all"){
    var data = newData;
  }
  else if (ageValue != "all"){
    var data = filtered;
  }
  else if (genderValue === "all"){
    var data = newData;
  }
  else {
    var data = filtered;
  }

  var map = d3.select(".countries")
              .selectAll("path")
              .data(response[0].features)
              .style("fill", function(d)
            {
              var foundColor = "";
              data.forEach(function(t){
                if (t.country === d.properties.name){
                  foundColor = color(t.suicides_per_10000);}
              });
            return foundColor;
          })
          .on('mouseover',function(d){
              tooltip.transition()
                      .duration(10)
                      .style("opacity", 1)
                      .style("stroke","black")
                      .style("stroke-width", 5);

              var selectedState = getSelectedState(d, data);
              subBoxMap(selectedState);
              if (selectedState === "") {
                d3.select(".noData")
                  .style("visibility", "visible");

                tooltip.html("<div id='thumbnail'><span> No Data")
                       .style("left", (d3.event.pageX) + "px")
                       .style("top", (d3.event.pageY) + "px");
              }
              else {
                d3.select(".subBoxMap").selectAll("*").style("visibility", "visible");
                tooltip.html("<div id='thumbnail'><span> Country: " +
                             selectedState.country + "<br> Suicides per 10000: "+
                             Math.round(selectedState.suicides_per_10000))
                       .style("left", (d3.event.pageX) + "px")
                       .style("top", (d3.event.pageY) + "px");
                }

              d3.select(this)
                .style("opacity", 1)
                .style("stroke","white")
                .style("stroke-width",3);
          })
          .on('mouseout', function(d){
              // change the visibility of the text in the subbox and the text that is generated when there is no data
              d3.select(".subBoxMap").selectAll("*").style("visibility", "hidden");
              d3.select(".noData").style("visibility", "hidden");
              tooltip.transition()
                     .duration(500)
                     .style("stroke","white")
                     .style("opacity", 0);

              d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","white")
                .style("stroke-width",0.3);
          });
}


///////////////////////////////////////////////////////////////////////////////
/////////////////        Functions that process data    //////////////////////
//////////////////////////////////////////////////////////////////////////////

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
function getSelectedState(d, pooledData){
   var selectedState = "";
   pooledData.forEach(function(e) {
     if (e.country == d.properties.name){ selectedState = e;}
   });
   return selectedState;
}
var sunburstValue = "10";
var ageValue = "all";
var genderValue = "all";
var id = "";

// this function filters the data when user choses an age
function filter(response, allData, filteredData, color, tooltip){
    var formatData = [];
    if (genderValue != "all" || ageValue != "all" && id != "sunburstDropdown"){
      var data = filteredData;
      // get for each country the 2 entries (male and female) for that age
      var container = [];
      if (id === "age"){
          for (var i in data){
            if (data[i].age === ageValue){
              container.push(data[i]);
            }
          }
      }
      else {
        for (var i in data){
          if (data[i].sex === genderValue){
            container.push(data[i]);
          }
        }
      }
      // sum the values for male and female together
      var newContainer = d3.nest()
                      .key(function(d) { return d.country; })
                      .rollup(function(v) { return {
                        suicides_no: d3.sum(v, function(d) { return d.suicides_no; }),
                        suicides_per_10000: d3.sum(v, function(d) { return d.suicides_per_10000; }),
                        percentage_suicides: d3.sum(v, function(d) { return d.percentage_suicides; }),
                        population: d3.sum(v, function(d) { return d.population; })
                       }; })
                      .entries(container);

      // get the data in the right format
      for (var j in newContainer){
        var values = newContainer[j].value;
        values.country = newContainer[j].key;
        formatData.push(values);
      }
      update(response, allData, formatData, color, tooltip);
    }
    else if(id === "age"){
      update(response, allData, allData, color, tooltip);
    }
    console.log(formatData)
    return formatData;
}

function onclick(response, allData, filteredData, color, tooltip){
  d3.selectAll(".dropdown-item")
   .on("click", function()
   {
      id = this.getAttribute("id");
      if(id === "sunburstDropdown"){
        sunburstValue = this.getAttribute("value");
        var sunburstFilter = filterSunburst(allData, filteredData, sunburstValue)
        if (sunburstValue != "allCountries"){
          d3.select(".sunburstFilter").text("Top " + sunburstValue)
        }
        else{
          d3.select(".sunburstFilter").text("All countries")
        }
      }
      else if (id === "gender"){
        genderValue = this.getAttribute("value");
        d3.select(".filter").text(genderValue)
      }
      else {
        ageValue = this.getAttribute("value");
        d3.select(".filter").text(ageValue)
      }
      filter(response, allData, filteredData, color, tooltip)
   });
}
