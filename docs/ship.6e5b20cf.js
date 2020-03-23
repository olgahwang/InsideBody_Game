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
})({"iqpj":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Ship = /*#__PURE__*/function () {
  function Ship(shipImage, x, y) {
    _classCallCheck(this, Ship);

    this.x = x;
    this.y = y;
    this.trashNum = 0;
    this.shipMain = createSprite(this.x, this.y);
    this.shipMain.addAnimation('normal', "../assets/char2.png");
    this.shipMain.addAnimation('beamC', "../assets/new/claw-triangle.png");
    this.shipMain.addAnimation('beamTr', "../assets/new/claw-circle.png");
    this.shipMain.addAnimation('zap', "../assets/new/claw-square.png");
    this.shootDelay = 0;
    this.maxShootDelay = firingRate;
    this.beamTrLife = 0;
    this.beamCLife = 0;
    this.sprite = this.shipMain;
    this.easing = 0.05;
  }

  _createClass(Ship, [{
    key: "draw",
    value: function draw(a) {
      if (this.beamTrLife > 0) {
        this.beamTrLife--;
      }

      if (this.beamCLife > 0) {
        this.beamCLife--;
      }

      if (this.beamTrLife == 0 && this.beamCLife == 0) {
        this.shipMain.changeAnimation('normal');
      }

      if (this.shootDelay > 0) {
        this.shootDelay--;
      }

      push();

      if (keyIsDown(LEFT_ARROW)) {
        if (this.x >= innerWidth * 0.15) {
          this.x -= 10;
        }
      }

      if (keyIsDown(RIGHT_ARROW)) {
        if (this.x <= innerWidth - innerWidth * 0.15) {
          this.x += 10;
        }
      }

      if (keyIsDown(51)) {
        if (this.shootDelay === 0) {
          this.shipMain.changeAnimation('zap');
          this.shootDelay = this.maxShootDelay;
          lazers.push(new Lazer(this.x + 35, this.y));
          zapSound.play();
        }
      }

      if (keyIsDown(49)) {
        if (this.beamTrLife == 0) {
          this.shipMain.changeAnimation('beamC');
          this.beamCLife = 10;
          beamSound.play();
        }
      }

      if (keyIsDown(50)) {
        if (this.beamCLife == 0) {
          this.shipMain.changeAnimation('beamTr');
          this.beamTrLife = 10;
          beamSound.play();
        }
      }
      /*if (a > 0) {
        //console.log('SENSOR1: ' + a + ' - X: ' + this.x);
        if (this.x >= 5) {
          this.x -= 10;
        }
      }
       if (a < 0) {
        //console.log('SENSOR2: ' + a + ' - X: ' + this.x);
        if (this.x <= (innerWidth - 60)) {
          this.x += 10;
        }
      }*/


      var shipW = 70;
      var shipH = 130;
      this.shipMain.position.x = this.x;
      this.shipMain.position.y = this.y; //image(shipImage, this.x, this.y, shipW, shipH);

      drawSprites();
      pop();
    }
  }, {
    key: "createLazer",
    value: function createLazer() {
      if (this.shootDelay === 0) {
        this.shootDelay = this.maxShootDelay;
        lazers.push(new Lazer(this.x + 35, this.y));
      }
    }
  }, {
    key: "checkOverlap",
    value: function checkOverlap(x) {
      if (this.shipMain.overlap(x)) {
        return true;
      } else return false;
    }
  }]);

  return Ship;
}();
},{}]},{},["iqpj"], null)
//# sourceMappingURL=https://olgahwang.github.io/InsideBody_Game/ship.6e5b20cf.js.map