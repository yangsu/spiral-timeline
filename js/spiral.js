var path = new Path();
path.strokeColor = 'black';

var cx = view.size.width/2;
var cy = view.size.height/2;

var circles = _.map(config.markers, function (markerLoc, i) {
  var p = new Path.Circle(new Size(cx, cy), markerLoc);
  var t = i/config.markers.length;
  p.strokeColor = new RgbColor(t, t, t);
  p.strokeColor.alpha = 0.5;
  return p;
});

path.closed = false;
// Select the path, so we can see its handles:
// path.fullySelected = true;

var dataPoints = [];
var dataCircles = [];

var step = config.revolutions * 2 * Math.PI/config.lengthSegments;

for (var i = 0, t = 0; i < config.lengthSegments; i++, t += step) {
  var r = (Math.pow(Math.E, -config.decay * i / config.constSegments) - 1) * config.radius;
  var x = cx + Math.sin(t) * r;
  var y = cy + Math.cos(t) * r;

  path.add(new Point(x, y));
}


this.draw = function draw() {

  // var step = config.revolutions * 2 * Math.PI/config.lengthSegments;
  var step = 2 * Math.PI/config.constSegments;

  while (path.segments.length <= config.lengthSegments) {
    var r = (Math.pow(Math.E, -config.decay * i / config.constSegments) - 1) * config.radius;
    var x = cx + Math.sin(t) * r;
    var y = cy + Math.cos(t) * r;
    path.add(new Point(x, y));
  }

  for (var i = 0, t = 0; i < config.lengthSegments; i++, t += step) {
    var r = (Math.pow(Math.E, -config.decay * i / config.constSegments) - 1) * config.radius;
    var p = path.segments[i].point;
    p.x = cx + Math.sin(t + config.phase) * r;
    p.y = cy + Math.cos(t + config.phase) * r;
  }

  for (var j = 0, len = dataPoints.length; j < len; j += 1) {
    var ii = dataPoints[j];
    var p = path.segments[ii].point;
    var c = dataCircles[j];
    c.position.x = p.x;
    c.position.y = p.y;
  }

}

function onFrame(event) {
  if (config.animate) {
    draw();
    config.phase = (config.phase + config.rotation) % (Math.PI * 2)
    path.smooth();

    config.lengthSegments += config.growth;
  }

  dataPoints = dataPoints.map(function (v) {
    return v + 1;
  });

  if (Math.random() <= 0.02) {
    dataPoints.push(0);
    var r = Math.pow(Math.E, -1) * config.radius;
    var x = cx + Math.sin(config.phase) * r;
    var y = cy + Math.cos(config.phase) * r;

    var c = new Path.Circle(new Size(x, y), config.dataPointSize);
    c.strokeColor = config.dataPointColor;
    c.strokeColor.alpha = 0.5;
    c.fillColor = config.dataPointColor;
    dataCircles.push(c);
  }
}

function onMouseMove(event) {
  for (var i = 0, len = dataCircles.length; i < len; i += 1) {
    var c = dataCircles[i];
    if (c.hitTest(event.point)) {
      c.fillColor = '#FFF';
    } else {
      c.fillColor = config.dataPointColor;
    }
  }
}


paper.install(window.paperscript)