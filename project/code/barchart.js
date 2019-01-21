// Ruchella Kock
// 12460796

var barPadding = 5;
var margin = {top: 20, right: 0, bottom: 70, left: 130};
var w = 500 - margin.left - margin.right;
var h = 2500 - margin.top - margin.bottom;

function makeBar(response){

  var data = processDate(response[2], 2005);
  data =  data.sort(function(a,b){return b.suicides_per_10000-a.suicides_per_10000;});
  var length = data.length;

  var yScale = d3.scaleBand()
               .range([0, h])
               .padding(0.1)
               .domain(data.map(function(d) { return d.country; }));

  var xScale = d3.scaleLinear()
              .domain([0, d3.max(data, function(d) { return d.suicides_per_10000;})])
              .range([0, w]);

  var myTool = d3.select("body")
               .append("div")
               .attr("class", "mytooltip")
               .style("display", "none");
  var min = d3.min(data, function(d) { return d.suicides_per_10000;});
  var max = d3.max(data, function(d) { return d.suicides_per_10000;});
  var seven = (max-min)/7;

  var color = d3.scaleLinear()
             .domain([min, min+seven,min+seven*2,min+seven*3,min+seven*4,min+seven*5,min+seven*6, max])
             .range(["#d0d1e6", "#a6bddb" ,"#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"]);
  // make SVG
  var svg =   d3.select(".barChart")
               .append("svg")
               .attr("class", "chart")
               .attr("width", w + margin.left + margin.right)
               .attr("height", h + margin.top + margin.bottom);
  // write text on y axis
  var country = svg.append("text")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 15)
                   .attr("x", -300)
                   .style("font-size", "20px")
                   .text("Country");
  // write text on x axis
  var suicides = svg.append("text")
                    .attr("y", 20)
                    .attr("x", (w + margin.left + margin.right)/2 - 60)
                    .style("font-size", "20px")
                    .text("Number of suicides per 10000");
  // make xAxis
  var xAxis = d3.axisTop()
                .scale(xScale);
            svg.append("g")
               .attr("class", "xAxis")
               .attr("transform", "translate(120, 50)")
               .call(xAxis);
  var yAxis = d3.axisLeft()
                .scale(yScale);
            svg.append("g")
               .attr("class", "yAxis")
               .attr("transform", "translate(120, 50)")
               .call(yAxis);
  //  make a line down the average
            svg.append("line")
               .style("stroke", "black")
               .attr("x1", (w + margin.left + margin.right)/2 + 50)
               .attr("y1", 50)
               .attr("x2", (w + margin.left + margin.right)/2 + 50)
               .attr("y2", h + margin.bottom);
  // Make the bars
  var rect = svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect");

  //Color gradient of the bars
  var colorScale = d3.scaleLinear()
                     .range(['#FF0033','#FFFF33'])
                     .domain([0, d3.max(data, function(d) { return d.suicides_per_10000;})]);

 function makeY(d, i){return yScale(d.country) + 50;}
 function makeX(d, i){return 121;}
 function widthRect(d){return xScale(d.suicides_per_10000);}
 var heightRect = yScale.bandwidth();
 function makeColor(d){return color(d.suicides_per_10000);}

  rect.attr("y", makeY)
      .attr("x", makeX)
      .attr("width", widthRect)
      .attr("height", heightRect)
      .attr("fill", makeColor)
      .on("mouseover", function(d)
      {
      //bars
       d3.select(this)
         .transition()
         .duration(10)
         .attr("fill", function(d) { return "orange";});
      //text
        myTool.transition()
              .duration(10)
              .style("display", "block");

        myTool.html("<div id='thumbnail'><span>" + d.country + ": " + Math.round(d.suicides_per_10000) +  "</span></div>")
              .style("left",(d3.event.pageX) + 20 + "px")
              .style("top", (d3.event.pageY)  - 10 + "px");
      })
      .on("mouseout", function(d)
      {
         d3.select(this)
           .transition()
           .duration(10)
           .attr("fill", function(d){ return color(d.suicides_per_10000);});
         myTool.transition()
               .duration(10)
               .style("display", "none"); //The tooltip disappears
     });
}

// this function updates the data
function updateBar(data, color) {
  data =  data.sort(function(a,b){return b.suicides_per_10000-a.suicides_per_10000;});

  var xScale = d3.scaleLinear()
                 .domain([0, d3.max(data, function(d) { return d.suicides_per_10000;})])
                 .range([0, w]);

  var yScale = d3.scaleBand()
                .range([0, h])
                .padding(0.1)
                .domain(data.map(function(d) { return d.country; }));

  function makeY(d, i){return yScale(d.country) + 50;}
  function makeX(d, i){return 121;}
  function widthRect(d){return xScale(d.suicides_per_10000);}
  var heightRect = yScale.bandwidth();
  function makeColor(d){return color(d.suicides_per_10000);}



  var rect = d3.select(".barChart")
               .select(".chart")
               .selectAll("rect")
               .data(data);

      rect.enter()
          .append("rect")
          .merge(rect)
          .attr("x", makeX)
          .attr("y", makeY)
          .attr("width", widthRect)
          .attr("height", heightRect);

      rect.exit().remove();

  d3.select(".xAxis").remove();
  d3.select(".yAxis").remove();
  var svg = d3.select(".barChart").select("svg");
  var myTool = d3.select(".mytooltip");
  // make xAxis
  var xAxis = d3.axisTop()
                .scale(xScale);
            svg.append("g")
               .attr("class", "xAxis")
               .attr("transform", "translate(120, 50)")
               .call(xAxis);

  var yAxis = d3.axisLeft()
                .scale(yScale);
            svg.append("g")
               .attr("class", "yAxis")
               .attr("transform", "translate(120, 50)")
               .call(yAxis);
      rect.attr("fill", function(d){ return color(d.suicides_per_10000);});
      rect.on("mouseover", function(d)
          {
          //bars
           d3.select(this)
             .transition()
             .duration(10)
             .attr("fill", function(d) { return "orange";});
          //text
            myTool.transition()
                  .duration(10)
                  .style("display", "block");

            myTool.html("<div id='thumbnail'><span>" + d.country + ": " + Math.round(d.suicides_per_10000) +  "</span></div>")
                  .style("left",(d3.event.pageX) + 20 + "px")
                  .style("top", (d3.event.pageY)  - 10 + "px");
          })
          .on("mouseout", function(d)
          {
             d3.select(this)
               .transition()
               .duration(10)
               .attr("fill", function(d){ return color(d.suicides_per_10000);});
             myTool.transition()
                   .duration(10)
                   .style("display", "none"); //The tooltip disappears
         });
}

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
