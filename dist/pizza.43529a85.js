// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"pizza.js":[function(require,module,exports) {
//debugging
var showDebugMessages = false; //media

var shipImage, bgImage;
var circeRounded;
var windowWidth = innerWidth,
    windowHeight = innerHeight;
var zapSound, nutrSound, bactSound, beamSound; //ship, nutrients and bacterias

var firingRate = 25; //  <--- tells you how often you can shoot a lazer

var nutrGroup, bactGroup;
var lazers = [];
var nutriCount = 5;
var ship, shipX, shipY;
var newBac;
var barWidth = 90;
var explosionStart = -1;
var char1;
var currentNutrients, producedGoods; //score and time

var playerScore, time;
var curNutX = innerWidth * 0.47;
var curNutY = innerHeight * 0.935;
var goodsX = innerWidth * 0.65;
var goodsY = innerHeight * 0.935; //data

/*let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
var portName = '/dev/tty.usbmodem14201';
let cur = 0, prev = 0;
let sensor_data = '';*/

function preload() {
  //cirTexture = loadImage("../assets/1.png");
  sqTexture = loadImage("../assets/tr1.png");
  bgImage = loadImage("../assets/backgroundBad.jpg");
  shipImage = loadImage("../assets/char2.png");
  shipX = windowWidth * 0.4;
  shipY = windowHeight * 0.758;
  playerScore = 0;
  circeRounded = loadFont('../fonts/CirceRounded.otf');
  nutrGroup = new Group();
  bactGroup = new Group();
  lazersGroup = new Group();
  currentNutrients = new Group();
  producedGoods = new Group();
}

function setup() {
  var myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("myCanvas");
  background(bgImage);
  ship = new Ship(shipImage, shipX, shipY);
  pX = getRnd(0, 1100);
  pY = getRnd(0, 200);
  score = 0;
  char1 = createSprite(innerWidth * 0.055, innerHeight * 0.713);
  char1.scale = 0.6;
  char1.addAnimation('char1-normal', "../assets/char1.png");
  char1.changeAnimation('char1-normal'); //data

  /*serial = new p5.SerialPort();
  serial.list();
  serial.open(portName);
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);*/
  //newBac = generateBactSprite();

  zapSound = loadSound('../sounds/shoot.mp3');
  nutrSound = loadSound('../sounds/hit.mp3');
  bactSound = loadSound('../sounds/explosion.mp3');
  beamSound = loadSound('../sounds/pick.mp3');
}

function draw() {
  background(bgImage);
  time = parseInt(frameCount / 60); //let ship_position = parseFloat(sensor_data);

  ship_position = 1;

  if (ship_position) {
    ship.draw(ship_position);
  } else {
    ship.draw(0);
  }

  if (time % 5 == 0) {
    if (bactGroup.length < 2) {
      newBac = generateBactSprite();
      bactGroup.add(newBac);
    }
  }

  if (nutrGroup.length < 3 && nutriCount < 100) {
    nutrGroup.add(generateNutrSprite());
    nutriCount++; //barWidth+=1;
  }

  bacNutrOverlap();
  updateBacteria();
  updateNutrients();
  fill(224, 75, 55);
  textFont(circeRounded);
  textAlign(CENTER);
  textSize(50);
  text(playerScore, innerWidth * 0.942, innerHeight * 0.95);

  if (currentNutrients.length == 3) {
    var spr = createSprite(goodsX, goodsY);
    spr.addAnimation('normal', "../assets/bacteria.png");
    spr.scale = 0.6;
    producedGoods.add(spr);
    currentNutrients.removeSprites();
    goodsX += 50;
    curNutX = innerWidth * 0.47;
    playerScore++;
  }

  drawSprites(nutrGroup, bactGroup, currentNutrients, producedGoods);
  fill(56, 64, 143);
  noStroke();
  barWidth = 90 - map(nutriCount, 0, 200, 0, 90);
  rect(innerWidth * 0.025, innerHeight * 0.183, barWidth, 25);
}

function getRnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function serverConnected() {
  print("Connected to Server");
} //Bad guys There


function generateBactSprite() {
  var x = getRnd(innerWidth * 0.17, innerWidth - innerWidth * 0.18);
  var y = getRnd(100, 500);
  var spr = createSprite(x, y);
  spr.scale = 0.7;
  var tp = getRnd(0, 2);

  if (tp == 0) {
    spr.addAnimation('t1-normal', "../assets/bb-07.svg");
    spr.addAnimation('t1-explosion', "../assets/bb1/bb1-1.png", "../assets/bb1/bb1-2.png", "../assets/bb1/bb1-3.png", "../assets/bb1/bb1-4.png", "../assets/bb1/bb1-5.png", "../assets/bb1/bb1-6.png", "../assets/bb1/bb1-7.png", "../assets/bb1/bb1-8.png", "../assets/bb1/bb1-9.png", "../assets/bb1/bb1-10.png", "../assets/bb1/bb1-11.png", "../assets/bb1/bb1-12.png");
    spr.animationDelay = 0;
  }

  if (tp == 1) {
    spr.addAnimation('t2-normal', "../assets/bb-08.svg");
    spr.addAnimation('t2-explosion', "../assets/bb2/bb2-1.png", "../assets/bb2/bb2-2.png", "../assets/bb2/bb2-3.png", "../assets/bb2/bb2-4.png", "../assets/bb2/bb2-5.png", "../assets/bb2/bb2-6.png", "../assets/bb2/bb2-7.png", "../assets/bb2/bb2-8.png", "../assets/bb2/bb2-9.png", "../assets/bb2/bb2-10.png", "../assets/bb2/bb2-11.png", "../assets/bb2/bb2-12.png");
    spr.animationDelay = 0;
  }

  if (tp == 2) {
    spr.addAnimation('t3-normal', "../assets/bb-09.svg");
    spr.addAnimation('t3-explosion', "../assets/bb3/bb3-1.png", "../assets/bb3/bb3-2.png", "../assets/bb3/bb3-3.png", "../assets/bb3/bb3-4.png", "../assets/bb3/bb3-5.png", "../assets/bb3/bb3-6.png", "../assets/bb3/bb3-7.png", "../assets/bb3/bb3-8.png", "../assets/bb3/bb3-9.png", "../assets/bb3/bb3-10.png", "../assets/bb3/bb3-11.png", "../assets/bb3/bb3-12.png");
    spr.animationDelay = 0;
  }

  return spr;
}

function updateBacteria() {
  var z = -1;

  for (var i = lazers.length - 1; i >= 0; i--) {
    lazers[i].draw();

    if (!lazers[i].update()) {
      lazers.splice(i, 1);

      if (showDebugMessages) {
        console.log("Lazer #" + i + " left the screen!");
      }
    } else {
      for (var j = bactGroup.length - 1; j >= 0; j--) {
        var distance = sqrt(pow(lazers[i].x - 25 - bactGroup[j].position.x, 2) + pow(lazers[i].y - bactGroup[j].position.y, 2));

        if (distance <= 40) {
          lazers.splice(i, 1);

          if (bactGroup[j].getAnimationLabel() == 't1-normal') {
            bactGroup[j].changeAnimation('t1-explosion');
          }

          if (bactGroup[j].getAnimationLabel() == 't2-normal') {
            bactGroup[j].changeAnimation('t2-explosion');
          }

          if (bactGroup[j].getAnimationLabel() == 't3-normal') {
            bactGroup[j].changeAnimation('t3-explosion');
          }

          explosionStart = 9;
          bactGroup[j].animationDelay = 0;
          console.log(bactGroup[j].animationDelay);
          bactGroup[j].life = 30;
          bactSound.play();
          break;
        }
      }
    }
  }
} // Nutrients here


function generateNutrSprite(t) {
  var x = getRnd(innerWidth * 0.17, innerWidth - innerWidth * 0.18);
  var y = getRnd(0, 50);
  var spr = createSprite(x, y);
  spr.velocity.y = getRnd(1, 2);
  t = getRnd(0, 1);

  if (t == 0) {
    spr.addAnimation('circle', "../assets/circle/circle.png");
    spr.addAnimation('circle-explosion', "../assets/circle/circle-1.png", "../assets/circle/circle-2.png", "../assets/circle/circle-3.png", "../assets/circle/circle-4.png", "../assets/circle/circle-5.png", "../assets/circle/circle-6.png", "../assets/circle/circle-7.png", "../assets/circle/circle-8.png", "../assets/circle/circle-9.png", "../assets/circle/circle-10.png", "../assets/circle/circle-11.png", "../assets/circle/circle-12.png");
    spr.changeAnimation('circle');
    spr.frameDelay = 0;
  } else {
    spr.addAnimation('triangle', "../assets/triangle/triangle.png");
    spr.addAnimation('triangle-explosion', "../assets/triangle/triangle-1.png", "../assets/triangle/triangle-2.png", "../assets/triangle/triangle-3.png", "../assets/triangle/triangle-4.png", "../assets/triangle/triangle-5.png", "../assets/triangle/triangle-6.png", "../assets/triangle/triangle-7.png", "../assets/triangle/triangle-8.png", "../assets/triangle/triangle-9.png", "../assets/triangle/triangle-10.png", "../assets/triangle/triangle-11.png", "../assets/triangle/triangle-12.png");
    spr.changeAnimation('triangle');
    spr.scale = 0.7;
    spr.frameDelay = 0;
  }

  return spr;
}

function updateNutrients() {
  for (var p = nutrGroup.length - 1; p >= 0; p--) {
    if (nutrGroup[p].overlap(ship.sprite)) {
      if (ship.sprite.getAnimationLabel() == 'beamC' && nutrGroup[p].getAnimationLabel() == 'circle') {
        nutrGroup[p].changeAnimation('circle-explosion');
        nutrGroup[p].life = 30; //barWidth+=5;

        var spr = createSprite(curNutX, curNutY);
        spr.addAnimation('normal', "../assets/circle/circle.png");
        currentNutrients.add(spr);
        curNutX += 60;
      }

      if (ship.sprite.getAnimationLabel() == 'beamTr' && nutrGroup[p].getAnimationLabel() == 'triangle') {
        nutrGroup[p].changeAnimation('triangle-explosion');
        nutrGroup[p].life = 30; //barWidth+=5;

        var _spr = createSprite(curNutX, curNutY);

        _spr.addAnimation('normal', "../assets/triangle/triangle.png");

        currentNutrients.add(_spr);
        curNutX += 60;
      }
    }

    if (nutrGroup[p].position.y > innerHeight * 0.8) {
      nutrGroup[p].life = 0;
    }
  }
}

function bacNutrOverlap() {
  for (var j = nutrGroup.length - 1; j >= 0; j--) {
    for (var i = bactGroup.length - 1; i >= 0; i--) {
      if (nutrGroup[j].overlap(bactGroup[i])) {
        bactGroup[i].scale += 0.1;
        nutrGroup[j].remove();
        break;
      }
    }
  }
} // Got the list of ports

/*function gotList(thelist) {
  print("List of Serial Ports:");
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
    print(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  print("Serial Port is Open");
}

function gotClose(){
    print("Serial Port is Closed");
    latestData = "Serial Port is Closed";
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  print(theerror);
}

// There is data available to work with from the serial port
function gotData() {
  let latestData = serial.readString().trim();  // read the incoming string
  if( latestData !== '') {
    sensor_data = sensor_data.concat(latestData);
  } else {
    sensor_data = '';
  }
}*/
},{}],"../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53559" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","pizza.js"], null)
//# sourceMappingURL=/pizza.43529a85.js.map