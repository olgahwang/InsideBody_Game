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
})({"Focm":[function(require,module,exports) {
var currentScreen = document.getElementById("onboarding1");
var chosenLevel = 0;
var cur = 0;

function showFirstPage() {
  currentScreen = document.getElementById("onboarding1");
  currentScreen.style.display = "flex";
  var wrapperDiv = document.getElementById("onboardingWrapper");
  wrapperDiv.style.display = "flex";
  cur++;
}

function showSecondPage() {
  currentScreen.style.display = "none";
  currentScreen = document.getElementById("onboarding2");
  currentScreen.style.display = "flex";
  cur++;
}

function showThirdPage() {
  currentScreen.style.display = "none";
  currentScreen = document.getElementById("onboarding3");
  currentScreen.style.display = "flex";
  cur++;
}

function startClicked() {
  var oldBg = document.getElementById("mainMenuDiv");
  oldBg.style.display = "none";
  showFirstPage();
}

function pizzaChosen() {
  chosenLevel = 1;
  var pizza = document.getElementById("pizzaLevel");
  pizza.style.boxShadow = "0px 0px 0px 4px #5FAD56";
  var salad = document.getElementById("saladLevel");
  salad.style.boxShadow = "0px 0px 0px 0px";
}

function saladChosen() {
  chosenLevel = 0;
  var salad = document.getElementById("saladLevel");
  salad.style.boxShadow = "0px 0px 0px 4px #5FAD56";
  var pizza = document.getElementById("pizzaLevel");
  pizza.style.boxShadow = "0px 0px 0px 0px";
}

function continueToGame() {
  if (chosenLevel == 0) {
    window.location.href = './pizza.html';
    console.log("Pizza");
  } else {
    if (chosenLevel == 1) {
      window.location.href = './salad.html';
      console.log("Salad");
    }
  }
}

document.addEventListener('keypress', function (event) {
  if (event.keyCode == 49) {
    console.log("1 pressed");

    if (chosenLevel == 0) {
      chosenLevel = 1;
      pizzaChosen();
    } else if (chosenLevel == 1) {
      chosenLevel = 0;
      saladChosen();
    }
  }

  if (event.keyCode == 51) {
    if (cur == 0) {
      startClicked();
    } else if (cur == 1) {
      showSecondPage();
    } else if (cur == 2) {
      showThirdPage();
    } else if (cur == 3) {
      continueToGame();
    }
  }
});
},{}]},{},["Focm"], null)
//# sourceMappingURL=https://olgahwang.github.io/InsideBody_Game/src.0600a096.js.map