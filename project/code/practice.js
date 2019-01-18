function practice (response){
  data = processDate(response[2], 2005)
  data =  data.sort(function(a,b){return b.suicides_per_10000-a.suicides_per_10000})

  var width = 500;
  var height = 2500;

  var barPadding = 5;
  var margin = {top: 20, right: 0, bottom: 70, left: 130};


  var svg = d3.select(".practice")
              .append("svg")
              .attr('width', width)
              .attr('height', height)
              .append("g")
              .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  var yScale = d3.scaleBand()
                 .range([0, height])
                 .padding(0.1);
  yScale.domain(data.map(function(d) { return d.country; }));

  var xScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return d.suicides_per_10000;})])
                .range([0, width]);

  var duration = 1000;

  var xaxis = d3.axisTop()
                .scale(xScale);

  var yaxis = d3.axisLeft(yScale);

  svg.append('g')
      .attr("transform", "translate(120, 50)")
      .attr('class', 'x axis');

  svg.append('g')
      .attr("transform", "translate(120, 50)")
      .attr('class', 'y axis');

      function update(data) {
              xScale.domain([0, d3.max(data, function(d) { return d.suicides_per_10000;})])

              yScale.domain(data.map(function(d) { return d.country; }));

              function makeY(d, i){ return i * (height / data.length) + 50;}
              function makeX(d, i){return 50;}
              function widthRect(d){return xScale(d.suicides_per_10000);}
              function heightRect(d){console.log(height / data.length - barPadding); return height / data.length - barPadding;}
              function makeColor(d){return color(d.suicides_per_10000);}

              var bars = d3.select(".practice")
                           .selectAll(".barp")
                           .data(data);

              bars.enter()
                  .append('rect')
                  .attr('class', 'barp')
                  .attr("fill", "red")
                  .attr('width', yScale.bandwidth())
                  .attr('height', 0)
                  .attr('y', height)
                  .merge(bars)
                  .transition()
                  .duration(duration)
                  .attr("width", function(d, i) {
                      return xScale(d.suicides_per_10000);
                  })
                  .attr("height", yScale.bandwidth())
                  .attr("y", makeY)
                  .attr("x", makeX);



              bars.exit()
                  .transition()
                  .duration(duration)
                  .attr('height', 0)
                  .attr('y', height)
                  .remove();


              svg.select('.x.axis')
                  .transition()
                  .duration(duration)
                  .call(xaxis);

              svg.select('.y.axis')
                  .transition()
                  .duration(duration)
                  .call(yaxis);
          }
    update(data);
}

// this function returns the data for the chosen year
function processDate(data, year){
  date = []
  yearF = parseFloat(year)
  for (i in data){
    if (data[i].year === yearF){
      date.push(data[i])
    }
  }
  return date
}
