// Ruchella Kock
// 12460796
// source: https://bl.ocks.org/vasturiano/12da9071095fbd4df434e60d52d2d58d

// this function makes the sunburst
function makeSunburst(data){
  root = getHierarchical(data)
  // set the height and width of the svg and the radius of the sunburst
  const width = 650,
        height = 650,
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
  const color = d3.scaleOrdinal(["#4575b4", "#313695", "#a50026", "#d73027", "#f46d43", "#fdae61",
                                 "#fee090", "#e0f3f8", "#abd9e9", "#74add1"]);

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
      const CHAR_SPACE = 8;

      const deltaAngle = x(d.x1) - x(d.x0);
      const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
      const perimeter = r * deltaAngle;

      return d.data.name.length * CHAR_SPACE < perimeter;
  };

      const svg = d3.select('.sunburst')
                    .append('svg')
                    .style('width', width)
                    .style('height', height)
                    .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
                    .on('click', () => focusOn());


      // root = response[4]
      root = d3.hierarchy(root);
      root.sum(d => d.size);

      const slice = svg.selectAll('g.slice')
                       .data(partition(root).descendants());
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
          .style('stroke-width', 2)
          .style('stroke-linejoin', 'round');

      text.append('textPath')
          .attr('startOffset','50%')
          .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
          .text(d => d.data.name);

  // This function makes the graph zoomable
  function focusOn(d = {x0: 0, x1: 1, y0: 0, y1: 1 }) {
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

// this function formats the data to a nested format
function getHierarchical(data){
  var newData = { "name":"root",
                  "children":
                  d3.nest()
                    .key(function(d){return d.country})
                    .key(function(d){return d.age})
                    .entries(data)
                }

    var newData =
    {
    "name":"Countries",
    "children": newData.children.map(function (major){
                return { "name": major.key,
                         "children": major.values.map(function (region){
                          return {  "name": region.key,
                                    "children": region.values.map(function (size){
                                     return { "name" : size.sex,
                                              "size" : size.suicides_per_10000}
                                    })
                                  };
                          })
                        };
     })
    }
    return newData
}

// this function updates the sunburst
function updateSunburst(data){
  d3.select(".sunburst").select("svg").remove();
  makeSunburst(data);
}
