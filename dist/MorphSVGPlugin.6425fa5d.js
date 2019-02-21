// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
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
  return newRequire;
})({"node_modules/gsap/TweenLite.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventDispatcher = exports.TweenPlugin = exports.Power4 = exports.Power3 = exports.Power2 = exports.Power1 = exports.Power0 = exports.Linear = exports.Ease = exports.Animation = exports.SimpleTimeline = exports.globals = exports.default = exports.TweenLite = exports._gsScope = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * VERSION: 2.1.0
 * DATE: 2019-02-15
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */

/* eslint-disable */

/* ES6 changes:
	- declare and export _gsScope at top.
	- set var TweenLite = the result of the main function
	- export default TweenLite at the bottom
	- return TweenLite at the bottom of the main function
	- pass in _gsScope as the first parameter of the main function (which is actually at the bottom)
	- remove the "export to multiple environments" in Definition().
 */
var _gsScope = typeof window !== "undefined" ? window : typeof module !== "undefined" && module.exports && typeof global !== "undefined" ? global : void 0 || {};

exports._gsScope = _gsScope;

var TweenLite = function (window) {
  "use strict";

  var _exports = {},
      _doc = window.document,
      _globals = window.GreenSockGlobals = window.GreenSockGlobals || window;

  if (_globals.TweenLite) {
    return _globals.TweenLite; //in case the core set of classes is already loaded, don't instantiate twice.
  }

  var _namespace = function _namespace(ns) {
    var a = ns.split("."),
        p = _globals,
        i;

    for (i = 0; i < a.length; i++) {
      p[a[i]] = p = p[a[i]] || {};
    }

    return p;
  },
      gs = _namespace("com.greensock"),
      _tinyNum = 0.00000001,
      _slice = function _slice(a) {
    //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
    var b = [],
        l = a.length,
        i;

    for (i = 0; i !== l; b.push(a[i++])) {}

    return b;
  },
      _emptyFunc = function _emptyFunc() {},
      _isArray = function () {
    //works around issues in iframe environments where the Array global isn't shared, thus if the object originates in a different window/iframe, "(obj instanceof Array)" will evaluate false. We added some speed optimizations to avoid Object.prototype.toString.call() unless it's absolutely necessary because it's VERY slow (like 20x slower)
    var toString = Object.prototype.toString,
        array = toString.call([]);
    return function (obj) {
      return obj != null && (obj instanceof Array || _typeof(obj) === "object" && !!obj.push && toString.call(obj) === array);
    };
  }(),
      a,
      i,
      p,
      _ticker,
      _tickerActive,
      _defLookup = {},

  /**
   * @constructor
   * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
   * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
   * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
   * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
   *
   * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
   * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
   * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
   * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
   * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
   * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
   * sandbox the banner one like:
   *
   * <script>
   *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
   * </script>
   * <script src="js/greensock/v1.7/TweenMax.js"></script>
   * <script>
   *     window.GreenSockGlobals = window._gsQueue = window._gsDefine = null; //reset it back to null (along with the special _gsQueue variable) so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
   * </script>
   * <script src="js/greensock/v1.6/TweenMax.js"></script>
   * <script>
   *     gs.TweenLite.to(...); //would use v1.7
   *     TweenLite.to(...); //would use v1.6
   * </script>
   *
   * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
   * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
   * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
   * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
   */
  Definition = function Definition(ns, dependencies, func, global) {
    this.sc = _defLookup[ns] ? _defLookup[ns].sc : []; //subclasses

    _defLookup[ns] = this;
    this.gsClass = null;
    this.func = func;
    var _classes = [];

    this.check = function (init) {
      var i = dependencies.length,
          missing = i,
          cur,
          a,
          n,
          cl;

      while (--i > -1) {
        if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
          _classes[i] = cur.gsClass;
          missing--;
        } else if (init) {
          cur.sc.push(this);
        }
      }

      if (missing === 0 && func) {
        a = ("com.greensock." + ns).split(".");
        n = a.pop();
        cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes); //exports to multiple environments

        if (global) {
          _globals[n] = _exports[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)

          /*
          if (typeof(module) !== "undefined" && module.exports) { //node
          	if (ns === moduleName) {
          		module.exports = _exports[moduleName] = cl;
          		for (i in _exports) {
          			cl[i] = _exports[i];
          		}
          	} else if (_exports[moduleName]) {
          		_exports[moduleName][n] = cl;
          	}
          } else if (typeof(define) === "function" && define.amd){ //AMD
          	define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").pop(), [], function() { return cl; });
          }
          */
        }

        for (i = 0; i < this.sc.length; i++) {
          this.sc[i].check();
        }
      }
    };

    this.check(true);
  },
      //used to create Definition instances (which basically registers a class that has dependencies).
  _gsDefine = window._gsDefine = function (ns, dependencies, func, global) {
    return new Definition(ns, dependencies, func, global);
  },
      //a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
  _class = gs._class = function (ns, func, global) {
    func = func || function () {};

    _gsDefine(ns, [], function () {
      return func;
    }, global);

    return func;
  };

  _gsDefine.globals = _globals;
  /*
   * ----------------------------------------------------------------
   * Ease
   * ----------------------------------------------------------------
   */

  var _baseParams = [0, 0, 1, 1],
      Ease = _class("easing.Ease", function (func, extraParams, type, power) {
    this._func = func;
    this._type = type || 0;
    this._power = power || 0;
    this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
  }, true),
      _easeMap = Ease.map = {},
      _easeReg = Ease.register = function (ease, names, types, create) {
    var na = names.split(","),
        i = na.length,
        ta = (types || "easeIn,easeOut,easeInOut").split(","),
        e,
        name,
        j,
        type;

    while (--i > -1) {
      name = na[i];
      e = create ? _class("easing." + name, null, true) : gs.easing[name] || {};
      j = ta.length;

      while (--j > -1) {
        type = ta[j];
        _easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
      }
    }
  };

  p = Ease.prototype;
  p._calcEnd = false;

  p.getRatio = function (p) {
    if (this._func) {
      this._params[0] = p;
      return this._func.apply(null, this._params);
    }

    var t = this._type,
        pw = this._power,
        r = t === 1 ? 1 - p : t === 2 ? p : p < 0.5 ? p * 2 : (1 - p) * 2;

    if (pw === 1) {
      r *= r;
    } else if (pw === 2) {
      r *= r * r;
    } else if (pw === 3) {
      r *= r * r * r;
    } else if (pw === 4) {
      r *= r * r * r * r;
    }

    return t === 1 ? 1 - r : t === 2 ? r : p < 0.5 ? r / 2 : 1 - r / 2;
  }; //create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)


  a = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"];
  i = a.length;

  while (--i > -1) {
    p = a[i] + ",Power" + i;

    _easeReg(new Ease(null, null, 1, i), p, "easeOut", true);

    _easeReg(new Ease(null, null, 2, i), p, "easeIn" + (i === 0 ? ",easeNone" : ""));

    _easeReg(new Ease(null, null, 3, i), p, "easeInOut");
  }

  _easeMap.linear = gs.easing.Linear.easeIn;
  _easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks

  /*
   * ----------------------------------------------------------------
   * EventDispatcher
   * ----------------------------------------------------------------
   */

  var EventDispatcher = _class("events.EventDispatcher", function (target) {
    this._listeners = {};
    this._eventTarget = target || this;
  });

  p = EventDispatcher.prototype;

  p.addEventListener = function (type, callback, scope, useParam, priority) {
    priority = priority || 0;
    var list = this._listeners[type],
        index = 0,
        listener,
        i;

    if (this === _ticker && !_tickerActive) {
      _ticker.wake();
    }

    if (list == null) {
      this._listeners[type] = list = [];
    }

    i = list.length;

    while (--i > -1) {
      listener = list[i];

      if (listener.c === callback && listener.s === scope) {
        list.splice(i, 1);
      } else if (index === 0 && listener.pr < priority) {
        index = i + 1;
      }
    }

    list.splice(index, 0, {
      c: callback,
      s: scope,
      up: useParam,
      pr: priority
    });
  };

  p.removeEventListener = function (type, callback) {
    var list = this._listeners[type],
        i;

    if (list) {
      i = list.length;

      while (--i > -1) {
        if (list[i].c === callback) {
          list.splice(i, 1);
          return;
        }
      }
    }
  };

  p.dispatchEvent = function (type) {
    var list = this._listeners[type],
        i,
        t,
        listener;

    if (list) {
      i = list.length;

      if (i > 1) {
        list = list.slice(0); //in case addEventListener() is called from within a listener/callback (otherwise the index could change, resulting in a skip)
      }

      t = this._eventTarget;

      while (--i > -1) {
        listener = list[i];

        if (listener) {
          if (listener.up) {
            listener.c.call(listener.s || t, {
              type: type,
              target: t
            });
          } else {
            listener.c.call(listener.s || t);
          }
        }
      }
    }
  };
  /*
   * ----------------------------------------------------------------
   * Ticker
   * ----------------------------------------------------------------
   */


  var _reqAnimFrame = window.requestAnimationFrame,
      _cancelAnimFrame = window.cancelAnimationFrame,
      _getTime = Date.now || function () {
    return new Date().getTime();
  },
      _lastUpdate = _getTime(); //now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.


  a = ["ms", "moz", "webkit", "o"];
  i = a.length;

  while (--i > -1 && !_reqAnimFrame) {
    _reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
    _cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
  }

  _class("Ticker", function (fps, useRAF) {
    var _self = this,
        _startTime = _getTime(),
        _useRAF = useRAF !== false && _reqAnimFrame ? "auto" : false,
        _lagThreshold = 500,
        _adjustedLag = 33,
        _tickWord = "tick",
        //helps reduce gc burden
    _fps,
        _req,
        _id,
        _gap,
        _nextTime,
        _tick = function _tick(manual) {
      var elapsed = _getTime() - _lastUpdate,
          overlap,
          dispatch;

      if (elapsed > _lagThreshold) {
        _startTime += elapsed - _adjustedLag;
      }

      _lastUpdate += elapsed;
      _self.time = (_lastUpdate - _startTime) / 1000;
      overlap = _self.time - _nextTime;

      if (!_fps || overlap > 0 || manual === true) {
        _self.frame++;
        _nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
        dispatch = true;
      }

      if (manual !== true) {
        //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
        _id = _req(_tick);
      }

      if (dispatch) {
        _self.dispatchEvent(_tickWord);
      }
    };

    EventDispatcher.call(_self);
    _self.time = _self.frame = 0;

    _self.tick = function () {
      _tick(true);
    };

    _self.lagSmoothing = function (threshold, adjustedLag) {
      if (!arguments.length) {
        //if lagSmoothing() is called with no arguments, treat it like a getter that returns a boolean indicating if it's enabled or not. This is purposely undocumented and is for internal use.
        return _lagThreshold < 1 / _tinyNum;
      }

      _lagThreshold = threshold || 1 / _tinyNum; //zero should be interpreted as basically unlimited

      _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
    };

    _self.sleep = function () {
      if (_id == null) {
        return;
      }

      if (!_useRAF || !_cancelAnimFrame) {
        clearTimeout(_id);
      } else {
        _cancelAnimFrame(_id);
      }

      _req = _emptyFunc;
      _id = null;

      if (_self === _ticker) {
        _tickerActive = false;
      }
    };

    _self.wake = function (seamless) {
      if (_id !== null) {
        _self.sleep();
      } else if (seamless) {
        _startTime += -_lastUpdate + (_lastUpdate = _getTime());
      } else if (_self.frame > 10) {
        //don't trigger lagSmoothing if we're just waking up, and make sure that at least 10 frames have elapsed because of the iOS bug that we work around below with the 1.5-second setTimout().
        _lastUpdate = _getTime() - _lagThreshold + 5;
      }

      _req = _fps === 0 ? _emptyFunc : !_useRAF || !_reqAnimFrame ? function (f) {
        return setTimeout(f, (_nextTime - _self.time) * 1000 + 1 | 0);
      } : _reqAnimFrame;

      if (_self === _ticker) {
        _tickerActive = true;
      }

      _tick(2);
    };

    _self.fps = function (value) {
      if (!arguments.length) {
        return _fps;
      }

      _fps = value;
      _gap = 1 / (_fps || 60);
      _nextTime = this.time + _gap;

      _self.wake();
    };

    _self.useRAF = function (value) {
      if (!arguments.length) {
        return _useRAF;
      }

      _self.sleep();

      _useRAF = value;

      _self.fps(_fps);
    };

    _self.fps(fps); //a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.


    setTimeout(function () {
      if (_useRAF === "auto" && _self.frame < 5 && (_doc || {}).visibilityState !== "hidden") {
        _self.useRAF(false);
      }
    }, 1500);
  });

  p = gs.Ticker.prototype = new gs.events.EventDispatcher();
  p.constructor = gs.Ticker;
  /*
   * ----------------------------------------------------------------
   * Animation
   * ----------------------------------------------------------------
   */

  var Animation = _class("core.Animation", function (duration, vars) {
    this.vars = vars = vars || {};
    this._duration = this._totalDuration = duration || 0;
    this._delay = Number(vars.delay) || 0;
    this._timeScale = 1;
    this._active = !!vars.immediateRender;
    this.data = vars.data;
    this._reversed = !!vars.reversed;

    if (!_rootTimeline) {
      return;
    }

    if (!_tickerActive) {
      //some browsers (like iOS 6 Safari) shut down JavaScript execution when the tab is disabled and they [occasionally] neglect to start up requestAnimationFrame again when returning - this code ensures that the engine starts up again properly.
      _ticker.wake();
    }

    var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
    tl.add(this, tl._time);

    if (this.vars.paused) {
      this.paused(true);
    }
  });

  _ticker = Animation.ticker = new gs.Ticker();
  p = Animation.prototype;
  p._dirty = p._gc = p._initted = p._paused = false;
  p._totalTime = p._time = 0;
  p._rawPrevTime = -1;
  p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
  p._paused = false; //some browsers (like iOS) occasionally drop the requestAnimationFrame event when the user switches to a different tab and then comes back again, so we use a 2-second setTimeout() to sense if/when that condition occurs and then wake() the ticker.

  var _checkTimeout = function _checkTimeout() {
    if (_tickerActive && _getTime() - _lastUpdate > 2000 && ((_doc || {}).visibilityState !== "hidden" || !_ticker.lagSmoothing())) {
      //note: if the tab is hidden, we should still wake if lagSmoothing has been disabled.
      _ticker.wake();
    }

    var t = setTimeout(_checkTimeout, 2000);

    if (t.unref) {
      // allows a node process to exit even if the timeout’s callback hasn't been invoked. Without it, the node process could hang as this function is called every two seconds.
      t.unref();
    }
  };

  _checkTimeout();

  p.play = function (from, suppressEvents) {
    if (from != null) {
      this.seek(from, suppressEvents);
    }

    return this.reversed(false).paused(false);
  };

  p.pause = function (atTime, suppressEvents) {
    if (atTime != null) {
      this.seek(atTime, suppressEvents);
    }

    return this.paused(true);
  };

  p.resume = function (from, suppressEvents) {
    if (from != null) {
      this.seek(from, suppressEvents);
    }

    return this.paused(false);
  };

  p.seek = function (time, suppressEvents) {
    return this.totalTime(Number(time), suppressEvents !== false);
  };

  p.restart = function (includeDelay, suppressEvents) {
    return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, suppressEvents !== false, true);
  };

  p.reverse = function (from, suppressEvents) {
    if (from != null) {
      this.seek(from || this.totalDuration(), suppressEvents);
    }

    return this.reversed(true).paused(false);
  };

  p.render = function (time, suppressEvents, force) {//stub - we override this method in subclasses.
  };

  p.invalidate = function () {
    this._time = this._totalTime = 0;
    this._initted = this._gc = false;
    this._rawPrevTime = -1;

    if (this._gc || !this.timeline) {
      this._enabled(true);
    }

    return this;
  };

  p.isActive = function () {
    var tl = this._timeline,
        //the 2 root timelines won't have a _timeline; they're always active.
    startTime = this._startTime,
        rawTime;
    return !tl || !this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime(true)) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale - _tinyNum;
  };

  p._enabled = function (enabled, ignoreTimeline) {
    if (!_tickerActive) {
      _ticker.wake();
    }

    this._gc = !enabled;
    this._active = this.isActive();

    if (ignoreTimeline !== true) {
      if (enabled && !this.timeline) {
        this._timeline.add(this, this._startTime - this._delay);
      } else if (!enabled && this.timeline) {
        this._timeline._remove(this, true);
      }
    }

    return false;
  };

  p._kill = function (vars, target) {
    return this._enabled(false, false);
  };

  p.kill = function (vars, target) {
    this._kill(vars, target);

    return this;
  };

  p._uncache = function (includeSelf) {
    var tween = includeSelf ? this : this.timeline;

    while (tween) {
      tween._dirty = true;
      tween = tween.timeline;
    }

    return this;
  };

  p._swapSelfInParams = function (params) {
    var i = params.length,
        copy = params.concat();

    while (--i > -1) {
      if (params[i] === "{self}") {
        copy[i] = this;
      }
    }

    return copy;
  };

  p._callback = function (type) {
    var v = this.vars,
        callback = v[type],
        params = v[type + "Params"],
        scope = v[type + "Scope"] || v.callbackScope || this,
        l = params ? params.length : 0;

    switch (l) {
      //speed optimization; call() is faster than apply() so use it when there are only a few parameters (which is by far most common). Previously we simply did var v = this.vars; v[type].apply(v[type + "Scope"] || v.callbackScope || this, v[type + "Params"] || _blankArray);
      case 0:
        callback.call(scope);
        break;

      case 1:
        callback.call(scope, params[0]);
        break;

      case 2:
        callback.call(scope, params[0], params[1]);
        break;

      default:
        callback.apply(scope, params);
    }
  }; //----Animation getters/setters --------------------------------------------------------


  p.eventCallback = function (type, callback, params, scope) {
    if ((type || "").substr(0, 2) === "on") {
      var v = this.vars;

      if (arguments.length === 1) {
        return v[type];
      }

      if (callback == null) {
        delete v[type];
      } else {
        v[type] = callback;
        v[type + "Params"] = _isArray(params) && params.join("").indexOf("{self}") !== -1 ? this._swapSelfInParams(params) : params;
        v[type + "Scope"] = scope;
      }

      if (type === "onUpdate") {
        this._onUpdate = callback;
      }
    }

    return this;
  };

  p.delay = function (value) {
    if (!arguments.length) {
      return this._delay;
    }

    if (this._timeline.smoothChildTiming) {
      this.startTime(this._startTime + value - this._delay);
    }

    this._delay = value;
    return this;
  };

  p.duration = function (value) {
    if (!arguments.length) {
      this._dirty = false;
      return this._duration;
    }

    this._duration = this._totalDuration = value;

    this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.


    if (this._timeline.smoothChildTiming) if (this._time > 0) if (this._time < this._duration) if (value !== 0) {
      this.totalTime(this._totalTime * (value / this._duration), true);
    }
    return this;
  };

  p.totalDuration = function (value) {
    this._dirty = false;
    return !arguments.length ? this._totalDuration : this.duration(value);
  };

  p.time = function (value, suppressEvents) {
    if (!arguments.length) {
      return this._time;
    }

    if (this._dirty) {
      this.totalDuration();
    }

    return this.totalTime(value > this._duration ? this._duration : value, suppressEvents);
  };

  p.totalTime = function (time, suppressEvents, uncapped) {
    if (!_tickerActive) {
      _ticker.wake();
    }

    if (!arguments.length) {
      return this._totalTime;
    }

    if (this._timeline) {
      if (time < 0 && !uncapped) {
        time += this.totalDuration();
      }

      if (this._timeline.smoothChildTiming) {
        if (this._dirty) {
          this.totalDuration();
        }

        var totalDuration = this._totalDuration,
            tl = this._timeline;

        if (time > totalDuration && !uncapped) {
          time = totalDuration;
        }

        this._startTime = (this._paused ? this._pauseTime : tl._time) - (!this._reversed ? time : totalDuration - time) / this._timeScale;

        if (!tl._dirty) {
          //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
          this._uncache(false);
        } //in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The startTime of that child would get pushed out, but one of the ancestors may have completed.


        if (tl._timeline) {
          while (tl._timeline) {
            if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
              tl.totalTime(tl._totalTime, true);
            }

            tl = tl._timeline;
          }
        }
      }

      if (this._gc) {
        this._enabled(true, false);
      }

      if (this._totalTime !== time || this._duration === 0) {
        if (_lazyTweens.length) {
          _lazyRender();
        }

        this.render(time, suppressEvents, false);

        if (_lazyTweens.length) {
          //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
          _lazyRender();
        }
      }
    }

    return this;
  };

  p.progress = p.totalProgress = function (value, suppressEvents) {
    var duration = this.duration();
    return !arguments.length ? duration ? this._time / duration : this.ratio : this.totalTime(duration * value, suppressEvents);
  };

  p.startTime = function (value) {
    if (!arguments.length) {
      return this._startTime;
    }

    if (value !== this._startTime) {
      this._startTime = value;
      if (this.timeline) if (this.timeline._sortChildren) {
        this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
      }
    }

    return this;
  };

  p.endTime = function (includeRepeats) {
    return this._startTime + (includeRepeats != false ? this.totalDuration() : this.duration()) / this._timeScale;
  };

  p.timeScale = function (value) {
    if (!arguments.length) {
      return this._timeScale;
    }

    var pauseTime, t;
    value = value || _tinyNum; //can't allow zero because it'll throw the math off

    if (this._timeline && this._timeline.smoothChildTiming) {
      pauseTime = this._pauseTime;
      t = pauseTime || pauseTime === 0 ? pauseTime : this._timeline.totalTime();
      this._startTime = t - (t - this._startTime) * this._timeScale / value;
    }

    this._timeScale = value;
    t = this.timeline;

    while (t && t.timeline) {
      //must update the duration/totalDuration of all ancestor timelines immediately in case in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
      t._dirty = true;
      t.totalDuration();
      t = t.timeline;
    }

    return this;
  };

  p.reversed = function (value) {
    if (!arguments.length) {
      return this._reversed;
    }

    if (value != this._reversed) {
      this._reversed = value;
      this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, true);
    }

    return this;
  };

  p.paused = function (value) {
    if (!arguments.length) {
      return this._paused;
    }

    var tl = this._timeline,
        raw,
        elapsed;
    if (value != this._paused) if (tl) {
      if (!_tickerActive && !value) {
        _ticker.wake();
      }

      raw = tl.rawTime();
      elapsed = raw - this._pauseTime;

      if (!value && tl.smoothChildTiming) {
        this._startTime += elapsed;

        this._uncache(false);
      }

      this._pauseTime = value ? raw : null;
      this._paused = value;
      this._active = this.isActive();

      if (!value && elapsed !== 0 && this._initted && this.duration()) {
        raw = tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale;
        this.render(raw, raw === this._totalTime, true); //in case the target's properties changed via some other tween or manual update by the user, we should force a render.
      }
    }

    if (this._gc && !value) {
      this._enabled(true, false);
    }

    return this;
  };
  /*
   * ----------------------------------------------------------------
   * SimpleTimeline
   * ----------------------------------------------------------------
   */


  var SimpleTimeline = _class("core.SimpleTimeline", function (vars) {
    Animation.call(this, 0, vars);
    this.autoRemoveChildren = this.smoothChildTiming = true;
  });

  p = SimpleTimeline.prototype = new Animation();
  p.constructor = SimpleTimeline;
  p.kill()._gc = false;
  p._first = p._last = p._recent = null;
  p._sortChildren = false;

  p.add = p.insert = function (child, position, align, stagger) {
    var prevTween, st;
    child._startTime = Number(position || 0) + child._delay;
    if (child._paused) if (this !== child._timeline) {
      //we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order).
      child._pauseTime = this.rawTime() - (child._timeline.rawTime() - child._pauseTime);
    }

    if (child.timeline) {
      child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.

    }

    child.timeline = child._timeline = this;

    if (child._gc) {
      child._enabled(true, true);
    }

    prevTween = this._last;

    if (this._sortChildren) {
      st = child._startTime;

      while (prevTween && prevTween._startTime > st) {
        prevTween = prevTween._prev;
      }
    }

    if (prevTween) {
      child._next = prevTween._next;
      prevTween._next = child;
    } else {
      child._next = this._first;
      this._first = child;
    }

    if (child._next) {
      child._next._prev = child;
    } else {
      this._last = child;
    }

    child._prev = prevTween;
    this._recent = child;

    if (this._timeline) {
      this._uncache(true);
    }

    return this;
  };

  p._remove = function (tween, skipDisable) {
    if (tween.timeline === this) {
      if (!skipDisable) {
        tween._enabled(false, true);
      }

      if (tween._prev) {
        tween._prev._next = tween._next;
      } else if (this._first === tween) {
        this._first = tween._next;
      }

      if (tween._next) {
        tween._next._prev = tween._prev;
      } else if (this._last === tween) {
        this._last = tween._prev;
      }

      tween._next = tween._prev = tween.timeline = null;

      if (tween === this._recent) {
        this._recent = this._last;
      }

      if (this._timeline) {
        this._uncache(true);
      }
    }

    return this;
  };

  p.render = function (time, suppressEvents, force) {
    var tween = this._first,
        next;
    this._totalTime = this._time = this._rawPrevTime = time;

    while (tween) {
      next = tween._next; //record it here because the value could change after rendering...

      if (tween._active || time >= tween._startTime && !tween._paused && !tween._gc) {
        if (!tween._reversed) {
          tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
        } else {
          tween.render((!tween._dirty ? tween._totalDuration : tween.totalDuration()) - (time - tween._startTime) * tween._timeScale, suppressEvents, force);
        }
      }

      tween = next;
    }
  };

  p.rawTime = function () {
    if (!_tickerActive) {
      _ticker.wake();
    }

    return this._totalTime;
  };
  /*
   * ----------------------------------------------------------------
   * TweenLite
   * ----------------------------------------------------------------
   */


  var TweenLite = _class("TweenLite", function (target, duration, vars) {
    Animation.call(this, duration, vars);
    this.render = TweenLite.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)

    if (target == null) {
      throw "Cannot tween a null target.";
    }

    this.target = target = typeof target !== "string" ? target : TweenLite.selector(target) || target;
    var isSelector = target.jquery || target.length && target !== window && target[0] && (target[0] === window || target[0].nodeType && target[0].style && !target.nodeType),
        overwrite = this.vars.overwrite,
        i,
        targ,
        targets;
    this._overwrite = overwrite = overwrite == null ? _overwriteLookup[TweenLite.defaultOverwrite] : typeof overwrite === "number" ? overwrite >> 0 : _overwriteLookup[overwrite];

    if ((isSelector || target instanceof Array || target.push && _isArray(target)) && typeof target[0] !== "number") {
      this._targets = targets = _slice(target); //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()

      this._propLookup = [];
      this._siblings = [];

      for (i = 0; i < targets.length; i++) {
        targ = targets[i];

        if (!targ) {
          targets.splice(i--, 1);
          continue;
        } else if (typeof targ === "string") {
          targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings

          if (typeof targ === "string") {
            targets.splice(i + 1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
          }

          continue;
        } else if (targ.length && targ !== window && targ[0] && (targ[0] === window || targ[0].nodeType && targ[0].style && !targ.nodeType)) {
          //in case the user is passing in an array of selector objects (like jQuery objects), we need to check one more level and pull things out if necessary. Also note that <select> elements pass all the criteria regarding length and the first child having style, so we must also check to ensure the target isn't an HTML node itself.
          targets.splice(i--, 1);
          this._targets = targets = targets.concat(_slice(targ));
          continue;
        }

        this._siblings[i] = _register(targ, this, false);
        if (overwrite === 1) if (this._siblings[i].length > 1) {
          _applyOverwrite(targ, this, null, 1, this._siblings[i]);
        }
      }
    } else {
      this._propLookup = {};
      this._siblings = _register(target, this, false);
      if (overwrite === 1) if (this._siblings.length > 1) {
        _applyOverwrite(target, this, null, 1, this._siblings);
      }
    }

    if (this.vars.immediateRender || duration === 0 && this._delay === 0 && this.vars.immediateRender !== false) {
      this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)

      this.render(Math.min(0, -this._delay)); //in case delay is negative
    }
  }, true),
      _isSelector = function _isSelector(v) {
    return v && v.length && v !== window && v[0] && (v[0] === window || v[0].nodeType && v[0].style && !v.nodeType); //we cannot check "nodeType" if the target is window from within an iframe, otherwise it will trigger a security error in some browsers like Firefox.
  },
      _autoCSS = function _autoCSS(vars, target) {
    var css = {},
        p;

    for (p in vars) {
      if (!_reservedProps[p] && (!(p in target) || p === "transform" || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || _plugins[p] && _plugins[p]._autoCSS)) {
        //note: <img> elements contain read-only "x" and "y" properties. We should also prioritize editing css width/height rather than the element's properties.
        css[p] = vars[p];
        delete vars[p];
      }
    }

    vars.css = css;
  };

  p = TweenLite.prototype = new Animation();
  p.constructor = TweenLite;
  p.kill()._gc = false; //----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------

  p.ratio = 0;
  p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
  p._notifyPluginsOfEnabled = p._lazy = false;
  TweenLite.version = "2.1.0";
  TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
  TweenLite.defaultOverwrite = "auto";
  TweenLite.ticker = _ticker;
  TweenLite.autoSleep = 120;

  TweenLite.lagSmoothing = function (threshold, adjustedLag) {
    _ticker.lagSmoothing(threshold, adjustedLag);
  };

  TweenLite.selector = window.$ || window.jQuery || function (e) {
    var selector = window.$ || window.jQuery;

    if (selector) {
      TweenLite.selector = selector;
      return selector(e);
    }

    if (!_doc) {
      //in some dev environments (like Angular 6), GSAP gets loaded before the document is defined! So re-query it here if/when necessary.
      _doc = window.document;
    }

    return !_doc ? e : _doc.querySelectorAll ? _doc.querySelectorAll(e) : _doc.getElementById(e.charAt(0) === "#" ? e.substr(1) : e);
  };

  var _lazyTweens = [],
      _lazyLookup = {},
      _numbersExp = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
      _relExp = /[\+-]=-?[\.\d]/,
      //_nonNumbersExp = /(?:([\-+](?!(\d|=)))|[^\d\-+=e]|(e(?![\-+][\d])))+/ig,
  _setRatio = function _setRatio(v) {
    var pt = this._firstPT,
        min = 0.000001,
        val;

    while (pt) {
      val = !pt.blob ? pt.c * v + pt.s : v === 1 && this.end != null ? this.end : v ? this.join("") : this.start;

      if (pt.m) {
        val = pt.m.call(this._tween, val, this._target || pt.t, this._tween);
      } else if (val < min) if (val > -min && !pt.blob) {
        //prevents issues with converting very small numbers to strings in the browser
        val = 0;
      }

      if (!pt.f) {
        pt.t[pt.p] = val;
      } else if (pt.fp) {
        pt.t[pt.p](pt.fp, val);
      } else {
        pt.t[pt.p](val);
      }

      pt = pt._next;
    }
  },
      _blobRound = function _blobRound(v) {
    return (v * 1000 | 0) / 1000 + "";
  },
      //compares two strings (start/end), finds the numbers that are different and spits back an array representing the whole value but with the changing values isolated as elements. For example, "rgb(0,0,0)" and "rgb(100,50,0)" would become ["rgb(", 0, ",", 50, ",0)"]. Notice it merges the parts that are identical (performance optimization). The array also has a linked list of PropTweens attached starting with _firstPT that contain the tweening data (t, p, s, c, f, etc.). It also stores the starting value as a "start" property so that we can revert to it if/when necessary, like when a tween rewinds fully. If the quantity of numbers differs between the start and end, it will always prioritize the end value(s). The pt parameter is optional - it's for a PropTween that will be appended to the end of the linked list and is typically for actually setting the value after all of the elements have been updated (with array.join("")).
  _blobDif = function _blobDif(start, end, filter, pt) {
    var a = [],
        charIndex = 0,
        s = "",
        color = 0,
        startNums,
        endNums,
        num,
        i,
        l,
        nonNumbers,
        currentNum;
    a.start = start;
    a.end = end;
    start = a[0] = start + ""; //ensure values are strings

    end = a[1] = end + "";

    if (filter) {
      filter(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.

      start = a[0];
      end = a[1];
    }

    a.length = 0;
    startNums = start.match(_numbersExp) || [];
    endNums = end.match(_numbersExp) || [];

    if (pt) {
      pt._next = null;
      pt.blob = 1;
      a._firstPT = a._applyPT = pt; //apply last in the linked list (which means inserting it first)
    }

    l = endNums.length;

    for (i = 0; i < l; i++) {
      currentNum = endNums[i];
      nonNumbers = end.substr(charIndex, end.indexOf(currentNum, charIndex) - charIndex);
      s += nonNumbers || !i ? nonNumbers : ","; //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.

      charIndex += nonNumbers.length;

      if (color) {
        //sense rgba() values and round them.
        color = (color + 1) % 5;
      } else if (nonNumbers.substr(-5) === "rgba(") {
        color = 1;
      }

      if (currentNum === startNums[i] || startNums.length <= i) {
        s += currentNum;
      } else {
        if (s) {
          a.push(s);
          s = "";
        }

        num = parseFloat(startNums[i]);
        a.push(num);
        a._firstPT = {
          _next: a._firstPT,
          t: a,
          p: a.length - 1,
          s: num,
          c: (currentNum.charAt(1) === "=" ? parseInt(currentNum.charAt(0) + "1", 10) * parseFloat(currentNum.substr(2)) : parseFloat(currentNum) - num) || 0,
          f: 0,
          m: color && color < 4 ? Math.round : _blobRound
        }; //limiting to 3 decimal places and casting as a string can really help performance when array.join() is called!
        //note: we don't set _prev because we'll never need to remove individual PropTweens from this list.
      }

      charIndex += currentNum.length;
    }

    s += end.substr(charIndex);

    if (s) {
      a.push(s);
    }

    a.setRatio = _setRatio;

    if (_relExp.test(end)) {
      //if the end string contains relative values, delete it so that on the final render (in _setRatio()), we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
      a.end = null;
    }

    return a;
  },
      //note: "funcParam" is only necessary for function-based getters/setters that require an extra parameter like getAttribute("width") and setAttribute("width", value). In this example, funcParam would be "width". Used by AttrPlugin for example.
  _addPropTween = function _addPropTween(target, prop, start, end, overwriteProp, mod, funcParam, stringFilter, index) {
    if (typeof end === "function") {
      end = end(index || 0, target);
    }

    var type = _typeof(target[prop]),
        getterName = type !== "function" ? "" : prop.indexOf("set") || typeof target["get" + prop.substr(3)] !== "function" ? prop : "get" + prop.substr(3),
        s = start !== "get" ? start : !getterName ? target[prop] : funcParam ? target[getterName](funcParam) : target[getterName](),
        isRelative = typeof end === "string" && end.charAt(1) === "=",
        pt = {
      t: target,
      p: prop,
      s: s,
      f: type === "function",
      pg: 0,
      n: overwriteProp || prop,
      m: !mod ? 0 : typeof mod === "function" ? mod : Math.round,
      pr: 0,
      c: isRelative ? parseInt(end.charAt(0) + "1", 10) * parseFloat(end.substr(2)) : parseFloat(end) - s || 0
    },
        blob;

    if (typeof s !== "number" || typeof end !== "number" && !isRelative) {
      if (funcParam || isNaN(s) || !isRelative && isNaN(end) || typeof s === "boolean" || typeof end === "boolean") {
        //a blob (string that has multiple numbers in it)
        pt.fp = funcParam;
        blob = _blobDif(s, isRelative ? parseFloat(pt.s) + pt.c + (pt.s + "").replace(/[0-9\-\.]/g, "") : end, stringFilter || TweenLite.defaultStringFilter, pt);
        pt = {
          t: blob,
          p: "setRatio",
          s: 0,
          c: 1,
          f: 2,
          pg: 0,
          n: overwriteProp || prop,
          pr: 0,
          m: 0
        }; //"2" indicates it's a Blob property tween. Needed for RoundPropsPlugin for example.
      } else {
        pt.s = parseFloat(s);

        if (!isRelative) {
          pt.c = parseFloat(end) - pt.s || 0;
        }
      }
    }

    if (pt.c) {
      //only add it to the linked list if there's a change.
      if (pt._next = this._firstPT) {
        pt._next._prev = pt;
      }

      this._firstPT = pt;
      return pt;
    }
  },
      _internals = TweenLite._internals = {
    isArray: _isArray,
    isSelector: _isSelector,
    lazyTweens: _lazyTweens,
    blobDif: _blobDif
  },
      //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
  _plugins = TweenLite._plugins = {},
      _tweenLookup = _internals.tweenLookup = {},
      _tweenLookupNum = 0,
      _reservedProps = _internals.reservedProps = {
    ease: 1,
    delay: 1,
    overwrite: 1,
    onComplete: 1,
    onCompleteParams: 1,
    onCompleteScope: 1,
    useFrames: 1,
    runBackwards: 1,
    startAt: 1,
    onUpdate: 1,
    onUpdateParams: 1,
    onUpdateScope: 1,
    onStart: 1,
    onStartParams: 1,
    onStartScope: 1,
    onReverseComplete: 1,
    onReverseCompleteParams: 1,
    onReverseCompleteScope: 1,
    onRepeat: 1,
    onRepeatParams: 1,
    onRepeatScope: 1,
    easeParams: 1,
    yoyo: 1,
    immediateRender: 1,
    repeat: 1,
    repeatDelay: 1,
    data: 1,
    paused: 1,
    reversed: 1,
    autoCSS: 1,
    lazy: 1,
    onOverwrite: 1,
    callbackScope: 1,
    stringFilter: 1,
    id: 1,
    yoyoEase: 1,
    stagger: 1
  },
      _overwriteLookup = {
    none: 0,
    all: 1,
    auto: 2,
    concurrent: 3,
    allOnStart: 4,
    preexisting: 5,
    "true": 1,
    "false": 0
  },
      _rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
      _rootTimeline = Animation._rootTimeline = new SimpleTimeline(),
      _nextGCFrame = 30,
      _lazyRender = _internals.lazyRender = function () {
    var l = _lazyTweens.length,
        i,
        tween;
    _lazyLookup = {};

    for (i = 0; i < l; i++) {
      tween = _lazyTweens[i];

      if (tween && tween._lazy !== false) {
        tween.render(tween._lazy[0], tween._lazy[1], true);
        tween._lazy = false;
      }
    }

    _lazyTweens.length = 0;
  };

  _rootTimeline._startTime = _ticker.time;
  _rootFramesTimeline._startTime = _ticker.frame;
  _rootTimeline._active = _rootFramesTimeline._active = true;
  setTimeout(_lazyRender, 1); //on some mobile devices, there isn't a "tick" before code runs which means any lazy renders wouldn't run before the next official "tick".

  Animation._updateRoot = TweenLite.render = function () {
    var i, a, p;

    if (_lazyTweens.length) {
      //if code is run outside of the requestAnimationFrame loop, there may be tweens queued AFTER the engine refreshed, so we need to ensure any pending renders occur before we refresh again.
      _lazyRender();
    }

    _rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);

    _rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);

    if (_lazyTweens.length) {
      _lazyRender();
    }

    if (_ticker.frame >= _nextGCFrame) {
      //dump garbage every 120 frames or whatever the user sets TweenLite.autoSleep to
      _nextGCFrame = _ticker.frame + (parseInt(TweenLite.autoSleep, 10) || 120);

      for (p in _tweenLookup) {
        a = _tweenLookup[p].tweens;
        i = a.length;

        while (--i > -1) {
          if (a[i]._gc) {
            a.splice(i, 1);
          }
        }

        if (a.length === 0) {
          delete _tweenLookup[p];
        }
      } //if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly


      p = _rootTimeline._first;
      if (!p || p._paused) if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
        while (p && p._paused) {
          p = p._next;
        }

        if (!p) {
          _ticker.sleep();
        }
      }
    }
  };

  _ticker.addEventListener("tick", Animation._updateRoot);

  var _register = function _register(target, tween, scrub) {
    var id = target._gsTweenID,
        a,
        i;

    if (!_tweenLookup[id || (target._gsTweenID = id = "t" + _tweenLookupNum++)]) {
      _tweenLookup[id] = {
        target: target,
        tweens: []
      };
    }

    if (tween) {
      a = _tweenLookup[id].tweens;
      a[i = a.length] = tween;

      if (scrub) {
        while (--i > -1) {
          if (a[i] === tween) {
            a.splice(i, 1);
          }
        }
      }
    }

    return _tweenLookup[id].tweens;
  },
      _onOverwrite = function _onOverwrite(overwrittenTween, overwritingTween, target, killedProps) {
    var func = overwrittenTween.vars.onOverwrite,
        r1,
        r2;

    if (func) {
      r1 = func(overwrittenTween, overwritingTween, target, killedProps);
    }

    func = TweenLite.onOverwrite;

    if (func) {
      r2 = func(overwrittenTween, overwritingTween, target, killedProps);
    }

    return r1 !== false && r2 !== false;
  },
      _applyOverwrite = function _applyOverwrite(target, tween, props, mode, siblings) {
    var i, changed, curTween, l;

    if (mode === 1 || mode >= 4) {
      l = siblings.length;

      for (i = 0; i < l; i++) {
        if ((curTween = siblings[i]) !== tween) {
          if (!curTween._gc) {
            if (curTween._kill(null, target, tween)) {
              changed = true;
            }
          }
        } else if (mode === 5) {
          break;
        }
      }

      return changed;
    } //NOTE: Add tiny amount to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)


    var startTime = tween._startTime + _tinyNum,
        overlaps = [],
        oCount = 0,
        zeroDur = tween._duration === 0,
        globalStart;
    i = siblings.length;

    while (--i > -1) {
      if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {//ignore
      } else if (curTween._timeline !== tween._timeline) {
        globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);

        if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
          overlaps[oCount++] = curTween;
        }
      } else if (curTween._startTime <= startTime) if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime) if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= _tinyNum * 2)) {
        overlaps[oCount++] = curTween;
      }
    }

    i = oCount;

    while (--i > -1) {
      curTween = overlaps[i];
      l = curTween._firstPT; //we need to discern if there were property tweens originally; if they all get removed in the next line's _kill() call, the tween should be killed. See https://github.com/greensock/GreenSock-JS/issues/278

      if (mode === 2) if (curTween._kill(props, target, tween)) {
        changed = true;
      }

      if (mode !== 2 || !curTween._firstPT && curTween._initted && l) {
        if (mode !== 2 && !_onOverwrite(curTween, tween)) {
          continue;
        }

        if (curTween._enabled(false, false)) {
          //if all property tweens have been overwritten, kill the tween.
          changed = true;
        }
      }
    }

    return changed;
  },
      _checkOverlap = function _checkOverlap(tween, reference, zeroDur) {
    var tl = tween._timeline,
        ts = tl._timeScale,
        t = tween._startTime;

    while (tl._timeline) {
      t += tl._startTime;
      ts *= tl._timeScale;

      if (tl._paused) {
        return -100;
      }

      tl = tl._timeline;
    }

    t /= ts;
    return t > reference ? t - reference : zeroDur && t === reference || !tween._initted && t - reference < 2 * _tinyNum ? _tinyNum : (t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum ? 0 : t - reference - _tinyNum;
  }; //---- TweenLite instance methods -----------------------------------------------------------------------------


  p._init = function () {
    var v = this.vars,
        op = this._overwrittenProps,
        dur = this._duration,
        immediate = !!v.immediateRender,
        ease = v.ease,
        startAt = this._startAt,
        i,
        initPlugins,
        pt,
        p,
        startVars,
        l;

    if (v.startAt) {
      if (startAt) {
        startAt.render(-1, true); //if we've run a startAt previously (when the tween instantiated), we should revert it so that the values re-instantiate correctly particularly for relative tweens. Without this, a TweenLite.fromTo(obj, 1, {x:"+=100"}, {x:"-=100"}), for example, would actually jump to +=200 because the startAt would run twice, doubling the relative change.

        startAt.kill();
      }

      startVars = {};

      for (p in v.startAt) {
        //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, 1, from, to).fromTo(e, 1, to, from);
        startVars[p] = v.startAt[p];
      }

      startVars.data = "isStart";
      startVars.overwrite = false;
      startVars.immediateRender = true;
      startVars.lazy = immediate && v.lazy !== false;
      startVars.startAt = startVars.delay = null; //no nesting of startAt objects allowed (otherwise it could cause an infinite loop).

      startVars.onUpdate = v.onUpdate;
      startVars.onUpdateParams = v.onUpdateParams;
      startVars.onUpdateScope = v.onUpdateScope || v.callbackScope || this;
      this._startAt = TweenLite.to(this.target || {}, 0, startVars);

      if (immediate) {
        if (this._time > 0) {
          this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
        } else if (dur !== 0) {
          return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
        }
      }
    } else if (v.runBackwards && dur !== 0) {
      //from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
      if (startAt) {
        startAt.render(-1, true);
        startAt.kill();
        this._startAt = null;
      } else {
        if (this._time !== 0) {
          //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
          immediate = false;
        }

        pt = {};

        for (p in v) {
          //copy props into a new object and skip any reserved props, otherwise onComplete or onUpdate or onStart could fire. We should, however, permit autoCSS to go through.
          if (!_reservedProps[p] || p === "autoCSS") {
            pt[p] = v[p];
          }
        }

        pt.overwrite = 0;
        pt.data = "isFromStart"; //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.

        pt.lazy = immediate && v.lazy !== false;
        pt.immediateRender = immediate; //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)

        this._startAt = TweenLite.to(this.target, 0, pt);

        if (!immediate) {
          this._startAt._init(); //ensures that the initial values are recorded


          this._startAt._enabled(false); //no need to have the tween render on the next cycle. Disable it because we'll always manually control the renders of the _startAt tween.


          if (this.vars.immediateRender) {
            this._startAt = null;
          }
        } else if (this._time === 0) {
          return;
        }
      }
    }

    this._ease = ease = !ease ? TweenLite.defaultEase : ease instanceof Ease ? ease : typeof ease === "function" ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;

    if (v.easeParams instanceof Array && ease.config) {
      this._ease = ease.config.apply(ease, v.easeParams);
    }

    this._easeType = this._ease._type;
    this._easePower = this._ease._power;
    this._firstPT = null;

    if (this._targets) {
      l = this._targets.length;

      for (i = 0; i < l; i++) {
        if (this._initProps(this._targets[i], this._propLookup[i] = {}, this._siblings[i], op ? op[i] : null, i)) {
          initPlugins = true;
        }
      }
    } else {
      initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op, 0);
    }

    if (initPlugins) {
      TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite

    }

    if (op) if (!this._firstPT) if (typeof this.target !== "function") {
      //if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
      this._enabled(false, false);
    }

    if (v.runBackwards) {
      pt = this._firstPT;

      while (pt) {
        pt.s += pt.c;
        pt.c = -pt.c;
        pt = pt._next;
      }
    }

    this._onUpdate = v.onUpdate;
    this._initted = true;
  };

  p._initProps = function (target, propLookup, siblings, overwrittenProps, index) {
    var p, i, initPlugins, plugin, pt, v;

    if (target == null) {
      return false;
    }

    if (_lazyLookup[target._gsTweenID]) {
      _lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)

    }

    if (!this.vars.css) if (target.style) if (target !== window && target.nodeType) if (_plugins.css) if (this.vars.autoCSS !== false) {
      //it's so common to use TweenLite/Max to animate the css of DOM elements, we assume that if the target is a DOM element, that's what is intended (a convenience so that users don't have to wrap things in css:{}, although we still recommend it for a slight performance boost and better specificity). Note: we cannot check "nodeType" on the window inside an iframe.
      _autoCSS(this.vars, target);
    }

    for (p in this.vars) {
      v = this.vars[p];

      if (_reservedProps[p]) {
        if (v) if (v instanceof Array || v.push && _isArray(v)) if (v.join("").indexOf("{self}") !== -1) {
          this.vars[p] = v = this._swapSelfInParams(v, this);
        }
      } else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this, index)) {
        //t - target 		[object]
        //p - property 		[string]
        //s - start			[number]
        //c - change		[number]
        //f - isFunction	[boolean]
        //n - name			[string]
        //pg - isPlugin 	[boolean]
        //pr - priority		[number]
        //m - mod           [function | 0]
        this._firstPT = pt = {
          _next: this._firstPT,
          t: plugin,
          p: "setRatio",
          s: 0,
          c: 1,
          f: 1,
          n: p,
          pg: 1,
          pr: plugin._priority,
          m: 0
        };
        i = plugin._overwriteProps.length;

        while (--i > -1) {
          propLookup[plugin._overwriteProps[i]] = this._firstPT;
        }

        if (plugin._priority || plugin._onInitAllProps) {
          initPlugins = true;
        }

        if (plugin._onDisable || plugin._onEnable) {
          this._notifyPluginsOfEnabled = true;
        }

        if (pt._next) {
          pt._next._prev = pt;
        }
      } else {
        propLookup[p] = _addPropTween.call(this, target, p, "get", v, p, 0, null, this.vars.stringFilter, index);
      }
    }

    if (overwrittenProps) if (this._kill(overwrittenProps, target)) {
      //another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
      return this._initProps(target, propLookup, siblings, overwrittenProps, index);
    }
    if (this._overwrite > 1) if (this._firstPT) if (siblings.length > 1) if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
      this._kill(propLookup, target);

      return this._initProps(target, propLookup, siblings, overwrittenProps, index);
    }
    if (this._firstPT) if (this.vars.lazy !== false && this._duration || this.vars.lazy && !this._duration) {
      //zero duration tweens don't lazy render by default; everything else does.
      _lazyLookup[target._gsTweenID] = true;
    }
    return initPlugins;
  };

  p.render = function (time, suppressEvents, force) {
    var self = this,
        prevTime = self._time,
        duration = self._duration,
        prevRawPrevTime = self._rawPrevTime,
        isComplete,
        callback,
        pt,
        rawPrevTime;

    if (time >= duration - _tinyNum && time >= 0) {
      //to work around occasional floating point math artifacts.
      self._totalTime = self._time = duration;
      self.ratio = self._ease._calcEnd ? self._ease.getRatio(1) : 1;

      if (!self._reversed) {
        isComplete = true;
        callback = "onComplete";
        force = force || self._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
      }

      if (duration === 0) if (self._initted || !self.vars.lazy || force) {
        //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
        if (self._startTime === self._timeline._duration) {
          //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
          time = 0;
        }

        if (prevRawPrevTime < 0 || time <= 0 && time >= -_tinyNum || prevRawPrevTime === _tinyNum && self.data !== "isPause") if (prevRawPrevTime !== time) {
          //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
          force = true;

          if (prevRawPrevTime > _tinyNum) {
            callback = "onReverseComplete";
          }
        }
        self._rawPrevTime = rawPrevTime = !suppressEvents || time || prevRawPrevTime === time ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
      }
    } else if (time < _tinyNum) {
      //to work around occasional floating point math artifacts, round super small values to 0.
      self._totalTime = self._time = 0;
      self.ratio = self._ease._calcEnd ? self._ease.getRatio(0) : 0;

      if (prevTime !== 0 || duration === 0 && prevRawPrevTime > 0) {
        callback = "onReverseComplete";
        isComplete = self._reversed;
      }

      if (time > -_tinyNum) {
        time = 0;
      } else if (time < 0) {
        self._active = false;
        if (duration === 0) if (self._initted || !self.vars.lazy || force) {
          //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
          if (prevRawPrevTime >= 0 && !(prevRawPrevTime === _tinyNum && self.data === "isPause")) {
            force = true;
          }

          self._rawPrevTime = rawPrevTime = !suppressEvents || time || prevRawPrevTime === time ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
        }
      }

      if (!self._initted || self._startAt && self._startAt.progress()) {
        //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately. Also, we check progress() because if startAt has already rendered at its end, we should force a render at its beginning. Otherwise, if you put the playhead directly on top of where a fromTo({immediateRender:false}) starts, and then move it backwards, the from() won't revert its values.
        force = true;
      }
    } else {
      self._totalTime = self._time = time;

      if (self._easeType) {
        var r = time / duration,
            type = self._easeType,
            pow = self._easePower;

        if (type === 1 || type === 3 && r >= 0.5) {
          r = 1 - r;
        }

        if (type === 3) {
          r *= 2;
        }

        if (pow === 1) {
          r *= r;
        } else if (pow === 2) {
          r *= r * r;
        } else if (pow === 3) {
          r *= r * r * r;
        } else if (pow === 4) {
          r *= r * r * r * r;
        }

        self.ratio = type === 1 ? 1 - r : type === 2 ? r : time / duration < 0.5 ? r / 2 : 1 - r / 2;
      } else {
        self.ratio = self._ease.getRatio(time / duration);
      }
    }

    if (self._time === prevTime && !force) {
      return;
    } else if (!self._initted) {
      self._init();

      if (!self._initted || self._gc) {
        //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
        return;
      } else if (!force && self._firstPT && (self.vars.lazy !== false && self._duration || self.vars.lazy && !self._duration)) {
        self._time = self._totalTime = prevTime;
        self._rawPrevTime = prevRawPrevTime;

        _lazyTweens.push(self);

        self._lazy = [time, suppressEvents];
        return;
      } //_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.


      if (self._time && !isComplete) {
        self.ratio = self._ease.getRatio(self._time / duration);
      } else if (isComplete && self._ease._calcEnd) {
        self.ratio = self._ease.getRatio(self._time === 0 ? 0 : 1);
      }
    }

    if (self._lazy !== false) {
      //in case a lazy render is pending, we should flush it because the new render is occurring now (imagine a lazy tween instantiating and then immediately the user calls tween.seek(tween.duration()), skipping to the end - the end render would be forced, and then if we didn't flush the lazy render, it'd fire AFTER the seek(), rendering it at the wrong time.
      self._lazy = false;
    }

    if (!self._active) if (!self._paused && self._time !== prevTime && time >= 0) {
      self._active = true; //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
    }

    if (prevTime === 0) {
      if (self._startAt) {
        if (time >= 0) {
          self._startAt.render(time, true, force);
        } else if (!callback) {
          callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
        }
      }

      if (self.vars.onStart) if (self._time !== 0 || duration === 0) if (!suppressEvents) {
        self._callback("onStart");
      }
    }

    pt = self._firstPT;

    while (pt) {
      if (pt.f) {
        pt.t[pt.p](pt.c * self.ratio + pt.s);
      } else {
        pt.t[pt.p] = pt.c * self.ratio + pt.s;
      }

      pt = pt._next;
    }

    if (self._onUpdate) {
      if (time < 0) if (self._startAt && time !== -0.0001) {
        //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
        self._startAt.render(time, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.

      }
      if (!suppressEvents) if (self._time !== prevTime || isComplete || force) {
        self._callback("onUpdate");
      }
    }

    if (callback) if (!self._gc || force) {
      //check _gc because there's a chance that kill() could be called in an onUpdate
      if (time < 0 && self._startAt && !self._onUpdate && time !== -0.0001) {
        //-0.0001 is a special value that we use when looping back to the beginning of a repeated TimelineMax, in which case we shouldn't render the _startAt values.
        self._startAt.render(time, true, force);
      }

      if (isComplete) {
        if (self._timeline.autoRemoveChildren) {
          self._enabled(false, false);
        }

        self._active = false;
      }

      if (!suppressEvents && self.vars[callback]) {
        self._callback(callback);
      }

      if (duration === 0 && self._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) {
        //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
        self._rawPrevTime = 0;
      }
    }
  };

  p._kill = function (vars, target, overwritingTween) {
    if (vars === "all") {
      vars = null;
    }

    if (vars == null) if (target == null || target === this.target) {
      this._lazy = false;
      return this._enabled(false, false);
    }
    target = typeof target !== "string" ? target || this._targets || this.target : TweenLite.selector(target) || target;
    var simultaneousOverwrite = overwritingTween && this._time && overwritingTween._startTime === this._startTime && this._timeline === overwritingTween._timeline,
        firstPT = this._firstPT,
        i,
        overwrittenProps,
        p,
        pt,
        propLookup,
        changed,
        killProps,
        record,
        killed;

    if ((_isArray(target) || _isSelector(target)) && typeof target[0] !== "number") {
      i = target.length;

      while (--i > -1) {
        if (this._kill(vars, target[i], overwritingTween)) {
          changed = true;
        }
      }
    } else {
      if (this._targets) {
        i = this._targets.length;

        while (--i > -1) {
          if (target === this._targets[i]) {
            propLookup = this._propLookup[i] || {};
            this._overwrittenProps = this._overwrittenProps || [];
            overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
            break;
          }
        }
      } else if (target !== this.target) {
        return false;
      } else {
        propLookup = this._propLookup;
        overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
      }

      if (propLookup) {
        killProps = vars || propLookup;
        record = vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (_typeof(vars) !== "object" || !vars._tempKill); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)

        if (overwritingTween && (TweenLite.onOverwrite || this.vars.onOverwrite)) {
          for (p in killProps) {
            if (propLookup[p]) {
              if (!killed) {
                killed = [];
              }

              killed.push(p);
            }
          }

          if ((killed || !vars) && !_onOverwrite(this, overwritingTween, target, killed)) {
            //if the onOverwrite returned false, that means the user wants to override the overwriting (cancel it).
            return false;
          }
        }

        for (p in killProps) {
          if (pt = propLookup[p]) {
            if (simultaneousOverwrite) {
              //if another tween overwrites this one and they both start at exactly the same time, yet this tween has already rendered once (for example, at 0.001) because it's first in the queue, we should revert the values to where they were at 0 so that the starting values aren't contaminated on the overwriting tween.
              if (pt.f) {
                pt.t[pt.p](pt.s);
              } else {
                pt.t[pt.p] = pt.s;
              }

              changed = true;
            }

            if (pt.pg && pt.t._kill(killProps)) {
              changed = true; //some plugins need to be notified so they can perform cleanup tasks first
            }

            if (!pt.pg || pt.t._overwriteProps.length === 0) {
              if (pt._prev) {
                pt._prev._next = pt._next;
              } else if (pt === this._firstPT) {
                this._firstPT = pt._next;
              }

              if (pt._next) {
                pt._next._prev = pt._prev;
              }

              pt._next = pt._prev = null;
            }

            delete propLookup[p];
          }

          if (record) {
            overwrittenProps[p] = 1;
          }
        }

        if (!this._firstPT && this._initted && firstPT) {
          //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
          this._enabled(false, false);
        }
      }
    }

    return changed;
  };

  p.invalidate = function () {
    if (this._notifyPluginsOfEnabled) {
      TweenLite._onPluginEvent("_onDisable", this);
    }

    var t = this._time;
    this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null;
    this._notifyPluginsOfEnabled = this._active = this._lazy = false;
    this._propLookup = this._targets ? {} : [];
    Animation.prototype.invalidate.call(this);

    if (this.vars.immediateRender) {
      this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)

      this.render(t, false, this.vars.lazy !== false);
    }

    return this;
  };

  p._enabled = function (enabled, ignoreTimeline) {
    if (!_tickerActive) {
      _ticker.wake();
    }

    if (enabled && this._gc) {
      var targets = this._targets,
          i;

      if (targets) {
        i = targets.length;

        while (--i > -1) {
          this._siblings[i] = _register(targets[i], this, true);
        }
      } else {
        this._siblings = _register(this.target, this, true);
      }
    }

    Animation.prototype._enabled.call(this, enabled, ignoreTimeline);

    if (this._notifyPluginsOfEnabled) if (this._firstPT) {
      return TweenLite._onPluginEvent(enabled ? "_onEnable" : "_onDisable", this);
    }
    return false;
  }; //----TweenLite static methods -----------------------------------------------------


  TweenLite.to = function (target, duration, vars) {
    return new TweenLite(target, duration, vars);
  };

  TweenLite.from = function (target, duration, vars) {
    vars.runBackwards = true;
    vars.immediateRender = vars.immediateRender != false;
    return new TweenLite(target, duration, vars);
  };

  TweenLite.fromTo = function (target, duration, fromVars, toVars) {
    toVars.startAt = fromVars;
    toVars.immediateRender = toVars.immediateRender != false && fromVars.immediateRender != false;
    return new TweenLite(target, duration, toVars);
  };

  TweenLite.delayedCall = function (delay, callback, params, scope, useFrames) {
    return new TweenLite(callback, 0, {
      delay: delay,
      onComplete: callback,
      onCompleteParams: params,
      callbackScope: scope,
      onReverseComplete: callback,
      onReverseCompleteParams: params,
      immediateRender: false,
      lazy: false,
      useFrames: useFrames,
      overwrite: 0
    });
  };

  TweenLite.set = function (target, vars) {
    return new TweenLite(target, 0, vars);
  };

  TweenLite.getTweensOf = function (target, onlyActive) {
    if (target == null) {
      return [];
    }

    target = typeof target !== "string" ? target : TweenLite.selector(target) || target;
    var i, a, j, t;

    if ((_isArray(target) || _isSelector(target)) && typeof target[0] !== "number") {
      i = target.length;
      a = [];

      while (--i > -1) {
        a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
      }

      i = a.length; //now get rid of any duplicates (tweens of arrays of objects could cause duplicates)

      while (--i > -1) {
        t = a[i];
        j = i;

        while (--j > -1) {
          if (t === a[j]) {
            a.splice(i, 1);
          }
        }
      }
    } else if (target._gsTweenID) {
      a = _register(target).concat();
      i = a.length;

      while (--i > -1) {
        if (a[i]._gc || onlyActive && !a[i].isActive()) {
          a.splice(i, 1);
        }
      }
    }

    return a || [];
  };

  TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function (target, onlyActive, vars) {
    if (_typeof(onlyActive) === "object") {
      vars = onlyActive; //for backwards compatibility (before "onlyActive" parameter was inserted)

      onlyActive = false;
    }

    var a = TweenLite.getTweensOf(target, onlyActive),
        i = a.length;

    while (--i > -1) {
      a[i]._kill(vars, target);
    }
  };
  /*
   * ----------------------------------------------------------------
   * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another script call before loading plugins which is easy to forget)
   * ----------------------------------------------------------------
   */


  var TweenPlugin = _class("plugins.TweenPlugin", function (props, priority) {
    this._overwriteProps = (props || "").split(",");
    this._propName = this._overwriteProps[0];
    this._priority = priority || 0;
    this._super = TweenPlugin.prototype;
  }, true);

  p = TweenPlugin.prototype;
  TweenPlugin.version = "1.19.0";
  TweenPlugin.API = 2;
  p._firstPT = null;
  p._addTween = _addPropTween;
  p.setRatio = _setRatio;

  p._kill = function (lookup) {
    var a = this._overwriteProps,
        pt = this._firstPT,
        i;

    if (lookup[this._propName] != null) {
      this._overwriteProps = [];
    } else {
      i = a.length;

      while (--i > -1) {
        if (lookup[a[i]] != null) {
          a.splice(i, 1);
        }
      }
    }

    while (pt) {
      if (lookup[pt.n] != null) {
        if (pt._next) {
          pt._next._prev = pt._prev;
        }

        if (pt._prev) {
          pt._prev._next = pt._next;
          pt._prev = null;
        } else if (this._firstPT === pt) {
          this._firstPT = pt._next;
        }
      }

      pt = pt._next;
    }

    return false;
  };

  p._mod = p._roundProps = function (lookup) {
    var pt = this._firstPT,
        val;

    while (pt) {
      val = lookup[this._propName] || pt.n != null && lookup[pt.n.split(this._propName + "_").join("")];

      if (val && typeof val === "function") {
        //some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
        if (pt.f === 2) {
          pt.t._applyPT.m = val;
        } else {
          pt.m = val;
        }
      }

      pt = pt._next;
    }
  };

  TweenLite._onPluginEvent = function (type, tween) {
    var pt = tween._firstPT,
        changed,
        pt2,
        first,
        last,
        next;

    if (type === "_onInitAllProps") {
      //sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
      while (pt) {
        next = pt._next;
        pt2 = first;

        while (pt2 && pt2.pr > pt.pr) {
          pt2 = pt2._next;
        }

        if (pt._prev = pt2 ? pt2._prev : last) {
          pt._prev._next = pt;
        } else {
          first = pt;
        }

        if (pt._next = pt2) {
          pt2._prev = pt;
        } else {
          last = pt;
        }

        pt = next;
      }

      pt = tween._firstPT = first;
    }

    while (pt) {
      if (pt.pg) if (typeof pt.t[type] === "function") if (pt.t[type]()) {
        changed = true;
      }
      pt = pt._next;
    }

    return changed;
  };

  TweenPlugin.activate = function (plugins) {
    var i = plugins.length;

    while (--i > -1) {
      if (plugins[i].API === TweenPlugin.API) {
        _plugins[new plugins[i]()._propName] = plugins[i];
      }
    }

    return true;
  }; //provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.


  _gsDefine.plugin = function (config) {
    if (!config || !config.propName || !config.init || !config.API) {
      throw "illegal plugin definition.";
    }

    var propName = config.propName,
        priority = config.priority || 0,
        overwriteProps = config.overwriteProps,
        map = {
      init: "_onInitTween",
      set: "setRatio",
      kill: "_kill",
      round: "_mod",
      mod: "_mod",
      initAll: "_onInitAllProps"
    },
        Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin", function () {
      TweenPlugin.call(this, propName, priority);
      this._overwriteProps = overwriteProps || [];
    }, config.global === true),
        p = Plugin.prototype = new TweenPlugin(propName),
        prop;

    p.constructor = Plugin;
    Plugin.API = config.API;

    for (prop in map) {
      if (typeof config[prop] === "function") {
        p[map[prop]] = config[prop];
      }
    }

    Plugin.version = config.version;
    TweenPlugin.activate([Plugin]);
    return Plugin;
  }; //now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.


  a = window._gsQueue;

  if (a) {
    for (i = 0; i < a.length; i++) {
      a[i]();
    }

    for (p in _defLookup) {
      if (!_defLookup[p].func) {
        window.console.log("GSAP encountered missing dependency: " + p);
      }
    }
  }

  _tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated

  return TweenLite;
}(_gsScope, "TweenLite");

exports.default = exports.TweenLite = TweenLite;
var globals = _gsScope.GreenSockGlobals;
exports.globals = globals;
var nonGlobals = globals.com.greensock;
var SimpleTimeline = nonGlobals.core.SimpleTimeline;
exports.SimpleTimeline = SimpleTimeline;
var Animation = nonGlobals.core.Animation;
exports.Animation = Animation;
var Ease = globals.Ease;
exports.Ease = Ease;
var Linear = globals.Linear;
exports.Linear = Linear;
var Power0 = Linear;
exports.Power0 = Power0;
var Power1 = globals.Power1;
exports.Power1 = Power1;
var Power2 = globals.Power2;
exports.Power2 = Power2;
var Power3 = globals.Power3;
exports.Power3 = Power3;
var Power4 = globals.Power4;
exports.Power4 = Power4;
var TweenPlugin = globals.TweenPlugin;
exports.TweenPlugin = TweenPlugin;
var EventDispatcher = nonGlobals.events.EventDispatcher;
exports.EventDispatcher = EventDispatcher;
},{}],"js/assets/MorphSVGPlugin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MorphSVGPlugin = void 0;

var _TweenLite = require("gsap/TweenLite.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _PI = Math.PI,
    _DEG2RAD = _PI / 180,
    _svgPathExp = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
    _numbersExp = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
    _selectorExp = /(^[#\.][a-z]|[a-y][a-z])/gi,
    _commands = /[achlmqstvz]/ig,
    _scientific = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig,
    _atan2 = Math.atan2,
    _cos = Math.cos,
    _sin = Math.sin,
    _sqrt = Math.sqrt,
    _2PI = _PI * 2,
    _angleMin = _PI * 0.3,
    _angleMax = _PI * 0.7,
    _lastLinkedAnchor,
    TweenLite = _TweenLite._gsScope._gsDefine.globals.TweenLite,
    _log = function _log(message) {
  if (_TweenLite._gsScope.console) {
    console.log(message);
  }
},
    // translates SVG arc data into an array of cubic beziers
_arcToBeziers = function _arcToBeziers(lastX, lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y) {
  if (lastX === x && lastY === y) {
    return;
  }

  rx = Math.abs(rx);
  ry = Math.abs(ry);

  var angleRad = angle % 360 * _DEG2RAD,
      cosAngle = _cos(angleRad),
      sinAngle = _sin(angleRad),
      dx2 = (lastX - x) / 2,
      dy2 = (lastY - y) / 2,
      x1 = cosAngle * dx2 + sinAngle * dy2,
      y1 = -sinAngle * dx2 + cosAngle * dy2,
      x1_sq = x1 * x1,
      y1_sq = y1 * y1,
      radiiCheck = x1_sq / (rx * rx) + y1_sq / (ry * ry);

  if (radiiCheck > 1) {
    rx = _sqrt(radiiCheck) * rx;
    ry = _sqrt(radiiCheck) * ry;
  }

  var rx_sq = rx * rx,
      ry_sq = ry * ry,
      sq = (rx_sq * ry_sq - rx_sq * y1_sq - ry_sq * x1_sq) / (rx_sq * y1_sq + ry_sq * x1_sq);

  if (sq < 0) {
    sq = 0;
  }

  var coef = (largeArcFlag === sweepFlag ? -1 : 1) * _sqrt(sq),
      cx1 = coef * (rx * y1 / ry),
      cy1 = coef * -(ry * x1 / rx),
      sx2 = (lastX + x) / 2,
      sy2 = (lastY + y) / 2,
      cx = sx2 + (cosAngle * cx1 - sinAngle * cy1),
      cy = sy2 + (sinAngle * cx1 + cosAngle * cy1),
      ux = (x1 - cx1) / rx,
      uy = (y1 - cy1) / ry,
      vx = (-x1 - cx1) / rx,
      vy = (-y1 - cy1) / ry,
      temp = ux * ux + uy * uy,
      angleStart = (uy < 0 ? -1 : 1) * Math.acos(ux / _sqrt(temp)),
      angleExtent = (ux * vy - uy * vx < 0 ? -1 : 1) * Math.acos((ux * vx + uy * vy) / _sqrt(temp * (vx * vx + vy * vy)));

  if (!sweepFlag && angleExtent > 0) {
    angleExtent -= _2PI;
  } else if (sweepFlag && angleExtent < 0) {
    angleExtent += _2PI;
  }

  angleStart %= _2PI;
  angleExtent %= _2PI;

  var segments = Math.ceil(Math.abs(angleExtent) / (_2PI / 4)),
      rawPath = [],
      angleIncrement = angleExtent / segments,
      controlLength = 4 / 3 * _sin(angleIncrement / 2) / (1 + _cos(angleIncrement / 2)),
      ma = cosAngle * rx,
      mb = sinAngle * rx,
      mc = sinAngle * -ry,
      md = cosAngle * ry,
      i;

  for (i = 0; i < segments; i++) {
    angle = angleStart + i * angleIncrement;
    x1 = _cos(angle);
    y1 = _sin(angle);
    ux = _cos(angle += angleIncrement);
    uy = _sin(angle);
    rawPath.push(x1 - controlLength * y1, y1 + controlLength * x1, ux + controlLength * uy, uy - controlLength * ux, ux, uy);
  } //now transform according to the actual size of the ellipse/arc (the beziers were noramlized, between 0 and 1 on a circle).


  for (i = 0; i < rawPath.length; i += 2) {
    x1 = rawPath[i];
    y1 = rawPath[i + 1];
    rawPath[i] = x1 * ma + y1 * mc + cx;
    rawPath[i + 1] = x1 * mb + y1 * md + cy;
  }

  rawPath[i - 2] = x; //always set the end to exactly where it's supposed to be

  rawPath[i - 1] = y;
  return rawPath;
},
    //Spits back an array of cubic Bezier segments that use absolute coordinates. Each segment starts with a "moveTo" command (x coordinate, then y) and then 2 control points (x, y, x, y), then anchor. The goal is to minimize memory and maximize speed.
_stringToRawPath = function _stringToRawPath(d) {
  var a = (d + "").replace(_scientific, function (m) {
    var n = +m;
    return n < 0.0001 && n > -0.0001 ? 0 : n;
  }).match(_svgPathExp) || [],
      //some authoring programs spit out very small numbers in scientific notation like "1e-5", so make sure we round that down to 0 first.
  path = [],
      relativeX = 0,
      relativeY = 0,
      twoThirds = 2 / 3,
      elements = a.length,
      points = 0,
      errorMessage = "ERROR: malformed path: " + d,
      line = function line(sx, sy, ex, ey) {
    difX = (ex - sx) / 3;
    difY = (ey - sy) / 3;
    segment.push(sx + difX, sy + difY, ex - difX, ey - difY, ex, ey);
  },
      i,
      j,
      x,
      y,
      command,
      isRelative,
      segment,
      startX,
      startY,
      difX,
      difY,
      beziers,
      prevCommand;

  if (!d || !isNaN(a[0]) || isNaN(a[1])) {
    _log(errorMessage);

    return path;
  }

  for (i = 0; i < elements; i++) {
    prevCommand = command;

    if (isNaN(a[i])) {
      command = a[i].toUpperCase();
      isRelative = command !== a[i]; //lower case means relative
    } else {
      //commands like "C" can be strung together without any new command characters between.
      i--;
    }

    x = +a[i + 1];
    y = +a[i + 2];

    if (isRelative) {
      x += relativeX;
      y += relativeY;
    }

    if (!i) {
      startX = x;
      startY = y;
    } // "M" (move)


    if (command === "M") {
      if (segment) {
        if (segment.length < 8) {
          //if the path data was funky and just had a M with no actual drawing anywhere, skip it.
          path.length -= 1;
        } else {
          points += segment.length;
        }
      }

      relativeX = startX = x;
      relativeY = startY = y;
      segment = [x, y];
      path.push(segment);
      i += 2;
      command = "L"; //an "M" with more than 2 values gets interpreted as "lineTo" commands ("L").
      // "C" (cubic bezier)
    } else if (command === "C") {
      if (!segment) {
        segment = [0, 0];
      }

      if (!isRelative) {
        relativeX = relativeY = 0;
      } //note: "*1" is just a fast/short way to cast the value as a Number. WAAAY faster in Chrome, slightly slower in Firefox.


      segment.push(x, y, relativeX + a[i + 3] * 1, relativeY + a[i + 4] * 1, relativeX += a[i + 5] * 1, relativeY += a[i + 6] * 1);
      i += 6; // "S" (continuation of cubic bezier)
    } else if (command === "S") {
      difX = relativeX;
      difY = relativeY;

      if (prevCommand === "C" || prevCommand === "S") {
        difX += relativeX - segment[segment.length - 4];
        difY += relativeY - segment[segment.length - 3];
      }

      if (!isRelative) {
        relativeX = relativeY = 0;
      }

      segment.push(difX, difY, x, y, relativeX += a[i + 3] * 1, relativeY += a[i + 4] * 1);
      i += 4; // "Q" (quadratic bezier)
    } else if (command === "Q") {
      difX = relativeX + (x - relativeX) * twoThirds;
      difY = relativeY + (y - relativeY) * twoThirds;

      if (!isRelative) {
        relativeX = relativeY = 0;
      }

      relativeX += a[i + 3] * 1;
      relativeY += a[i + 4] * 1;
      segment.push(difX, difY, relativeX + (x - relativeX) * twoThirds, relativeY + (y - relativeY) * twoThirds, relativeX, relativeY);
      i += 4; // "T" (continuation of quadratic bezier)
    } else if (command === "T") {
      difX = relativeX - segment[segment.length - 4];
      difY = relativeY - segment[segment.length - 3];
      segment.push(relativeX + difX, relativeY + difY, x + (relativeX + difX * 1.5 - x) * twoThirds, y + (relativeY + difY * 1.5 - y) * twoThirds, relativeX = x, relativeY = y);
      i += 2; // "H" (horizontal line)
    } else if (command === "H") {
      line(relativeX, relativeY, relativeX = x, relativeY);
      i += 1; // "V" (vertical line)
    } else if (command === "V") {
      //adjust values because the first (and only one) isn't x in this case, it's y.
      line(relativeX, relativeY, relativeX, relativeY = x + (isRelative ? relativeY - relativeX : 0));
      i += 1; // "L" (line) or "Z" (close)
    } else if (command === "L" || command === "Z") {
      if (command === "Z") {
        x = startX;
        y = startY;
        segment.closed = true;
      }

      if (command === "L" || Math.abs(relativeX - x) > 0.5 || Math.abs(relativeY - y) > 0.5) {
        line(relativeX, relativeY, x, y);

        if (command === "L") {
          i += 2;
        }
      }

      relativeX = x;
      relativeY = y; // "A" (arc)
    } else if (command === "A") {
      beziers = _arcToBeziers(relativeX, relativeY, +a[i + 1], +a[i + 2], +a[i + 3], +a[i + 4], +a[i + 5], (isRelative ? relativeX : 0) + a[i + 6] * 1, (isRelative ? relativeY : 0) + a[i + 7] * 1);

      if (beziers) {
        for (j = 0; j < beziers.length; j++) {
          segment.push(beziers[j]);
        }
      }

      relativeX = segment[segment.length - 2];
      relativeY = segment[segment.length - 1];
      i += 7;
    } else {
      _log(errorMessage);
    }
  }

  i = segment.length;

  if (segment[0] === segment[i - 2] && segment[1] === segment[i - 1]) {
    segment.closed = true;
  }

  path.totalPoints = points + i;
  return path;
},
    //adds a certain number of Beziers while maintaining the path shape (so that the start/end values can have a matching quantity of points to animate). Only pass in ONE segment of the Bezier at a time. Format: [xAnchor, yAnchor, xControlPoint1, yControlPoint1, xControlPoint2, yControlPoint2, xAnchor, yAnchor, xControlPoint1, etc...]
_subdivideSegment = function _subdivideSegment(segment, quantity) {
  var tally = 0,
      max = 0.999999,
      l = segment.length,
      newPointsPerSegment = quantity / ((l - 2) / 6),
      ax,
      ay,
      cp1x,
      cp1y,
      cp2x,
      cp2y,
      bx,
      by,
      x1,
      y1,
      x2,
      y2,
      i,
      t;

  for (i = 2; i < l; i += 6) {
    tally += newPointsPerSegment;

    while (tally > max) {
      //compare with 0.99999 instead of 1 in order to prevent rounding errors
      ax = segment[i - 2];
      ay = segment[i - 1];
      cp1x = segment[i];
      cp1y = segment[i + 1];
      cp2x = segment[i + 2];
      cp2y = segment[i + 3];
      bx = segment[i + 4];
      by = segment[i + 5];
      t = 1 / ((Math.floor(tally) || 1) + 1); //progress along the bezier (value between 0 and 1)

      x1 = ax + (cp1x - ax) * t;
      x2 = cp1x + (cp2x - cp1x) * t;
      x1 += (x2 - x1) * t;
      x2 += (cp2x + (bx - cp2x) * t - x2) * t;
      y1 = ay + (cp1y - ay) * t;
      y2 = cp1y + (cp2y - cp1y) * t;
      y1 += (y2 - y1) * t;
      y2 += (cp2y + (by - cp2y) * t - y2) * t;
      segment.splice(i, 4, ax + (cp1x - ax) * t, //first control point
      ay + (cp1y - ay) * t, x1, //second control point
      y1, x1 + (x2 - x1) * t, //new fabricated anchor on line
      y1 + (y2 - y1) * t, x2, //third control point
      y2, cp2x + (bx - cp2x) * t, //fourth control point
      cp2y + (by - cp2y) * t);
      i += 6;
      l += 6;
      tally--;
    }
  }

  return segment;
},
    _rawPathToString = function _rawPathToString(rawPath, precision) {
  var s = "",
      space = " ",
      l = rawPath.length,
      rnd = Math.pow(10, precision || 2),
      i,
      j,
      segment;

  for (j = 0; j < rawPath.length; j++) {
    segment = rawPath[j];
    l = segment.length;
    s += "M" + (segment[0] * rnd | 0) / rnd + space + (segment[1] * rnd | 0) / rnd + " C";

    for (i = 2; i < l; i++) {
      //this is actually faster than just doing a join() on the array, possibly because the numbers have so many decimal places
      s += (segment[i] * rnd | 0) / rnd + space;
    }

    if (segment.closed) {
      s += "z";
    }
  }

  return s;
},
    _reverseBezier = function _reverseBezier(segment) {
  var a = [],
      i = segment.length - 1,
      l = 0;

  while (--i > -1) {
    a[l++] = segment[i];
    a[l++] = segment[i + 1];
    i--;
  }

  for (i = 0; i < l; i++) {
    segment[i] = a[i];
  }

  segment.reversed = !segment.reversed;
},
    _getAverageXY = function _getAverageXY(segment) {
  var l = segment.length,
      x = 0,
      y = 0,
      i;

  for (i = 0; i < l; i++) {
    x += segment[i++];
    y += segment[i];
  }

  return [x / (l / 2), y / (l / 2)];
},
    _getSize = function _getSize(segment) {
  //rough estimate of the bounding box (based solely on the anchors) of a single segment. sets "size", "centerX", and "centerY" properties on the bezier array itself, and returns the size (width * height)
  var l = segment.length,
      xMax = segment[0],
      xMin = xMax,
      yMax = segment[1],
      yMin = yMax,
      x,
      y,
      i;

  for (i = 6; i < l; i += 6) {
    x = segment[i];
    y = segment[i + 1];

    if (x > xMax) {
      xMax = x;
    } else if (x < xMin) {
      xMin = x;
    }

    if (y > yMax) {
      yMax = y;
    } else if (y < yMin) {
      yMin = y;
    }
  }

  segment.centerX = (xMax + xMin) / 2;
  segment.centerY = (yMax + yMin) / 2;
  return segment.size = (xMax - xMin) * (yMax - yMin);
},
    _getTotalSize = function _getTotalSize(rawPath, samplesPerBezier) {
  //rough estimate of the bounding box of the entire list of Bezier segments (based solely on the anchors). sets "size", "centerX", and "centerY" properties on the bezier array itself, and returns the size (width * height)
  samplesPerBezier = samplesPerBezier || 3;
  var j = rawPath.length,
      xMax = rawPath[0][0],
      xMin = xMax,
      yMax = rawPath[0][1],
      yMin = yMax,
      inc = 1 / samplesPerBezier,
      l,
      x,
      y,
      i,
      segment,
      k,
      t,
      inv,
      x1,
      y1,
      x2,
      x3,
      x4,
      y2,
      y3,
      y4;

  while (--j > -1) {
    segment = rawPath[j];
    l = segment.length;

    for (i = 6; i < l; i += 6) {
      x1 = segment[i];
      y1 = segment[i + 1];
      x2 = segment[i + 2] - x1;
      y2 = segment[i + 3] - y1;
      x3 = segment[i + 4] - x1;
      y3 = segment[i + 5] - y1;
      x4 = segment[i + 6] - x1;
      y4 = segment[i + 7] - y1;
      k = samplesPerBezier;

      while (--k > -1) {
        t = inc * k;
        inv = 1 - t;
        x = (t * t * x4 + 3 * inv * (t * x3 + inv * x2)) * t + x1;
        y = (t * t * y4 + 3 * inv * (t * y3 + inv * y2)) * t + y1;

        if (x > xMax) {
          xMax = x;
        } else if (x < xMin) {
          xMin = x;
        }

        if (y > yMax) {
          yMax = y;
        } else if (y < yMin) {
          yMin = y;
        }
      }
    }
  }

  rawPath.centerX = (xMax + xMin) / 2;
  rawPath.centerY = (yMax + yMin) / 2;
  rawPath.left = xMin;
  rawPath.width = xMax - xMin;
  rawPath.top = yMin;
  rawPath.height = yMax - yMin;
  return rawPath.size = (xMax - xMin) * (yMax - yMin);
},
    _sortByComplexity = function _sortByComplexity(a, b) {
  return b.length - a.length;
},
    _sortBySize = function _sortBySize(a, b) {
  var sizeA = a.size || _getSize(a),
      sizeB = b.size || _getSize(b);

  return Math.abs(sizeB - sizeA) < (sizeA + sizeB) / 20 ? b.centerX - a.centerX || b.centerY - a.centerY : sizeB - sizeA; //if the size is within 10% of each other, prioritize position from left to right, then top to bottom.
},
    _offsetSegment = function _offsetSegment(segment, shapeIndex) {
  var a = segment.slice(0),
      l = segment.length,
      wrap = l - 2,
      i,
      index;
  shapeIndex = shapeIndex | 0;

  for (i = 0; i < l; i++) {
    index = (i + shapeIndex) % wrap;
    segment[i++] = a[index];
    segment[i] = a[index + 1];
  }
},
    _getTotalMovement = function _getTotalMovement(sb, eb, shapeIndex, offsetX, offsetY) {
  var l = sb.length,
      d = 0,
      wrap = l - 2,
      index,
      i,
      x,
      y;
  shapeIndex *= 6;

  for (i = 0; i < l; i += 6) {
    index = (i + shapeIndex) % wrap;
    y = sb[index] - (eb[i] - offsetX);
    x = sb[index + 1] - (eb[i + 1] - offsetY);
    d += _sqrt(x * x + y * y);
  }

  return d;
},
    _getClosestShapeIndex = function _getClosestShapeIndex(sb, eb, checkReverse) {
  //finds the index in a closed cubic bezier array that's closest to the angle provided (angle measured from the center or average x/y).
  var l = sb.length,
      sCenter = _getAverageXY(sb),
      //when comparing distances, adjust the coordinates as if the shapes are centered with each other.
  eCenter = _getAverageXY(eb),
      offsetX = eCenter[0] - sCenter[0],
      offsetY = eCenter[1] - sCenter[1],
      min = _getTotalMovement(sb, eb, 0, offsetX, offsetY),
      minIndex = 0,
      copy,
      d,
      i;

  for (i = 6; i < l; i += 6) {
    d = _getTotalMovement(sb, eb, i / 6, offsetX, offsetY);

    if (d < min) {
      min = d;
      minIndex = i;
    }
  }

  if (checkReverse) {
    copy = sb.slice(0);

    _reverseBezier(copy);

    for (i = 6; i < l; i += 6) {
      d = _getTotalMovement(copy, eb, i / 6, offsetX, offsetY);

      if (d < min) {
        min = d;
        minIndex = -i;
      }
    }
  }

  return minIndex / 6;
},
    _getClosestAnchor = function _getClosestAnchor(bezier, x, y) {
  //finds the x/y of the anchor that's closest to the provided x/y coordinate (returns an array, like [x, y]). The bezier should be the top-level type that contains an array for each segment.
  var j = bezier.length,
      closestDistance = 99999999999,
      closestX = 0,
      closestY = 0,
      b,
      dx,
      dy,
      d,
      i,
      l;

  while (--j > -1) {
    b = bezier[j];
    l = b.length;

    for (i = 0; i < l; i += 6) {
      dx = b[i] - x;
      dy = b[i + 1] - y;
      d = _sqrt(dx * dx + dy * dy);

      if (d < closestDistance) {
        closestDistance = d;
        closestX = b[i];
        closestY = b[i + 1];
      }
    }
  }

  return [closestX, closestY];
},
    _getClosestSegment = function _getClosestSegment(bezier, pool, startIndex, sortRatio, offsetX, offsetY) {
  //matches the bezier to the closest one in a pool (array) of beziers, assuming they are in order of size and we shouldn't drop more than 20% of the size, otherwise prioritizing location (total distance to the center). Extracts the segment out of the pool array and returns it.
  var l = pool.length,
      index = 0,
      minSize = Math.min(bezier.size || _getSize(bezier), pool[startIndex].size || _getSize(pool[startIndex])) * sortRatio,
      //limit things based on a percentage of the size of either the bezier or the next element in the array, whichever is smaller.
  min = 999999999999,
      cx = bezier.centerX + offsetX,
      cy = bezier.centerY + offsetY,
      size,
      i,
      dx,
      dy,
      d;

  for (i = startIndex; i < l; i++) {
    size = pool[i].size || _getSize(pool[i]);

    if (size < minSize) {
      break;
    }

    dx = pool[i].centerX - cx;
    dy = pool[i].centerY - cy;
    d = _sqrt(dx * dx + dy * dy);

    if (d < min) {
      index = i;
      min = d;
    }
  }

  d = pool[index];
  pool.splice(index, 1);
  return d;
},
    _equalizeSegmentQuantity = function _equalizeSegmentQuantity(start, end, shapeIndex, map, fillSafe) {
  //returns an array of shape indexes, 1 for each segment.
  var dif = end.length - start.length,
      longer = dif > 0 ? end : start,
      shorter = dif > 0 ? start : end,
      added = 0,
      sortMethod = map === "complexity" ? _sortByComplexity : _sortBySize,
      sortRatio = map === "position" ? 0 : typeof map === "number" ? map : 0.8,
      i = shorter.length,
      shapeIndices = _typeof(shapeIndex) === "object" && shapeIndex.push ? shapeIndex.slice(0) : [shapeIndex],
      reverse = shapeIndices[0] === "reverse" || shapeIndices[0] < 0,
      log = shapeIndex === "log",
      eb,
      sb,
      b,
      x,
      y,
      offsetX,
      offsetY;

  if (!shorter[0]) {
    return;
  }

  if (longer.length > 1) {
    start.sort(sortMethod);
    end.sort(sortMethod);
    offsetX = longer.size || _getTotalSize(longer); //ensures centerX and centerY are defined (used below).

    offsetX = shorter.size || _getTotalSize(shorter);
    offsetX = longer.centerX - shorter.centerX;
    offsetY = longer.centerY - shorter.centerY;

    if (sortMethod === _sortBySize) {
      for (i = 0; i < shorter.length; i++) {
        longer.splice(i, 0, _getClosestSegment(shorter[i], longer, i, sortRatio, offsetX, offsetY));
      }
    }
  }

  if (dif) {
    if (dif < 0) {
      dif = -dif;
    }

    if (longer[0].length > shorter[0].length) {
      //since we use shorter[0] as the one to map the origination point of any brand new fabricated segments, do any subdividing first so that there are more points to choose from (if necessary)
      _subdivideSegment(shorter[0], (longer[0].length - shorter[0].length) / 6 | 0);
    }

    i = shorter.length;

    while (added < dif) {
      x = longer[i].size || _getSize(longer[i]); //just to ensure centerX and centerY are calculated which we use on the next line.

      b = _getClosestAnchor(shorter, longer[i].centerX, longer[i].centerY);
      x = b[0];
      y = b[1];
      shorter[i++] = [x, y, x, y, x, y, x, y];
      shorter.totalPoints += 8;
      added++;
    }
  }

  for (i = 0; i < start.length; i++) {
    eb = end[i];
    sb = start[i];
    dif = eb.length - sb.length;

    if (dif < 0) {
      _subdivideSegment(eb, -dif / 6 | 0);
    } else if (dif > 0) {
      _subdivideSegment(sb, dif / 6 | 0);
    }

    if (reverse && fillSafe !== false && !sb.reversed) {
      _reverseBezier(sb);
    }

    shapeIndex = shapeIndices[i] || shapeIndices[i] === 0 ? shapeIndices[i] : "auto";

    if (shapeIndex) {
      //if start shape is closed, find the closest point to the start/end, and re-organize the bezier points accordingly so that the shape morphs in a more intuitive way.
      if (sb.closed || Math.abs(sb[0] - sb[sb.length - 2]) < 0.5 && Math.abs(sb[1] - sb[sb.length - 1]) < 0.5) {
        if (shapeIndex === "auto" || shapeIndex === "log") {
          shapeIndices[i] = shapeIndex = _getClosestShapeIndex(sb, eb, !i || fillSafe === false);

          if (shapeIndex < 0) {
            reverse = true;

            _reverseBezier(sb);

            shapeIndex = -shapeIndex;
          }

          _offsetSegment(sb, shapeIndex * 6);
        } else if (shapeIndex !== "reverse") {
          if (i && shapeIndex < 0) {
            //only happens if an array is passed as shapeIndex and a negative value is defined for an index beyond 0. Very rare, but helpful sometimes.
            _reverseBezier(sb);
          }

          _offsetSegment(sb, (shapeIndex < 0 ? -shapeIndex : shapeIndex) * 6);
        } //otherwise, if it's not a closed shape, consider reversing it if that would make the overall travel less

      } else if (!reverse && (shapeIndex === "auto" && Math.abs(eb[0] - sb[0]) + Math.abs(eb[1] - sb[1]) + Math.abs(eb[eb.length - 2] - sb[sb.length - 2]) + Math.abs(eb[eb.length - 1] - sb[sb.length - 1]) > Math.abs(eb[0] - sb[sb.length - 2]) + Math.abs(eb[1] - sb[sb.length - 1]) + Math.abs(eb[eb.length - 2] - sb[0]) + Math.abs(eb[eb.length - 1] - sb[1]) || shapeIndex % 2)) {
        _reverseBezier(sb);

        shapeIndices[i] = -1;
        reverse = true;
      } else if (shapeIndex === "auto") {
        shapeIndices[i] = 0;
      } else if (shapeIndex === "reverse") {
        shapeIndices[i] = -1;
      }

      if (sb.closed !== eb.closed) {
        //if one is closed and one isn't, don't close either one otherwise the tweening will look weird (but remember, the beginning and final states will honor the actual values, so this only affects the inbetween state)
        sb.closed = eb.closed = false;
      }
    }
  }

  if (log) {
    _log("shapeIndex:[" + shapeIndices.join(",") + "]");
  }

  start.shapeIndex = shapeIndices;
  return shapeIndices;
},
    _pathFilter = function _pathFilter(a, shapeIndex, map, precompile, fillSafe) {
  var start = _stringToRawPath(a[0]),
      end = _stringToRawPath(a[1]);

  if (!_equalizeSegmentQuantity(start, end, shapeIndex || shapeIndex === 0 ? shapeIndex : "auto", map, fillSafe)) {
    return; //malformed path data or null target
  }

  a[0] = _rawPathToString(start);
  a[1] = _rawPathToString(end);

  if (precompile === "log" || precompile === true) {
    _log('precompile:["' + a[0] + '","' + a[1] + '"]');
  }
},

/*
_buildPathFilter = function(shapeIndex, map, precompile) {
	return (map || precompile || shapeIndex || shapeIndex === 0) ? function(a) {
		_pathFilter(a, shapeIndex, map, precompile);
	} : _pathFilter;
},
*/
_offsetPoints = function _offsetPoints(text, offset) {
  if (!offset) {
    return text;
  }

  var a = text.match(_numbersExp) || [],
      l = a.length,
      s = "",
      inc,
      i,
      j;

  if (offset === "reverse") {
    i = l - 1;
    inc = -2;
  } else {
    i = ((parseInt(offset, 10) || 0) * 2 + 1 + l * 100) % l;
    inc = 2;
  }

  for (j = 0; j < l; j += 2) {
    s += a[i - 1] + "," + a[i] + " ";
    i = (i + inc) % l;
  }

  return s;
},
    //adds a certain number of points while maintaining the polygon/polyline shape (so that the start/end values can have a matching quantity of points to animate). Returns the revised string.
_equalizePointQuantity = function _equalizePointQuantity(a, quantity) {
  var tally = 0,
      x = parseFloat(a[0]),
      y = parseFloat(a[1]),
      s = x + "," + y + " ",
      max = 0.999999,
      newPointsPerSegment,
      i,
      l,
      j,
      factor,
      nextX,
      nextY;
  l = a.length;
  newPointsPerSegment = quantity * 0.5 / (l * 0.5 - 1);

  for (i = 0; i < l - 2; i += 2) {
    tally += newPointsPerSegment;
    nextX = parseFloat(a[i + 2]);
    nextY = parseFloat(a[i + 3]);

    if (tally > max) {
      //compare with 0.99999 instead of 1 in order to prevent rounding errors
      factor = 1 / (Math.floor(tally) + 1);
      j = 1;

      while (tally > max) {
        s += (x + (nextX - x) * factor * j).toFixed(2) + "," + (y + (nextY - y) * factor * j).toFixed(2) + " ";
        tally--;
        j++;
      }
    }

    s += nextX + "," + nextY + " ";
    x = nextX;
    y = nextY;
  }

  return s;
},
    _pointsFilter = function _pointsFilter(a) {
  var startNums = a[0].match(_numbersExp) || [],
      endNums = a[1].match(_numbersExp) || [],
      dif = endNums.length - startNums.length;

  if (dif > 0) {
    a[0] = _equalizePointQuantity(startNums, dif);
  } else {
    a[1] = _equalizePointQuantity(endNums, -dif);
  }
},
    _buildPointsFilter = function _buildPointsFilter(shapeIndex) {
  return !isNaN(shapeIndex) ? function (a) {
    _pointsFilter(a);

    a[1] = _offsetPoints(a[1], parseInt(shapeIndex, 10));
  } : _pointsFilter;
},
    _createPath = function _createPath(e, ignore) {
  var path = _TweenLite._gsScope.document.createElementNS("http://www.w3.org/2000/svg", "path"),
      attr = Array.prototype.slice.call(e.attributes),
      i = attr.length,
      name;

  ignore = "," + ignore + ",";

  while (--i > -1) {
    name = attr[i].nodeName.toLowerCase(); //in Microsoft Edge, if you don't set the attribute with a lowercase name, it doesn't render correctly! Super weird.

    if (ignore.indexOf("," + name + ",") === -1) {
      path.setAttributeNS(null, name, attr[i].nodeValue);
    }
  }

  return path;
},
    _typeAttrs = {
  rect: "rx,ry,x,y,width,height",
  circle: "r,cx,cy",
  ellipse: "rx,ry,cx,cy",
  line: "x1,x2,y1,y2"
},
    _attrToObj = function _attrToObj(e, attrs) {
  var props = attrs ? attrs.split(",") : [],
      obj = {},
      i = props.length;

  while (--i > -1) {
    obj[props[i]] = +e.getAttribute(props[i]) || 0;
  }

  return obj;
},
    _convertToPath = function _convertToPath(e, swap) {
  var type = e.tagName.toLowerCase(),
      circ = 0.552284749831,
      data,
      x,
      y,
      r,
      ry,
      path,
      rcirc,
      rycirc,
      points,
      w,
      h,
      x2,
      x3,
      x4,
      x5,
      x6,
      y2,
      y3,
      y4,
      y5,
      y6,
      attr;

  if (type === "path" || !e.getBBox) {
    return e;
  }

  path = _createPath(e, "x,y,width,height,cx,cy,rx,ry,r,x1,x2,y1,y2,points");
  attr = _attrToObj(e, _typeAttrs[type]);

  if (type === "rect") {
    r = attr.rx;
    ry = attr.ry;
    x = attr.x;
    y = attr.y;
    w = attr.width - r * 2;
    h = attr.height - ry * 2;

    if (r || ry) {
      //if there are rounded corners, render cubic beziers
      x2 = x + r * (1 - circ);
      x3 = x + r;
      x4 = x3 + w;
      x5 = x4 + r * circ;
      x6 = x4 + r;
      y2 = y + ry * (1 - circ);
      y3 = y + ry;
      y4 = y3 + h;
      y5 = y4 + ry * circ;
      y6 = y4 + ry;
      data = "M" + x6 + "," + y3 + " V" + y4 + " C" + [x6, y5, x5, y6, x4, y6, x4 - (x4 - x3) / 3, y6, x3 + (x4 - x3) / 3, y6, x3, y6, x2, y6, x, y5, x, y4, x, y4 - (y4 - y3) / 3, x, y3 + (y4 - y3) / 3, x, y3, x, y2, x2, y, x3, y, x3 + (x4 - x3) / 3, y, x4 - (x4 - x3) / 3, y, x4, y, x5, y, x6, y2, x6, y3].join(",") + "z";
    } else {
      data = "M" + (x + w) + "," + y + " v" + h + " h" + -w + " v" + -h + " h" + w + "z";
    }
  } else if (type === "circle" || type === "ellipse") {
    if (type === "circle") {
      r = ry = attr.r;
      rycirc = r * circ;
    } else {
      r = attr.rx;
      ry = attr.ry;
      rycirc = ry * circ;
    }

    x = attr.cx;
    y = attr.cy;
    rcirc = r * circ;
    data = "M" + (x + r) + "," + y + " C" + [x + r, y + rycirc, x + rcirc, y + ry, x, y + ry, x - rcirc, y + ry, x - r, y + rycirc, x - r, y, x - r, y - rycirc, x - rcirc, y - ry, x, y - ry, x + rcirc, y - ry, x + r, y - rycirc, x + r, y].join(",") + "z";
  } else if (type === "line") {
    data = "M" + attr.x1 + "," + attr.y1 + " L" + attr.x2 + "," + attr.y2; //previously, we just converted to "Mx,y Lx,y" but Safari has bugs that cause that not to render properly when using a stroke-dasharray that's not fully visible! Using a cubic bezier fixes that issue.
  } else if (type === "polyline" || type === "polygon") {
    points = (e.getAttribute("points") + "").match(_numbersExp) || [];
    x = points.shift();
    y = points.shift();
    data = "M" + x + "," + y + " L" + points.join(",");

    if (type === "polygon") {
      data += "," + x + "," + y + "z";
    }
  }

  path.setAttribute("d", _rawPathToString(path._gsRawPath = _stringToRawPath(data)));

  if (swap && e.parentNode) {
    e.parentNode.insertBefore(path, e);
    e.parentNode.removeChild(e);
  }

  return path;
},
    _parseShape = function _parseShape(shape, forcePath, target) {
  var isString = typeof shape === "string",
      e,
      type;

  if (!isString || _selectorExp.test(shape) || (shape.match(_numbersExp) || []).length < 3) {
    e = isString ? TweenLite.selector(shape) : shape && shape[0] ? shape : [shape]; //allow array-like objects like jQuery objects.

    if (e && e[0]) {
      e = e[0];
      type = (e.nodeName + "").toUpperCase();

      if (forcePath && type !== "PATH") {
        //if we were passed an element (or selector text for an element) that isn't a path, convert it.
        e = _convertToPath(e, false);
        type = "PATH";
      }

      shape = e.getAttribute(type === "PATH" ? "d" : "points") || "";

      if (e === target) {
        //if the shape matches the target element, the user wants to revert to the original which should have been stored in the data-original attribute
        shape = e.getAttributeNS(null, "data-original") || shape;
      }
    } else {
      _log("WARNING: invalid morph to: " + shape);

      shape = false;
    }
  }

  return shape;
},
    //adds an "isSmooth" array to each segment and populates it with a boolean value indicating whether or not it's smooth (the control points have basically the same slope). For any smooth control points, it converts the coordinates into angle (x, in radians) and length (y) and puts them into the same index value in a smoothData array.
_populateSmoothData = function _populateSmoothData(rawPath, tolerance) {
  var j = rawPath.length,
      limit = 0.2 * (tolerance || 1),
      smooth,
      segment,
      x,
      y,
      x2,
      y2,
      i,
      l,
      a,
      a2,
      isSmooth,
      smoothData;

  while (--j > -1) {
    segment = rawPath[j];
    isSmooth = segment.isSmooth = segment.isSmooth || [0, 0, 0, 0];
    smoothData = segment.smoothData = segment.smoothData || [0, 0, 0, 0];
    isSmooth.length = 4;
    l = segment.length - 2;

    for (i = 6; i < l; i += 6) {
      x = segment[i] - segment[i - 2];
      y = segment[i + 1] - segment[i - 1];
      x2 = segment[i + 2] - segment[i];
      y2 = segment[i + 3] - segment[i + 1];
      a = _atan2(y, x);
      a2 = _atan2(y2, x2);
      smooth = Math.abs(a - a2) < limit;

      if (smooth) {
        smoothData[i - 2] = a;
        smoothData[i + 2] = a2;
        smoothData[i - 1] = _sqrt(x * x + y * y);
        smoothData[i + 3] = _sqrt(x2 * x2 + y2 * y2);
      }

      isSmooth.push(smooth, smooth, 0, 0, smooth, smooth);
    } //if the first and last points are identical, check to see if there's a smooth transition. We must handle this a bit differently due to their positions in the array.


    if (segment[l] === segment[0] && segment[l + 1] === segment[1]) {
      x = segment[0] - segment[l - 2];
      y = segment[1] - segment[l - 1];
      x2 = segment[2] - segment[0];
      y2 = segment[3] - segment[1];
      a = _atan2(y, x);
      a2 = _atan2(y2, x2);

      if (Math.abs(a - a2) < limit) {
        smoothData[l - 2] = a;
        smoothData[2] = a2;
        smoothData[l - 1] = _sqrt(x * x + y * y);
        smoothData[3] = _sqrt(x2 * x2 + y2 * y2);
        isSmooth[l - 2] = isSmooth[l - 1] = true; //don't change indexes 2 and 3 because we'll trigger everything from the END, and this will optimize file size a bit.
      }
    }
  }

  return rawPath;
},
    _parseOriginFactors = function _parseOriginFactors(v) {
  var a = v.trim().split(" "),
      x = v.indexOf("left") >= 0 ? 0 : v.indexOf("right") >= 0 ? 100 : isNaN(parseFloat(a[0])) ? 50 : parseFloat(a[0]),
      y = v.indexOf("top") >= 0 ? 0 : v.indexOf("bottom") >= 0 ? 100 : isNaN(parseFloat(a[1])) ? 50 : parseFloat(a[1]);
  return {
    x: x / 100,
    y: y / 100
  };
},
    _shortAngle = function _shortAngle(dif) {
  return dif !== dif % _PI ? dif + (dif < 0 ? _2PI : -_2PI) : dif;
},
    _morphMessage = "Use MorphSVGPlugin.convertToPath(elementOrSelectorText) to convert to a path before morphing.",
    MorphSVGPlugin = _TweenLite._gsScope._gsDefine.plugin({
  propName: "morphSVG",
  API: 2,
  global: true,
  version: "0.9.0",
  //called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
  init: function init(target, value, tween, index) {
    var cs = window.getComputedStyle(target),
        fill = cs.fill + "",
        fillSafe = !(fill === "none" || (fill.match(_numbersExp) || [])[3] === "0" || cs.fillRule === "evenodd"),
        origins = (value.origin || "50 50").split(","),
        type,
        p,
        pt,
        shape,
        isPoly,
        shapeIndex,
        map,
        startSmooth,
        endSmooth,
        start,
        end,
        i,
        j,
        l,
        startSeg,
        endSeg,
        precompiled,
        sData,
        eData,
        originFactors,
        useRotation,
        offset;

    if (typeof value === "function") {
      value = value(index, target);
    }

    type = (target.nodeName + "").toUpperCase();
    isPoly = type === "POLYLINE" || type === "POLYGON";

    if (type !== "PATH" && !isPoly && !value.prop) {
      _log("WARNING: cannot morph a <" + type + "> element. " + _morphMessage);

      return false;
    }

    p = type === "PATH" ? "d" : "points";

    if (typeof value === "string" || value.getBBox || value[0]) {
      value = {
        shape: value
      };
    }

    if (!value.prop && typeof target.setAttribute !== "function") {
      return false;
    }

    shape = _parseShape(value.shape || value.d || value.points || "", p === "d", target);

    if (isPoly && _commands.test(shape)) {
      _log("WARNING: a <" + type + "> cannot accept path data. " + _morphMessage);

      return false;
    }

    shapeIndex = value.shapeIndex || value.shapeIndex === 0 ? value.shapeIndex : "auto";
    map = value.map || MorphSVGPlugin.defaultMap;
    this._prop = value.prop;
    this._render = value.render || MorphSVGPlugin.defaultRender;
    this._apply = "updateTarget" in value ? value.updateTarget : MorphSVGPlugin.defaultUpdateTarget;
    this._rnd = Math.pow(10, isNaN(value.precision) ? 2 : +value.precision);
    this._tween = tween;

    if (shape) {
      this._target = target;
      precompiled = _typeof(value.precompile) === "object";
      start = this._prop ? target[this._prop] : target.getAttribute(p);

      if (!this._prop && !target.getAttributeNS(null, "data-original")) {
        target.setAttributeNS(null, "data-original", start); //record the original state in a data-original attribute so that we can revert to it later.
      }

      if (p === "d" || this._prop) {
        start = _stringToRawPath(precompiled ? value.precompile[0] : start);
        end = _stringToRawPath(precompiled ? value.precompile[1] : shape);

        if (!precompiled && !_equalizeSegmentQuantity(start, end, shapeIndex, map, fillSafe)) {
          return false; //malformed path data or null target
        }

        if (value.precompile === "log" || value.precompile === true) {
          _log('precompile:["' + _rawPathToString(start) + '","' + _rawPathToString(end) + '"]');
        }

        useRotation = (value.type || MorphSVGPlugin.defaultType) !== "linear";

        if (useRotation) {
          start = _populateSmoothData(start, value.smoothTolerance);
          end = _populateSmoothData(end, value.smoothTolerance);

          if (!start.size) {
            _getTotalSize(start); //adds top/left/width/height values

          }

          if (!end.size) {
            _getTotalSize(end);
          }

          originFactors = _parseOriginFactors(origins[0]);
          this._origin = start.origin = {
            x: start.left + originFactors.x * start.width,
            y: start.top + originFactors.y * start.height
          };

          if (origins[1]) {
            originFactors = _parseOriginFactors(origins[1]);
          }

          this._eOrigin = {
            x: end.left + originFactors.x * end.width,
            y: end.top + originFactors.y * end.height
          };
        }

        this._rawPath = target._gsRawPath = start;
        j = start.length;

        while (--j > -1) {
          startSeg = start[j];
          endSeg = end[j];
          startSmooth = startSeg.isSmooth || [];
          endSmooth = endSeg.isSmooth || [];
          l = startSeg.length;
          _lastLinkedAnchor = 0; //reset; we use _lastLinkedAnchor in the _tweenRotation() method to help make sure that close points don't get ripped apart and rotate opposite directions. Typically we want to go the shortest direction, but if the previous anchor is going a different direction, we override this logic (within certain thresholds)

          for (i = 0; i < l; i += 2) {
            if (endSeg[i] !== startSeg[i] || endSeg[i + 1] !== startSeg[i + 1]) {
              if (useRotation) {
                if (startSmooth[i] && endSmooth[i]) {
                  //if BOTH starting and ending values are smooth (meaning control points have basically the same slope), interpolate the rotation and length instead of the coordinates (this is what makes things smooth).
                  sData = startSeg.smoothData;
                  eData = endSeg.smoothData;
                  offset = i + (i === l - 4 ? 7 - l : 5); //helps us accommodate wrapping (like if the end and start anchors are identical and the control points are smooth).

                  this._controlPT = {
                    _next: this._controlPT,
                    i: i,
                    j: j,
                    l1s: sData[i + 1],
                    l1c: eData[i + 1] - sData[i + 1],
                    l2s: sData[offset],
                    l2c: eData[offset] - sData[offset]
                  };
                  pt = this._tweenRotation(startSeg, endSeg, i + 2);

                  this._tweenRotation(startSeg, endSeg, i, pt);

                  this._tweenRotation(startSeg, endSeg, offset - 1, pt);

                  i += 4;
                } else {
                  this._tweenRotation(startSeg, endSeg, i);
                }
              } else {
                this._addTween(startSeg, i, startSeg[i], endSeg[i]);

                pt = this._addTween(startSeg, i + 1, startSeg[i + 1], endSeg[i + 1]);
              }
            }
          }
        }
      } else {
        pt = this._addTween(target, "setAttribute", target.getAttribute(p) + "", shape + "", "morphSVG", false, p, _buildPointsFilter(shapeIndex));
      }

      if (useRotation) {
        this._addTween(this._origin, "x", this._origin.x, this._eOrigin.x);

        pt = this._addTween(this._origin, "y", this._origin.y, this._eOrigin.y);
      }

      if (pt) {
        this._overwriteProps.push("morphSVG");

        pt.end = shape;
        pt.endProp = p;
      }
    }

    return true;
  },
  set: function set(ratio) {
    var rawPath = this._rawPath,
        controlPT = this._controlPT,
        anchorPT = this._anchorPT,
        rnd = this._rnd,
        target = this._target,
        s,
        space,
        easeInOut,
        pt,
        segment,
        l,
        angle,
        i,
        j,
        x,
        y,
        sin,
        cos,
        offset;

    this._super.setRatio.call(this, ratio);

    if (ratio === 1 && this._apply) {
      pt = this._firstPT;

      while (pt) {
        if (pt.end) {
          if (this._prop) {
            target[this._prop] = pt.end;
          } else {
            target.setAttribute(pt.endProp, pt.end); //make sure the end value is exactly as specified (in case we had to add fabricated points during the tween)
          }
        }

        pt = pt._next;
      }
    } else if (rawPath) {
      //rotationally position the anchors
      while (anchorPT) {
        angle = anchorPT.sa + ratio * anchorPT.ca;
        l = anchorPT.sl + ratio * anchorPT.cl; //length

        anchorPT.t[anchorPT.i] = this._origin.x + _cos(angle) * l;
        anchorPT.t[anchorPT.i + 1] = this._origin.y + _sin(angle) * l;
        anchorPT = anchorPT._next;
      } //smooth out the control points


      easeInOut = ratio < 0.5 ? 2 * ratio * ratio : (4 - 2 * ratio) * ratio - 1;

      while (controlPT) {
        i = controlPT.i;
        segment = rawPath[controlPT.j];
        offset = i + (i === segment.length - 4 ? 7 - segment.length : 5); //accommodates wrapping around of smooth points, like if the start and end anchors are on top of each other and their handles are smooth.

        angle = _atan2(segment[offset] - segment[i + 1], segment[offset - 1] - segment[i]); //average the angles

        sin = _sin(angle);
        cos = _cos(angle);
        x = segment[i + 2];
        y = segment[i + 3];
        l = controlPT.l1s + easeInOut * controlPT.l1c; //length

        segment[i] = x - cos * l;
        segment[i + 1] = y - sin * l;
        l = controlPT.l2s + easeInOut * controlPT.l2c;
        segment[offset - 1] = x + cos * l;
        segment[offset] = y + sin * l;
        controlPT = controlPT._next;
      }

      target._gsRawPath = rawPath;

      if (this._apply) {
        s = "";
        space = " ";

        for (j = 0; j < rawPath.length; j++) {
          segment = rawPath[j];
          l = segment.length;
          s += "M" + (segment[0] * rnd | 0) / rnd + space + (segment[1] * rnd | 0) / rnd + " C";

          for (i = 2; i < l; i++) {
            //this is actually faster than just doing a join() on the array, possibly because the numbers have so many decimal places
            s += (segment[i] * rnd | 0) / rnd + space;
          }
        }

        if (this._prop) {
          target[this._prop] = s;
        } else {
          target.setAttribute("d", s);
        }
      }
    }

    if (this._render && rawPath) {
      this._render.call(this._tween, rawPath, target);
    }
  }
});

exports.default = exports.MorphSVGPlugin = MorphSVGPlugin;

MorphSVGPlugin.prototype._tweenRotation = function (start, end, i, linkedPT) {
  var so = this._origin,
      //starting origin
  eo = this._eOrigin,
      //ending origin
  dx = start[i] - so.x,
      dy = start[i + 1] - so.y,
      d = _sqrt(dx * dx + dy * dy),
      //length from starting origin to starting point
  sa = _atan2(dy, dx),
      angleDif,
      short;

  dx = end[i] - eo.x;
  dy = end[i + 1] - eo.y;
  angleDif = _atan2(dy, dx) - sa;
  short = _shortAngle(angleDif); //in the case of control points, we ALWAYS link them to their anchor so that they don't get torn apart and rotate the opposite direction. If it's not a control point, we look at the most recently linked point as long as they're within a certain rotational range of each other.

  if (!linkedPT && _lastLinkedAnchor && Math.abs(short + _lastLinkedAnchor.ca) < _angleMin) {
    linkedPT = _lastLinkedAnchor;
  }

  return this._anchorPT = _lastLinkedAnchor = {
    _next: this._anchorPT,
    t: start,
    sa: sa,
    //starting angle
    ca: linkedPT && short * linkedPT.ca < 0 && Math.abs(short) > _angleMax ? angleDif : short,
    //change in angle
    sl: d,
    //starting length
    cl: _sqrt(dx * dx + dy * dy) - d,
    //change in length
    i: i
  };
};

MorphSVGPlugin.pathFilter = _pathFilter;
MorphSVGPlugin.pointsFilter = _pointsFilter;
MorphSVGPlugin.getTotalSize = _getTotalSize;
MorphSVGPlugin.subdivideRawBezier = MorphSVGPlugin.subdivideSegment = _subdivideSegment;
MorphSVGPlugin.rawPathToString = _rawPathToString;
MorphSVGPlugin.defaultType = "linear";
MorphSVGPlugin.defaultUpdateTarget = true;
MorphSVGPlugin.defaultMap = "size";

MorphSVGPlugin.stringToRawPath = MorphSVGPlugin.pathDataToRawBezier = function (data) {
  return _stringToRawPath(_parseShape(data, true));
};

MorphSVGPlugin.equalizeSegmentQuantity = _equalizeSegmentQuantity;

MorphSVGPlugin.convertToPath = function (targets, swap) {
  if (typeof targets === "string") {
    targets = TweenLite.selector(targets);
  }

  var a = !targets || targets.length === 0 ? [] : targets.length && targets[0] && targets[0].nodeType ? Array.prototype.slice.call(targets, 0) : [targets],
      i = a.length;

  while (--i > -1) {
    a[i] = _convertToPath(a[i], swap !== false);
  }

  return a;
};

MorphSVGPlugin.pathDataToBezier = function (data, vars) {
  //converts SVG path data into an array of {x, y} objects that can be plugged directly into a bezier tween. You can optionally pass in a 2D matrix like [a, b, c, d, tx, ty] containing numbers that should transform each point.
  var bezier = _stringToRawPath(_parseShape(data, true))[0] || [],
      prefix = 0,
      a,
      i,
      l,
      matrix,
      offsetX,
      offsetY,
      bbox,
      e;
  vars = vars || {};
  e = vars.align || vars.relative;
  matrix = vars.matrix || [1, 0, 0, 1, 0, 0];
  offsetX = vars.offsetX || 0;
  offsetY = vars.offsetY || 0;

  if (e === "relative" || e === true) {
    offsetX -= bezier[0] * matrix[0] + bezier[1] * matrix[2];
    offsetY -= bezier[0] * matrix[1] + bezier[1] * matrix[3];
    prefix = "+=";
  } else {
    offsetX += matrix[4];
    offsetY += matrix[5];

    if (e) {
      e = typeof e === "string" ? TweenLite.selector(e) : e && e[0] ? e : [e]; //allow array-like objects like jQuery objects.

      if (e && e[0]) {
        bbox = e[0].getBBox() || {
          x: 0,
          y: 0
        };
        offsetX -= bbox.x;
        offsetY -= bbox.y;
      }
    }
  }

  a = [];
  l = bezier.length;

  if (matrix && matrix.join(",") !== "1,0,0,1,0,0") {
    for (i = 0; i < l; i += 2) {
      a.push({
        x: prefix + (bezier[i] * matrix[0] + bezier[i + 1] * matrix[2] + offsetX),
        y: prefix + (bezier[i] * matrix[1] + bezier[i + 1] * matrix[3] + offsetY)
      });
    }
  } else {
    for (i = 0; i < l; i += 2) {
      a.push({
        x: prefix + (bezier[i] + offsetX),
        y: prefix + (bezier[i + 1] + offsetY)
      });
    }
  }

  return a;
};
},{"gsap/TweenLite.js":"node_modules/gsap/TweenLite.js"}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56303" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
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

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

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

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/assets/MorphSVGPlugin.js"], null)
//# sourceMappingURL=/MorphSVGPlugin.6425fa5d.map