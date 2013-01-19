var config = {
  animate: true,

  lengthSegments: 0,
  constSegments: 500,
  growth: 1,
  phase: 0,

  dataPointSize: 5,
  dataPointColor: '#F35',

  radius: 200,
  decay: 1,

  rotation: 0,
  revolutions: 5,

  markers: [ 50, 100, 200, 400, 800 ]
};

var paperscript = {};

var $paper;

var updateCanvasSize = function() {
  $paper && $paper.attr({
    width: window.innerWidth,
    height: window.innerHeight,
  });
}

$(function() {
  $paper = $('#paper');
  updateCanvasSize();


  var gui = new dat.GUI();
  var onChange = function(value) {
    paperscript.draw()
  };

  gui.add(config, 'animate', true).onChange(onChange);
  // gui.add(config, 'revolutions', 1, 10).onChange(onChange);
  gui.add(config, 'growth', 1, 10).onChange(onChange);
  gui.add(config, 'dataPointSize', 1, 10).onChange(onChange);
  gui.addColor(config, 'dataPointColor').onChange(onChange);

  gui.add(config, 'constSegments', 100, 1000).onChange(onChange);
  gui.add(config, 'radius', 10, 1000).onChange(onChange);
  gui.add(config, 'decay', 0, 2).onChange(onChange);
  gui.add(config, 'rotation').min(-Math.PI/16).max(Math.PI/16).step(Math.PI/128).onChange(onChange);
});

$(window).resize(updateCanvasSize);

