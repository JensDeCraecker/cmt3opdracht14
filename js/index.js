var data = [
  {date: new Date(1975,1,1), name: 'Bill Russell || Boston Celtics'},
  {date: new Date(1979,1,1), name: 'Wilt Chamberlain || Los Angeles Lakers'},
  {date: new Date(1995,1,1), name: 'Kareem Abdul-Jabbar || 1995'},
  {date: new Date(1998,1,1), name: 'Larry Bird || Boston Celtics'},
  {date: new Date(2002,1,1), name: 'Magic Johnson || Los Angeles Lakers'},
  {date: new Date(2004,1,1), name: 'Clyde Drexler || Portland Trail Blazers'},
  {date: new Date(2006,1,1), name: 'Charles Barkley || Houston Rockets '},
  {date: new Date(2008,1,1), name: 'Patrick Ewing || New York Knicks'},
  {date: new Date(2008,1,1), name: 'Hakeem Olajuwon || Houston Rockets'},
  {date: new Date(2009,1,1), name: 'Michael Jordan || Chicago Bulls'},
  {date: new Date(2016,1,1), name: 'Shaquille O Neal || Los Angeles Lakers'},
  {date: new Date(2016,1,1), name: 'Allen Iverson || Philadelphia 76ers'}
];

var options =   {
  margin: {left: 20, right: 20, top: 20, bottom: 20},
  initialWidth: 1000,
  initialHeight: 350
};

var innerWidth =  options.initialWidth - options.margin.left - options.margin.right;
var innerHeight = options.initialHeight - options.margin.top - options.margin.bottom;
var colorScale = d3.scale.category10();

var vis = d3.select('#timeline')
      .append('svg')
      .attr('width',  options.initialWidth)
      .attr('height', options.initialHeight)
      .append('g')
      .attr('transform', 'translate('+(options.margin.left)+','+(options.margin.top)+')');

function labelText(d){
  return d.date.getFullYear() + ' - ' + d.name;
}


// compute labels dimension
var dummyText = vis.append('text');
var timeScale = d3.time.scale()
      .domain(d3.extent(data, function(d){return d.date;}))
      .range([0, innerWidth])
      .nice();
var nodes = data.map(function(movie){
  var bbox = dummyText.text(labelText(movie))[0][0].getBBox();
  movie.h = bbox.height;
  movie.w = bbox.width;
  return new labella.Node(timeScale(movie.date), movie.w + 9, movie);
});
dummyText.remove();
// ---------------------------------------------------
// Draw dots on the timeline
// ---------------------------------------------------
vis.append('line')
      .classed('timeline', true)
      .attr('x2', innerWidth);
var linkLayer = vis.append('g');
var labelLayer = vis.append('g');
var dotLayer = vis.append('g');
dotLayer.selectAll('circle.dot')
      .data(nodes)
      .enter().append('circle')
      .classed('dot', true)
      .attr('r', 3)
      .attr('cx', function(d){return d.getRoot().idealPos;});
function color(d,i){
  return '#183251';
}
/*Labella has utility to help rendering*/
var renderer = new labella.Renderer({
  layerGap: 60,
  nodeHeight: nodes[0].data.h,
  direction: 'bottom'
});
function draw(nodes){
  // Add x,y,dx,dy to node
  renderer.layout(nodes);
  // Draw label rectangles
  var sEnter = labelLayer.selectAll('rect.flag')
      .data(nodes)
      .enter().append('g')
      .attr('transform', function(d){return 'translate('+(d.x-d.width/2)+','+(d.y)+')';});
  sEnter
      .append('rect')
      .classed('flag', true)
      .attr('width', function(d){ return d.data.w + 9; })
      .attr('height', function(d){ return d.data.h + 4; })
      .attr('rx', 2)
      .attr('ry', 2)
      .style('fill', color);
  sEnter.append('text')
    .attr('x', 4)
    .attr('y', 15)
    .style('fill', 'white')
    .text(function(d){return labelText(d.data);});
  // Draw path from point on the timeline to the label rectangle
  linkLayer.selectAll('path.link')
    .data(nodes)
    .enter().append('path')
    .classed('link',true)
    .attr('d',function(d){return renderer.generatePath(d);})
    .style('stroke',color)
    .style('stroke-width',2)
    .style('opacity',0.7)
    .style('fill','none');
}
/*Use labella.Force to place the labels*/
var force = new labella.Force({
  minPos: -10,
  maxPos: innerWidth
})
  .nodes(nodes)
  .compute();
draw(force.nodes());
/* ---- particles.js config ---- */

particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 400,
      "density": {
        "enable": true,
        "value_area": 700
      }
    },
    "color": {
      "value": "#22AE98"
    },
    "shape": {
      "type": "edge",
      "stroke": {
        "width": 3,
        "color": "#22AE98"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 0.1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 5,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 0.3,
        "size_min": 0.1,
        "sync": true
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 180,
      "color": "#152A43",
      "opacity": 0.7,
      "width": 2
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "right",
      "random": true,
      "straight": true,
      "out_mode": "bounce",
      "bounce": true,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "bubble"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 200,
        "size": 6,
        "duration": 1,
        "opacity": 5,
        "speed": 5
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});