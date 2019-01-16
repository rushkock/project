// Ruchella Kock
// 12460796
// source: https://bl.ocks.org/vasturiano/12da9071095fbd4df434e60d52d2d58d
// dropdown : top 50/ all data
// search bar

function makeSunburst(response){
  data = processDate(response[3], 1998)
  root = getHierarchical(data)
  // set the height and width of the svg and the radius of the sunburst
  const width = 700
        height = 600,
        maxRadius = (Math.min(width, height) / 2) - 5;

  // format to one decimal
  const formatNumber = d3.format(',d');

  // scaling function for x
  // clamp means that the returned value will always be inside of the range
  const x = d3.scaleLinear()
              .range([0, 2 * Math.PI])
              .clamp(true);

  // scaling function for y
  const y = d3.scaleSqrt()
              .range([maxRadius*.1, maxRadius]);

  // color schemeCategory20 basic colors scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Creates a new partition layout with the default settings.
  // https://github.com/d3/d3-hierarchy/blob/master/README.md#partition
  const partition = d3.partition();

  const arc = d3.arc()
                .startAngle(d => x(d.x0))
                .endAngle(d => x(d.x1))
                .innerRadius(d => Math.max(0, y(d.y0)))
                .outerRadius(d => Math.max(0, y(d.y1)));

  const middleArcLine = d => {
      const halfPi = Math.PI/2;
      const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
      const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

      const middleAngle = (angles[1] + angles[0]) / 2;
      const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
      if (invertDirection) { angles.reverse(); }

      const path = d3.path();
      path.arc(0, 0, r, angles[0], angles[1], invertDirection);
      return path.toString();
  };

  const textFits = d => {
      const CHAR_SPACE = 6;

      const deltaAngle = x(d.x1) - x(d.x0);
      const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
      const perimeter = r * deltaAngle;

      return d.data.name.length * CHAR_SPACE < perimeter;
  };

  const svg = d3.select('.sunburst')
                .append('svg')
                .style('width', '100vw')
                .style('height', '100vh')
                .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
                .on('click', () => focusOn()); // Reset zoom on canvas click

  // d3.json('https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json', (error, root) => {
  //     if (error) throw error;
      root = d3.hierarchy(root);
      root.sum(d => d.size);

      const slice = svg.selectAll('g.slice')
                       .data(partition(root).descendants());
      // ??????
      slice.exit()
           .remove();

      const newSlice = slice.enter()
                            .append('g')
                            .attr('class', 'slice')
                            .on('click', d => {
                                d3.event.stopPropagation();
                                focusOn(d);
                            });
      // sort of like a tooltip
      newSlice.append('title')
              .text(d => d.data.name + '\n' + formatNumber(d.value));

      newSlice.append('path')
              .attr('class', 'main-arc')
              .style('fill', d => color((d.children ? d : d.parent).data.name))
              .attr('d', arc);

      newSlice.append('path')
              .attr('class', 'hidden-arc')
              .attr('id', (_, i) => `hiddenArc${i}`)
              .attr('d', middleArcLine);

      const text = newSlice.append('text')
                           .attr('display', d => textFits(d) ? null : 'none');

      // Add white contour
      text.append('textPath')
          .attr('startOffset','50%')
          .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
          .text(d => d.data.name)
          .style('fill', 'none')
          .style('stroke', '#fff')
          .style('stroke-width', 5)
          .style('stroke-linejoin', 'round');

      text.append('textPath')
          .attr('startOffset','50%')
          .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
          .text(d => d.data.name);
  // });
  // This function makes the graph zoomable
  function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
      // Reset to top-level if no data point specified

      const transition = svg.transition()
                            .duration(750)
                            .tween('scale', () => {
                                const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                                    yd = d3.interpolate(y.domain(), [d.y0, 1]);
                                return t => { x.domain(xd(t)); y.domain(yd(t)); };
                            });

      transition.selectAll('path.main-arc')
                .attrTween('d', d => () => arc(d));

      transition.selectAll('path.hidden-arc')
                .attrTween('d', d => () => middleArcLine(d));

      transition.selectAll('text')
                .attrTween('display', d => () => textFits(d) ? null : 'none');

      moveStackToFront(d);

      //
      function moveStackToFront(elD) {
          svg.selectAll('.slice').filter(d => d === elD)
              .each(function(d) {
                  this.parentNode.appendChild(this);
                  if (d.parent) { moveStackToFront(d.parent); }
              })
      }
  }
}

function getHierarchical(data){
  // var data = [
  //  {"country": "Albania", 'year': 1998, "sex": "female", 'age': "15-24 years", 'suicides_no': 32},
  //  {"country": "Albania", 'year': 1998, 'sex': "female", 'age': "25-34 years", 'suicides_no': 10},
  //  {"country": "Albania", 'year': 1998, 'sex': "female", 'age': "35-54 years", 'suicides_no': 9},
  //  {"country": "Albania", 'year': 1998, 'sex': "female", 'age': "5-14 years", 'suicides_no': 1},
  //  {"country": "Albania", 'year': 1998, 'sex': "female", 'age': "55-74 years", 'suicides_no': 6},
  //  {"country": "Albania", 'year': 1998, 'sex': "female", 'age': "75+ years", 'suicides_no': 0},
  //  {"country": "Albania", 'year': 1998, 'sex': "male", 'age': "15-24 years", 'suicides_no': 27},
  //  {"country": "Albania", 'year': 1998, 'sex': "male", 'age': "25-34 years", 'suicides_no': 26},
  //  {"country": "Albania", 'year': 1998, 'sex': "male", 'age': "35-54 years", 'suicides_no': 29},
  //  {"country": "Albania", 'year': 1998, 'sex': "male", 'age': "5-14 years", 'suicides_no': 2},
  //  {"country": "Albania", 'year': 1998, 'sex': "male", 'age': "55-74 years", 'suicides_no': 9},
  //  {"country": "Albania", 'year': 1998, 'sex': "male", 'age': "75+ years", 'suicides_no': 3},
  //  {"country": "Argentina", 'year': 1998, 'sex': "female", 'age': "15-24 years", 'suicides_no': 114},
  //  {"country": "Argentina", 'year': 1998, 'sex': "female", 'age': "25-34 years", 'suicides_no': 52},
  //  {"country": "Argentina", 'year': 1998, 'sex': "female", 'age': "35-54 years", 'suicides_no': 147},
  //  {"country": "Argentina", 'year': 1998, 'sex': "female", 'age': "5-14 years", 'suicides_no': 20},
  //  {'country': "Argentina", 'year': 1998, 'sex': "female", 'age': "55-74 years", 'suicides_no': 140},
  //  {'country': "Argentina", 'year': 1998, 'sex': "female", 'age': "75+ years", 'suicides_no': 53},
  //  {'country': "Argentina", 'year': 1998, 'sex': "male", 'age': "15-24 years", 'suicides_no': 327},
  //  {'country': "Argentina", 'year': 1998, 'sex': "male", 'age': "25-34 years", 'suicides_no': 251},
  //  {'country': "Argentina", 'year': 1998, 'sex': "male", 'age': "35-54 years", 'suicides_no': 508},
  //  {'country': "Argentina", 'year': 1998, 'sex': "male", 'age': "5-14 years", 'suicides_no': 16},
  //  {'country': "Argentina", 'year': 1998, 'sex': "male", 'age': "55-74 years", 'suicides_no': 518},
  //  {'country': "Argentina", 'year': 1998, 'sex': "male", 'age': "75+ years", 'suicides_no': 201}
  // ];
  var newData = {
        "name":"root",
        "children":
        d3.nest()
          .key(function(d){return d.country})
          .key(function(d){return d.age})
          .entries(data)
    }
    //
    var jsonExample = JSON.stringify(newData);
    // console.log(jsonExample)

    var newData =
    {
    "name": "root",
    "children": newData.children.map(function (major)
    {
      return { "name": major.key,
               "children": major.values.map(function (region)
               {
                 return {  "name": region.key,
                           "children": region.values.map(function (size){
                             return { "name" : size.sex,
                                      "size" : size.suicides_no}
                           })
                        };
               }) //end of map(function(region){
        };
    }) //end of map(function(major){
  }; //end of var declaration
  console.log(newData)
  return newData
}

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
