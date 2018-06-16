var dataset = [];
var dataGrp = {};
var fileNational = "data/nat2016m.txt";


var bubbleChart = function() {
  var width = 600,
    height = 400;

  function chart(selection) {
    // you gonna get here
  }


  chart.width = function(value) {
    if (!arguments.length) {
      return width;
    }
    width = value;

    return chart;
  }

  chart.height = function(value) {
    if (!arguments.length) {
      return height;
    }
    height = value;

    return chart;
  }

  return chart;
}


// bubble_graph.html


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
    throw (error);
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
      // sum of the circles use the same area as a square
      // dirty: space loss: tuned at 0.8
      return 0.8 * Math.sqrt((chart.width * chart.height) / (Math.PI * sumPop));
    }).entries(data);

  //dictionary
  for (var i = 0; i < tmpDataGrp.length; i++) {
    dataGrp[tmpDataGrp[i].key] = tmpDataGrp[i].value;
  }
})

var chart = bubbleChart().width(300).height(200);

var svgContainer = d3.select("body")
  .append("div")
  .attr("class", "bubbleChart")
  .attr("id", "chart")
  .append("svg")

d3.select('#chart')
  .data(dataset).call(chart);
//  .attr("class", "bubble");
