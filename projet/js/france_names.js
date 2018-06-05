const w = 800;
const h = 800;
var dataset = [];
size = Math.max(w, h);

var svgContainer = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
//  .attr("class", "bubble");

// convert data
var rowNatConverter = function(d) {
  return {
    sexe: parseFloat(d.sexe),
    preusuel: d.preusuel,
    annais: new Date(+d.annais, 0, 1),
    r: parseFloat(d.nombre) / 100
  };
}

// import data
d3.tsv("data/nat2016.txt", rowNatConverter, function(error, data) {
  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }

  dataset = data;

  var color = d3.scaleLinear()
    .domain([15, 35, 132])
    .range(["#d7191c", "#ffffbf", "#2c7bb6"])
    .interpolate(d3.interpolateHcl);


  var circles = d3.packSiblings(dataset.filter(function(d) {
    return d.annais.getFullYear() == 1979;
  }))
  //  .filter(function(d) {
  //    return -500 < d.x && d.x < 500 && -500 < d.y && d.y < 500;
  //  });
  //displayBubbles();

  var bubbles = svgContainer.append("g")
    .selectAll("circle")
    .data(circles)
    .enter().append("circle")
    .style("fill", function(d) {
      return color(d.angle = Math.atan2(d.y, d.x));
    })
    .attr("cx", function(d) {
      return Math.cos(d.angle) * (size / Math.SQRT2 + 30);
    })
    .attr("cy", function(d) {
      return Math.sin(d.angle) * (size / Math.SQRT2 + 30);
    })
    .attr("r", function(d) {
      return d.r - 0.25;
    })
    .transition()
    .ease(d3.easeCubicOut)
    .delay(function(d) {
      return Math.sqrt(d.x * d.x + d.y * d.y) * 10;
    })
    .duration(1000)
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
});

//  var bubbles = svgContainer.append("g")
//    .attr("transform", "translate(0,0)")
//    .selectAll(".bubble")
//    .data(dataset.filter(function(d) {
//      return d.annais.getFullYear() == 1979;
//    }))
//    .enter();

//create the bubbles
//  bubbles.append("circle")
//    .attr("r", function(d) {
//      return d.nombre;
//    })
//    .attr("cx", function(d) {
//      return d.x;
//    })
//    .attr("cy", function(d) {
//      return d.y;
//    })
//    .style("fill", function(d) {
//      return color(d.value);
//    });

//format the text for each bubble
//  bubbles.append("text")
//    .attr("x", function(d) {
//      return d.x;
//    })
//    .attr("y", function(d) {
//      return d.y + 5;
//    })
//    .attr("text-anchor", "middle")
//    .text(function(d) {
//      return d["Fruit"];
//    })
//    .style({
//      "fill": "white",
//      "font-family": "Helvetica Neue, Helvetica, Arial, san-serif",
//      "font-size": "12px"
//    });

//})
