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

var step = config.revolutions * 2 * Math.PI/config.lengthSegments;

for (var i = 0, t = 0; i < config.lengthSegments; i++, t += step) {
  var r = i / config.lengthSegments * config.radius;
  var x = cx + Math.sin(t) * r;
  var y = cy + Math.cos(t) * r;

  path.add(new Point(x, y));
}


this.draw = function draw() {

  var step = config.revolutions * 2 * Math.PI/config.lengthSegments;

  for (var i = 0, t = 0; i < config.lengthSegments; i++, t += step) {
    var r = i / config.lengthSegments * config.radius;
    var p = path.segments[i].point;
    p.x = cx + Math.sin(t) * r;
    p.y = cy + Math.cos(t) * r;
  }

}

function onFrame(event) {
  draw();
  path.smooth();
}


paper.install(window.paperscript)