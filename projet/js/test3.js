var width = 960,
    height = 500,
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 12;

var n = 200, // total number of nodes
    m = 10; // number of distinct clusters

var color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(d3.range(m));

// The largest node for each cluster.
var clusters = new Array(m);

var nodes = d3.range(n).map(function() {
  var i = Math.floor(Math.random() * m),
      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
      d = {cluster: i, radius: r};
  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
  return d;
});

nodes = d3.nest()
	.key(function(d) { return d.cluster; })
  .entries(nodes);

nodes = d3.hierarchy(nodes,function(d) { return d.values; });

// Use the pack layout to initialize node positions.
d3.pack(nodes)
    .size([width, height])
    .radius(function(d) { return d.radius * d.radius; });

var force = d3.forceSimulation(nodes)
	.force('manybody', d3.forceManyBody())
	.force('cluster', cluster)
	.force('collide', collide)
  .on("tick", tick);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var node = svg.selectAll("circle")
    .data(nodes)
  .enter().append("circle")
    .style("fill", function(d) { return color(d.cluster); })
    .call(d3.drag());

node.transition()
    .duration(750)
    .delay(function(d, i) { return i * 5; })
    .attrTween("r", function(d) {
      var i = d3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });

function tick(e) {
  if(!node){ return; }
  node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
  return function(d) {
    var cluster = clusters[d.cluster];
    if (cluster === d) return;
    var x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
    if (l != r) {
      l = (l - r) / l * alpha;
      d.x -= x *= l;
      d.y -= y *= l;
      cluster.x += x;
      cluster.y += y;
    }
  };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
  var quadtree = d3.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}
