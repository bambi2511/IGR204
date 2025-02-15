const w = 800;
const h = 800;
var dataset = [];
var dataGrp = {};
var transitionDuration = 1000;
var year = 1900;
var fileNational = "data/nat2016m.txt";

var svgContainer = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);
//  .attr("class", "bubble");

var bubbleChart = svgContainer
  .append("g")
  .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

// convert data
var rowNatConverter = function(d) {
  return {
    sexe: parseFloat(d.sexe),
    preusuel: d.preusuel,
    // annais: new Date(+d.annais, 0, 1),
    annais: +d.annais,
    nombre: parseFloat(d.nombre),
    r: (parseFloat(d.nombre))
  };
}

// import data and calculate appropriate circle scale
d3.tsv(fileNational, rowNatConverter, function(error, data) {
  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }

  dataset = data;

  //get population per year

  var tmpDataGrp = d3.nest()
    .key(function(d) {
      return d.annais;
    })
    .rollup(function(d) {
      // sum up population for each year
      var sumPop = d3.sum(d, function(g) {
        return g.r;
      });
      // sum of the circles use the same area as a rectangle
      // computes the coefficient applied to sqrt(pop)
      // dirty: space loss: tuned at 0.8
      return 0.8 * Math.sqrt((w * h) / (Math.PI * sumPop));
    }).entries(data);

  //dictionary
  for (var i = 0; i < tmpDataGrp.length; i++) {
    dataGrp[tmpDataGrp[i].key] = tmpDataGrp[i].value;
  }

  //rescale radius
  for (var i = 0; i < data.length; i++) {
    data[i].r = dataGrp[data[i].annais] * Math.sqrt(data[i].r);
  }
  // initialize rendering
  drawBubble(1900);
});

var color = d3.scaleLinear()
  .domain([15, 35, 132])
  .range(["#d7191c", "#ffffbf", "#2c7bb6"])
  .interpolate(d3.interpolateHcl);

d3.select("body").append("button")
  .text(year)
  .on("click", function() {
    //select new data
    year += 1;
    drawBubble(year);
  });

function drawBubble(year) {
  var circles = d3.packSiblings(dataset.filter(
    function(d) {
      return d.annais == year;
    }));

  var node = bubbleChart
    .selectAll("g")
    .data(circles, function(d) {
      return d.sexe + d.preusuel;
    });

  // remove a bubble
  node.exit().selectAll("text").transition().delay(transitionDuration).remove();
  node.exit().selectAll("circle").transition().duration(transitionDuration).attr("r", 0);
  node.exit().transition().delay(transitionDuration).remove();

  // update a bubble
  node.select("circle")
    .transition().duration(transitionDuration)
    .attr("r", function(d) {
      return d.r;
    })
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
  //.call(force.drag);

  //title
  node.select("title")
    .text(function(d) {
      return d.preusuel + " : " + d.nombre;
    })

  node.select("text")
    .transition().duration(transitionDuration)
    .attr("class", "update")
    .attr("x", function(d) {
      return d.x;
    })
    .attr("y", function(d) {
      return d.y;
    })
    .style("font-size", function(d) {
      // quick and dirty : to refactor
      return Math.round(d.r / 3) + 'px';
    });

  // add a new bubble (none if modified)
  var groupBubbles = node
    .enter()
    .append("g")


  // only for new circles
  groupBubbles.append("circle")
    .style("fill", function(d) {
      return color(d.angle = Math.atan2(d.y, d.x));
    })
    .attr("cx", function(d) {
      return Math.cos(d.angle) * (w / Math.SQRT2 + 30);
    })
    .attr("cy", function(d) {
      return Math.sin(d.angle) * (h / Math.SQRT2 + 30);
    })
    .attr("r", function(d) {
      return d.r //- 0.25
    })
    .transition()
    .ease(d3.easeCubicOut)
    .delay(function(d) {
      return Math.sqrt(d.x * d.x + d.y * d.y) * 10;
    })
    .duration(transitionDuration)
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
  //.call(force.drag)
  ;

  //title
  groupBubbles.append("title")
    .text(function(d) {
      return d.preusuel + " : " + d.nombre;
    })

  groupBubbles.append("text")
    .attr("x", function(d) {
      return Math.cos(d.angle) * (w / Math.SQRT2 + 30);
    })
    .attr("y", function(d) {
      return Math.sin(d.angle) * (h / Math.SQRT2 + 30);
    })
    .attr("class", "enter")
    .style("text-anchor", "middle")
    .style("font-size", function(d) {
      // quick and dirty : to refactor
      return Math.round(d.r / 3) + 'px';
    })
    .text(function(d) {
      return d.preusuel;
    })
    .transition()
    .ease(d3.easeCubicOut)
    .delay(function(d) {
      return Math.sqrt(d.x * d.x + d.y * d.y) * 10;
    })
    .duration(transitionDuration)
    .attr("x", function(d) {
      return d.x;
    })
    .attr("y", function(d) {
      return d.y;
    });

}
