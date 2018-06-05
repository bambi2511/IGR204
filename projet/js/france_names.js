const w = 600;
const h = 600;
var dataset = [];

var diameter = 960,
  format = d3.format(",d"),
  color = d3.scaleOrdinal(d3.schemeCategory20c);

var bubble = d3.pack()
  .size([diameter, diameter])
  .padding(1.5);

var svg = d3.select("body").append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");

// convert data
var rowNatConverter = function(d) {
  return {
    sexe: parseFloat(d.sexe),
    preusuel: d.preusuel,
    //annais2: parseFloat(d.annais),
    annais: new Date(+d.annais, 0, 1),
    // dpt: +d.dpt,
    nombre: parseFloat(d.nombre)
  };
}

// import data
d3.tsv("data/nat2016.txt", rowNatConverter, function(error, data) {
  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }

  // console.log(data)
  dataset = data;
  //displayBubbles();

  var svgContainer = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  var groupCircles = svgContainer.append("g")
    .attr("class", "everything");

  var circles = groupCircles.selectAll("circle")
    //.data(dataset)
    .data(dataset.filter(function(d){return d.annais.getFullYear() == 1979;}))
    .enter()
    .append("circle");
})





//console.log(data);


//d3.select("body").append("p").text("Not done yet")
//  .get((error, rows) => {
//    // Handle errors or set up visualisation hello-franceconsole.log
//    console.log("Loaded " + rows.length + " rows");
//    if (rows.length > 0) {
//      console.log("First row: ", rows[0])
//      console.log("Last row: ", rows[rows.length - 1])
//    }
//    dataset = rows;

//draw();

//  })
