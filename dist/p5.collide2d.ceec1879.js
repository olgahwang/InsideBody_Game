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
})({"../lib/p5.collide2d.js":[function(require,module,exports) {
/*
Repo: https://github.com/bmoren/p5.collide2D/
Created by http://benmoren.com
Some functions and code modified version from http://www.jeffreythompson.org/collision-detection
Version 0.6 | Nov 28th, 2018
CC BY-NC-SA 4.0
*/
console.log("### p5.collide ###");
p5.prototype._collideDebug = false;

p5.prototype.collideDebug = function (debugMode) {
  _collideDebug = debugMode;
};
/*~++~+~+~++~+~++~++~+~+~ 2D ~+~+~++~+~++~+~+~+~+~+~+~+~+~+~+*/


p5.prototype.collideRectRect = function (x, y, w, h, x2, y2, w2, h2) {
  //2d
  //add in a thing to detect rectMode CENTER
  if (x + w >= x2 && // r1 right edge past r2 left
  x <= x2 + w2 && // r1 left edge past r2 right
  y + h >= y2 && // r1 top edge past r2 bottom
  y <= y2 + h2) {
    // r1 bottom edge past r2 top
    return true;
  }

  return false;
};

p5.prototype.collideRectCircle = function (rx, ry, rw, rh, cx, cy, diameter) {
  //2d
  // temporary variables to set edges for testing
  var testX = cx;
  var testY = cy; // which edge is closest?

  if (cx < rx) {
    testX = rx; // left edge
  } else if (cx > rx + rw) {
    testX = rx + rw;
  } // right edge


  if (cy < ry) {
    testY = ry; // top edge
  } else if (cy > ry + rh) {
    testY = ry + rh;
  } // bottom edge
  // // get distance from closest edges


  var distance = this.dist(cx, cy, testX, testY); // if the distance is less than the radius, collision!

  if (distance <= diameter / 2) {
    return true;
  }

  return false;
};

p5.prototype.collideCircleCircle = function (x, y, d, x2, y2, d2) {
  //2d
  if (this.dist(x, y, x2, y2) <= d / 2 + d2 / 2) {
    return true;
  }

  return false;
};

p5.prototype.collidePointCircle = function (x, y, cx, cy, d) {
  //2d
  if (this.dist(x, y, cx, cy) <= d / 2) {
    return true;
  }

  return false;
};

p5.prototype.collidePointEllipse = function (x, y, cx, cy, dx, dy) {
  //2d
  var rx = dx / 2,
      ry = dy / 2; // Discarding the points outside the bounding box

  if (x > cx + rx || x < cx - rx || y > cy + ry || y < cy - ry) {
    return false;
  } // Compare the point to its equivalent on the ellipse


  var xx = x - cx,
      yy = y - cy;
  var eyy = ry * this.sqrt(this.abs(rx * rx - xx * xx)) / rx;
  return yy <= eyy && yy >= -eyy;
};

p5.prototype.collidePointRect = function (pointX, pointY, x, y, xW, yW) {
  //2d
  if (pointX >= x && // right of the left edge AND
  pointX <= x + xW && // left of the right edge AND
  pointY >= y && // below the top AND
  pointY <= y + yW) {
    // above the bottom
    return true;
  }

  return false;
};

p5.prototype.collidePointLine = function (px, py, x1, y1, x2, y2, buffer) {
  // get distance from the point to the two ends of the line
  var d1 = this.dist(px, py, x1, y1);
  var d2 = this.dist(px, py, x2, y2); // get the length of the line

  var lineLen = this.dist(x1, y1, x2, y2); // since floats are so minutely accurate, add a little buffer zone that will give collision

  if (buffer === undefined) {
    buffer = 0.1;
  } // higher # = less accurate
  // if the two distances are equal to the line's length, the point is on the line!
  // note we use the buffer here to give a range, rather than one #


  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
    return true;
  }

  return false;
};

p5.prototype.collideLineCircle = function (x1, y1, x2, y2, cx, cy, diameter) {
  // is either end INSIDE the circle?
  // if so, return true immediately
  var inside1 = this.collidePointCircle(x1, y1, cx, cy, diameter);
  var inside2 = this.collidePointCircle(x2, y2, cx, cy, diameter);
  if (inside1 || inside2) return true; // get length of the line

  var distX = x1 - x2;
  var distY = y1 - y2;
  var len = this.sqrt(distX * distX + distY * distY); // get dot product of the line and circle

  var dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / this.pow(len, 2); // find the closest point on the line

  var closestX = x1 + dot * (x2 - x1);
  var closestY = y1 + dot * (y2 - y1); // is this point actually on the line segment?
  // if so keep going, but if not, return false

  var onSegment = this.collidePointLine(closestX, closestY, x1, y1, x2, y2);
  if (!onSegment) return false; // draw a debug circle at the closest point on the line

  if (this._collideDebug) {
    this.ellipse(closestX, closestY, 10, 10);
  } // get distance to closest point


  distX = closestX - cx;
  distY = closestY - cy;
  var distance = this.sqrt(distX * distX + distY * distY);

  if (distance <= diameter / 2) {
    return true;
  }

  return false;
};

p5.prototype.collideLineLine = function (x1, y1, x2, y2, x3, y3, x4, y4, calcIntersection) {
  var intersection; // calculate the distance to intersection point

  var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)); // if uA and uB are between 0-1, lines are colliding

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    if (this._collideDebug || calcIntersection) {
      // calc the point where the lines meet
      var intersectionX = x1 + uA * (x2 - x1);
      var intersectionY = y1 + uA * (y2 - y1);
    }

    if (this._collideDebug) {
      this.ellipse(intersectionX, intersectionY, 10, 10);
    }

    if (calcIntersection) {
      intersection = {
        "x": intersectionX,
        "y": intersectionY
      };
      return intersection;
    } else {
      return true;
    }
  }

  if (calcIntersection) {
    intersection = {
      "x": false,
      "y": false
    };
    return intersection;
  }

  return false;
};

p5.prototype.collideLineRect = function (x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {
  // check if the line has hit any of the rectangle's sides. uses the collideLineLine function above
  var left, right, top, bottom, intersection;

  if (calcIntersection) {
    left = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh, true);
    right = this.collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh, true);
    top = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry, true);
    bottom = this.collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh, true);
    intersection = {
      "left": left,
      "right": right,
      "top": top,
      "bottom": bottom
    };
  } else {
    //return booleans
    left = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
    right = this.collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
    top = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
    bottom = this.collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);
  } // if ANY of the above are true, the line has hit the rectangle


  if (left || right || top || bottom) {
    if (calcIntersection) {
      return intersection;
    }

    return true;
  }

  return false;
};

p5.prototype.collidePointPoly = function (px, py, vertices) {
  var collision = false; // go through each of the vertices, plus the next vertex in the list

  var next = 0;

  for (var current = 0; current < vertices.length; current++) {
    // get next vertex in list if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == vertices.length) next = 0; // get the PVectors at our current position this makes our if statement a little cleaner

    var vc = vertices[current]; // c for "current"

    var vn = vertices[next]; // n for "next"
    // compare position, flip 'collision' variable back and forth

    if ((vc.y > py && vn.y < py || vc.y < py && vn.y > py) && px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x) {
      collision = !collision;
    }
  }

  return collision;
}; // POLYGON/CIRCLE


p5.prototype.collideCirclePoly = function (cx, cy, diameter, vertices, interior) {
  if (interior == undefined) {
    interior = false;
  } // go through each of the vertices, plus the next vertex in the list


  var next = 0;

  for (var current = 0; current < vertices.length; current++) {
    // get next vertex in list if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == vertices.length) next = 0; // get the PVectors at our current position this makes our if statement a little cleaner

    var vc = vertices[current]; // c for "current"

    var vn = vertices[next]; // n for "next"
    // check for collision between the circle and a line formed between the two vertices

    var collision = this.collideLineCircle(vc.x, vc.y, vn.x, vn.y, cx, cy, diameter);
    if (collision) return true;
  } // test if the center of the circle is inside the polygon


  if (interior == true) {
    var centerInside = this.collidePointPoly(cx, cy, vertices);
    if (centerInside) return true;
  } // otherwise, after all that, return false


  return false;
};

p5.prototype.collideRectPoly = function (rx, ry, rw, rh, vertices, interior) {
  if (interior == undefined) {
    interior = false;
  } // go through each of the vertices, plus the next vertex in the list


  var next = 0;

  for (var current = 0; current < vertices.length; current++) {
    // get next vertex in list if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == vertices.length) next = 0; // get the PVectors at our current position this makes our if statement a little cleaner

    var vc = vertices[current]; // c for "current"

    var vn = vertices[next]; // n for "next"
    // check against all four sides of the rectangle

    var collision = this.collideLineRect(vc.x, vc.y, vn.x, vn.y, rx, ry, rw, rh);
    if (collision) return true; // optional: test if the rectangle is INSIDE the polygon note that this iterates all sides of the polygon again, so only use this if you need to

    if (interior == true) {
      var inside = this.collidePointPoly(rx, ry, vertices);
      if (inside) return true;
    }
  }

  return false;
};

p5.prototype.collideLinePoly = function (x1, y1, x2, y2, vertices) {
  // go through each of the vertices, plus the next vertex in the list
  var next = 0;

  for (var current = 0; current < vertices.length; current++) {
    // get next vertex in list if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == vertices.length) next = 0; // get the PVectors at our current position extract X/Y coordinates from each

    var x3 = vertices[current].x;
    var y3 = vertices[current].y;
    var x4 = vertices[next].x;
    var y4 = vertices[next].y; // do a Line/Line comparison if true, return 'true' immediately and stop testing (faster)

    var hit = this.collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4);

    if (hit) {
      return true;
    }
  } // never got a hit


  return false;
};

p5.prototype.collidePolyPoly = function (p1, p2, interior) {
  if (interior == undefined) {
    interior = false;
  } // go through each of the vertices, plus the next vertex in the list


  var next = 0;

  for (var current = 0; current < p1.length; current++) {
    // get next vertex in list, if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == p1.length) next = 0; // get the PVectors at our current position this makes our if statement a little cleaner

    var vc = p1[current]; // c for "current"

    var vn = p1[next]; // n for "next"
    //use these two points (a line) to compare to the other polygon's vertices using polyLine()

    var collision = this.collideLinePoly(vc.x, vc.y, vn.x, vn.y, p2);
    if (collision) return true; //check if the 2nd polygon is INSIDE the first

    if (interior == true) {
      collision = this.collidePointPoly(p2[0].x, p2[0].y, p1);
      if (collision) return true;
    }
  }

  return false;
};

p5.prototype.collidePointTriangle = function (px, py, x1, y1, x2, y2, x3, y3) {
  // get the area of the triangle
  var areaOrig = this.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)); // get the area of 3 triangles made between the point and the corners of the triangle

  var area1 = this.abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py));
  var area2 = this.abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py));
  var area3 = this.abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py)); // if the sum of the three areas equals the original, we're inside the triangle!

  if (area1 + area2 + area3 == areaOrig) {
    return true;
  }

  return false;
};

p5.prototype.collidePointPoint = function (x, y, x2, y2, buffer) {
  if (buffer == undefined) {
    buffer = 0;
  }

  if (this.dist(x, y, x2, y2) <= buffer) {
    return true;
  }

  return false;
};

p5.prototype.collidePointArc = function (px, py, ax, ay, arcRadius, arcHeading, arcAngle, buffer) {
  if (buffer == undefined) {
    buffer = 0;
  } // point


  var point = this.createVector(px, py); // arc center point

  var arcPos = this.createVector(ax, ay); // arc radius vector

  var radius = this.createVector(arcRadius, 0).rotate(arcHeading);
  var pointToArc = point.copy().sub(arcPos);

  if (point.dist(arcPos) <= arcRadius + buffer) {
    var dot = radius.dot(pointToArc);
    var angle = radius.angleBetween(pointToArc);

    if (dot > 0 && angle <= arcAngle / 2 && angle >= -arcAngle / 2) {
      return true;
    }
  }

  return false;
};
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51892" + '/');

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
},{}]},{},["../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../lib/p5.collide2d.js"], null)
//# sourceMappingURL=/p5.collide2d.ceec1879.js.map