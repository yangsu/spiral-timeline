var config = {
  radius: 100,
  phase: 0,
  lengthSegments: 500,
  decay: 1,


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
  gui.add(config, 'revolutions', 1, 10).onChange(onChange);
  gui.add(config, 'lengthSegments', 100, 1000).onChange(onChange);
  gui.add(config, 'radius', 10, 1000).onChange(onChange);
  gui.add(config, 'decay', 0, 10).onChange(onChange);
  // gui.add(config, 'phase', 0, 2 * Math.PI).step(Math.PI/8).onChange(onChange);
});

$(window).resize(updateCanvasSize);

