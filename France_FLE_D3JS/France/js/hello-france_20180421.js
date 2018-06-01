//alert("Hello, France!");
const w = 600;
const h = 600;
let dataset = [];

// Create svg document
let svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)



d3.tsv("data/france.tsv")
  .row( (d, i) =>{
       return {
           codepostal: +d["Postal Code"],
           inseeCode: +d.inseecode,
           place: d.place,
           longitude: +d.x,
           latitude: +d.y,
           population: +d.population,
           density: +d.density
       }
  })
  .get( (error, rows) => {
       // Handle errors or set up visualisation hello-franceconsole.log
       console.log("Loaded " + rows.length + " rows");
       if (rows.length > 0) {
           console.log("First row: ", rows[0])
           console.log("Last row: ", rows[rows.length - 1])
       }
       dataset = rows;

       let x = d3.scaleLinear()
               .domain(d3.extent(rows, (row) => row.longitude))
               .range([0, w]);

       let y = d3.scaleLinear()
               .domain(d3.extent(rows, (row) => row.latitude))
               .range([0, h]);


       function draw() {
         svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("width", 1)
            .attr("height", 1)
            //.attr("x", (d) => d.longitude)
            //.attr("y", (d) => d.latitude)
            .attr("x", (d) => x(d.longitude))
            .attr("y", (d) => y(d.latitude))
       }

       draw();
       //draw();
})

//console.log("Loaded DS " + dataset.length + " rows");
//if (dataset.length > 0) {
//    console.log("First row: ", dataset[0])
//    console.log("Last row: ", dataset[dataset.length - 1])
//  }




//let x = d3.scaleLinear()
//        .domain(d3.extent(rows, (row) => row.longitude))
//        .range([0, w]);

//let y = d3.scaleLinear()
//        .domain(d3.extent(rows, (row) => row.latitude))
//        .range([0, h]);
