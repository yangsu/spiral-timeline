var stats, scene, renderer, composer;
var camera, cameraControl;

var config = {
  radius: 2,
  tubeRadius: 0.01,

  height: 0,

  lengthSegments: 500,
  radialSegments: 50,

  revolutions: 1
};

THREE.HelixCurve = THREE.Curve.create(function() {},
    function(t) {
      var t2 = 2 * Math.PI * t * config.revolutions;
      var tx = Math.cos(t2) * config.radius * t,
          ty = Math.sin(t2) * config.radius * t,
          tz = config.height * t;

      return new THREE.Vector3(tx, ty, tz);
    });

THREE.Tube = function(path) {
  this.geometry = new THREE.Geometry();

  this.grid = new Array(config.lengthSegments);
  this.path = path;

  var tang = new THREE.Vector3();
  var binormal = new THREE.Vector3();
  var normal = new THREE.Vector3();
  var pos = new THREE.Vector3();
  var epsilon = 0.001;
  var u, v;
  var p1, p2;
  var cx, cy;
  var oldB;

  for (var i = 0; i < config.lengthSegments; ++i) {

    this.grid[i] = new Array(config.radialSegments);

    u = i / config.lengthSegments;

    var pos = this.path.getPointAt(u);
    tang = this.path.getTangentAt(u);

    if (oldB === undefined) {
      //arbitrary vector
      oldB = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
    }
    normal.cross(oldB, tang).normalize();
    binormal.cross(tang, normal).normalize();
    oldB = binormal;

    // // --------------------------------------------------------------------------------------------
    // if (i == 0) normal = p1.clone().normalize(); // This is a total hack. Won't work if p1 is zero.
    // // This is not production quality, either.
    // // --------------------------------------------------------------------------------------------
    // binormal.cross(tang, normal);
    // normal.cross(binormal, tang);
    // binormal.normalize();
    // normal.normalize();
    for (var j = 0; j < config.radialSegments; ++j) {

      cx = config.tubeRadius * Math.cos(v); // TODO: Hack: Negating it so it faces outside.

      cy = config.tubeRadius * Math.sin(v);

      v = j / config.radialSegments * 2 * Math.PI;


      var rCosN = new THREE.Vector3();
      rCosN.copy(normal);
      rCosN.multiplyScalar(cx);

      var rSinB = new THREE.Vector3();
      rSinB.copy(binormal);
      rSinB.multiplyScalar(cy);

      var pt = new THREE.Vector3();
      pt.addSelf(pos);
      pt.addSelf(rCosN);
      pt.addSelf(rSinB);

      this.grid[i][j] = this.vert(pt.x, pt.y, pt.z);
    }
  }

  for (var i = 0; i < config.lengthSegments - 1; ++i) {

    for (var j = 0; j < config.radialSegments; ++j) {

      var ip = (i + 1) % config.lengthSegments;
      var jp = (j + 1) % config.radialSegments;

      var a = this.grid[i][j];
      var b = this.grid[ip][j];
      var c = this.grid[ip][jp];
      var d = this.grid[i][jp];

      var uva = new THREE.UV(i / config.lengthSegments, j / config.radialSegments);
      var uvb = new THREE.UV((i + 1) / config.lengthSegments, j / config.radialSegments);
      var uvc = new THREE.UV((i + 1) / config.lengthSegments, (j + 1) / config.radialSegments);
      var uvd = new THREE.UV(i / config.lengthSegments, (j + 1) / config.radialSegments);

      this.geometry.faces.push(new THREE.Face4(a, b, c, d));
      this.geometry.faceVertexUvs[0].push([uva, uvb, uvc, uvd]);

    }
  }

  this.geometry.computeCentroids();
  this.geometry.computeFaceNormals();
  this.geometry.computeVertexNormals();

  return this;
};

THREE.Tube.prototype.vert = function(x, y, z) {
  return this.geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, z))) - 1;
};

var init = _.once(function() {
  if (Detector.webgl) {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      // to get smoother output
      preserveDrawingBuffer: true // to allow screenshot
    });
    renderer.setClearColorHex(0xBBBBBB, 1);
  } else {
    renderer = new THREE.CanvasRenderer();
  }
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  // add Stats.js - https://github.com/mrdoob/stats.js
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  document.body.appendChild(stats.domElement);

  // create a scene
  scene = new THREE.Scene();

  // put a camera in the scene
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 5);
  scene.add(camera);

  // create a camera contol
  cameraControls = new THREE.TrackballControls(camera);

  // transparently support window resize
  THREEx.WindowResize.bind(renderer, camera);
  // allow 'p' to make screenshot
  THREEx.Screenshot.bindKey(renderer);
  // allow 'f' to go fullscreen where this feature is supported
  if (THREEx.FullScreen.available()) {
    THREEx.FullScreen.bindKey();
    document.getElementById('inlineDoc').innerHTML += '- <i>f</i> for fullscreen';
  }

  var light = new THREE.AmbientLight(Math.random() * 0xffffff);
  scene.add(light);

  var tube = new THREE.Tube(new THREE.HelixCurve());

  // var mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [new THREE.MeshNormalMaterial(), new THREE.MeshNormalMaterial()]);
  var material = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh(tube.geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, Math.PI, 0);
  mesh.scale.set(1, 1, 1);
  scene.add(mesh);


  var gui = new dat.GUI();

  gui.add(config, 'radius', 1, 100);
  gui.add(config, 'height', 1, 200);

});

function animate() {

  // loop on request animation loop
  // - it has to be at the begining of the function
  // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  requestAnimationFrame(animate);

  // do the render
  render();

  // update stats
  stats.update();
}

function render() {
  // variable which is increase by Math.PI every seconds - usefull for animation
  var PIseconds = Date.now() * Math.PI;

  // update camera controls
  cameraControls.update();

  // actually render the scene
  renderer.render(scene, camera);
}

$(function() {
  init();
  animate();
});
