// svg's width and height is ultimate boundary for drawing
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height"),

  //  var g is where drawing really begin
  g = svg.append("g")
  .attr("transform", "translate(32," + (height / 2) + ")");




// ---- split a string into string array
var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
// console.log(alphabet);



// ---- create a updating func  -----------------------
function update(data) {



  // ---- update new data with existing dom ---------------
  // 1. bind data with all existing text dom
  var text = g.selectAll("text")
    .data(data);

  // 2. inside text, there are 3 arrays of objs, only update groups is selected
  //   	2.1. _enter:
  //   					array of NodeList: length => num of new data without previous dom to match
  //   	2.2. _exit:
  //   					array of text: length => num of previous dom without new data to match
  //   	2.3. _groups: update group
  //   					array of text: length => num of previous dom matched with new data

  // 3. add class name to selection for update
  text.attr("class", "update");
  // console.log("check updated text: ", text);


  // ---- step 7: select, create, attr entering dom with data -----------
  //   1. select _enter array of NodeList storing datum from new dataset:
  //   			code: var enterText =  text.enter()

  //   2. create a text array to replace NodeList
  //   			code: var enterText =  text.enter().append("text")
  //   			outcome: elements of NodeList are replaced with texts

  //	 3. add attr: className, x, dy
  //   			meaning: each letter's x position is depend on datum index
  //   			code:       .attr("x", function(d, i) { return i * 32; })

  var enterText = text.enter().append("text")
    .attr("class", "enter")
    .attr("x", function(d, i) {
      return i * 32;
    })
    .attr("dy", ".35em");

  // console.log("Look at enterText: ", enterText);


  // ---- step 8: merge with update selection -----------------------
  //   1. let enterText merge with text (update selection): --
  // 					code: var mergedText = enterText.merge(text)
  //   				outcome: the merged doms are selected

  // 	 2. add x attr to the merged selection: --
  //   				meaning: x position depend on each datum's index

  // 	 3. add label to each dom/text: --
  //   				code: .text(function(d){return d;})
  var mergedText = enterText
    .merge(text)
    .attr("x", function(d, i) {
      return i * 32;
    })
    .text(function(d) {
      return d;
    });

  // console.log("Look at mergedText: ", mergedText);


  // ---- step 9: select exiting dom and remove them --------------------
  //   1. select exiting dom: --
  //   				code: text.exit()
  //   2. remove exiting dom from elements view: --
  //   				code: var exitText = text.exit().remove();
  var exitText = text.exit().remove();
  //   console.log("Look at exiting texts: ", exitText);

}

// The initial display.
update(alphabet);

// ---- step 10: repetition and interval --------------------------
//  1. repeat after a certain interval: --
//   		code: d3.interval(function() {}, seconds);

//   2. shuffle data like shuffle cards: --
//   		code: d3.shuffle(array)

//   3. subset array: if Math.random() returns 0.5, then: --
//   		code: slice(0, 20)

//   4. Math.floor, Math.round, Math.random(), slice(first, last), sort(): --
//   		note: diff between Math.floor and Math.round
//   		search: w3schools
d3.interval(function() {
  // it is update() function
  // inside update(), we offer a random sample of letters and sort it in alphabet order
  update(d3.shuffle(alphabet)
    .slice(0, Math.floor(Math.random() * 26))
    .sort());
}, 1000);
