var config = {
  radius: 2,
  tubeRadius: 0.01,

  height: 0,

  lengthSegments: 500,
  radialSegments: 50,

  revolutions: 1
};

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
});

$(window).resize(updateCanvasSize);
