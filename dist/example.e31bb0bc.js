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
})({"../src/vNode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * 参数参照react的createElement
 * 主要是为了以后可能用jsx，毕竟我现在还不会编译原理
 */
var uid = 0;

function VNode(name, props, children) {
  this.name = name;
  this.props = props || {};
  this.children = children || [];
  this.uid = uid++;
  this.patches = [];
}

var _default = VNode;
exports.default = _default;
},{}],"../src/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupProps = exports.isEmptyObject = exports.forOwn = void 0;

var forOwn = function forOwn(obj, fn) {
  Object.keys(obj).forEach(function (key) {
    return fn(key, obj[key]);
  });
};

exports.forOwn = forOwn;

var isEmptyObject = function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}; // 分离attributes和events


exports.isEmptyObject = isEmptyObject;

var groupProps = function groupProps(vNode) {
  var props = vNode.props;
  var events = [];
  var attributes = [];
  Object.keys(props).forEach(function (key) {
    if (key.startsWith('on')) {
      var eventName = key.slice(2).toLowerCase();
      var eventHandler = props[key];

      if (events[eventName]) {
        events[eventName].push(eventHandler);
      } else {
        events[eventName] = [eventHandler];
      }
    } else {
      attributes[key] = props[key];
    }
  });
  return {
    events: events,
    attributes: attributes
  };
};

exports.groupProps = groupProps;
},{}],"../src/webDom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var _vNode = _interopRequireDefault(require("./vNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebDom = {};

WebDom.render = function (vNode, target) {
  var name = vNode.name,
      children = vNode.children;

  var _groupProps = (0, _utils.groupProps)(vNode),
      events = _groupProps.events,
      attributes = _groupProps.attributes;

  var elm = document.createElement(name); // 添加属性

  Object.keys(attributes).forEach(function (key) {
    var prop = attributes[key];

    if (key === 'style') {
      Object.assign(elm.style, prop);
    } else if (key === 'className') {
      elm.className = prop;
    } else {
      elm.setAttribute(key, prop);
    }
  }); // 添加事件

  Object.keys(events).forEach(function (eventName) {
    var handlers = events[eventName];
    handlers.forEach(function (handler) {
      return elm.addEventListener(eventName, handler);
    });
  }); // 渲染子节点

  children.forEach(function (child) {
    var childNode;

    if (child instanceof _vNode.default) {
      childNode = WebDom.render(child);
    } else {
      childNode = document.createTextNode(child);
    }

    elm.appendChild(childNode);
  });
  target && target.appendChild(elm);
  return elm;
};

var _default = WebDom;
exports.default = _default;
},{"./utils":"../src/utils.js","./vNode":"../src/vNode.js"}],"../src/const.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var diffType = {
  REMOVE: 1,
  PROPS: 2,
  REPLACE: 3,
  INSERT: 4,
  TEXT: 5
};
var _default = diffType;
exports.default = _default;
},{}],"../src/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _const = _interopRequireDefault(require("./const"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var REMOVE = _const.default.REMOVE,
    REPLACE = _const.default.REPLACE,
    INSERT = _const.default.INSERT,
    TEXT = _const.default.TEXT,
    PROPS = _const.default.PROPS;
/**
 * diff 两个VNode之间的差异并返回，不递归diff子节点
 * @param {VNode} oldNode 
 * @param {VNode} newNode 
 */

var diffNode = function diffNode(oldNode, newNode) {
  if (typeof oldNode === 'string' && typeof newNode === 'string') {
    if (oldNode !== newNode) {
      return [TEXT, newNode];
    }

    return false;
  }

  if (oldNode.name !== newNode.name) {
    return [REPLACE, newNode];
  }

  var propsDiff = {};
  var oldProps = oldNode.props;
  var newProps = newNode.props; // 认为事件绑定函数不会改变
  // 插入和修改prop

  Object.keys(newProps).filter(function (prop) {
    return !prop.startsWith('on');
  }).forEach(function (key) {
    if (oldProps.hasOwnProperty(key)) {
      // 对于style特殊处理
      if (key === 'style') {
        var oldStyle = oldProps.style;
        var newStyle = newProps.style;
        var styleDiff = {};
        (0, _utils.forOwn)(newStyle, function (key, value) {
          if (oldStyle.hasOwnProperty(key)) {
            if (oldStyle[key] !== value) {
              styleDiff[key] = [REPLACE, value];
            }
          } else {
            styleDiff[key] = [INSERT, value];
          }
        });
        (0, _utils.forOwn)(oldStyle, function (key, value) {
          if (!newStyle.hasOwnProperty(key)) {
            styleDiff[key] = [REMOVE];
          }
        });

        if (!(0, _utils.isEmptyObject)(styleDiff)) {
          propsDiff.style = styleDiff;
        }
      } else if (oldProps[key] !== newProps[key]) {
        propsDiff[key] = [REPLACE, newProps[key]];
      }
    } else {
      propsDiff[key] = [INSERT, newProps[key]];
    }
  }); // 删除prop

  Object.keys(oldProps).filter(function (prop) {
    return !prop.startsWith('on');
  }).forEach(function (key) {
    if (!newProps.hasOwnProperty(key)) {
      propsDiff[key] = [REMOVE];
    }
  });
  if (Object.keys(propsDiff).length === 0) return false;
  return [PROPS, propsDiff];
};

var diffTree = function diffTree(oldTree, newTree) {
  var result = [];
  var path = 0; // 同步dfs两个树，需要注意保持同步
  // 已经有过经验了，递归dfs快于手动堆栈

  var dfsDiff = function dfsDiff(tree1, tree2) {
    path++;
    var rootPath = path;
    var differenec = diffNode(tree1, tree2);
    if (differenec) result.push([path].concat(_toConsumableArray(differenec)));
    var diffType = differenec[0]; // 如果是替换或者文本节点，不用递归往下

    if ([REPLACE, TEXT].includes(diffType) || typeof tree1 === 'string') return;

    var children1 = _toConsumableArray(tree1.children);

    var children2 = _toConsumableArray(tree2.children);

    var maxChildCount = Math.max(children1.length, children2.length);

    for (var i = 0; i < maxChildCount; i++) {
      // 插入
      if (i > children1.length - 1) {
        // 注意插入这里要使用父节点的path
        result.push([rootPath, INSERT, children2[i]]);
        continue;
      } // 删除


      if (i > children2.length - 1) {
        path++;
        result.push([path, REMOVE, children1[i]]);
        continue;
      }

      dfsDiff(children1[i], children2[i]);
    }
  };

  dfsDiff(oldTree, newTree);
  return result;
};

var _default = diffTree;
exports.default = _default;
},{"./const":"../src/const.js","./utils":"../src/utils.js"}],"../src/patch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _const = _interopRequireDefault(require("./const"));

var _utils = require("./utils");

var _webDom = _interopRequireDefault(require("./webDom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var REMOVE = _const.default.REMOVE,
    REPLACE = _const.default.REPLACE,
    INSERT = _const.default.INSERT,
    TEXT = _const.default.TEXT,
    PROPS = _const.default.PROPS;

var patch = function patch() {
  var difference = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var target = arguments.length > 1 ? arguments[1] : undefined;

  if (!target) {
    throw new Error('target is required');
  }

  var path = 0;
  var actions = [];

  var dfs = function dfs(node) {
    path++;
    var diff = difference.filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          _path = _ref2[0];

      return path === _path;
    }).map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 3),
          p = _ref4[0],
          action = _ref4[1],
          modifier = _ref4[2];

      return [action, modifier];
    });
    diff.forEach(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          action = _ref6[0],
          modifier = _ref6[1];

      if (action === REMOVE) {
        node.parentNode.removeChild(node);
      }

      if (action === REPLACE) {
        var newNode = _webDom.default.render(modifier);

        node.parentNode.replaceChild(newNode, node);
      }

      if (action === TEXT) {
        node.textContent = modifier;
      }

      if (action === PROPS) {
        Object.keys(modifier).forEach(function (prop) {
          if (prop === 'style') {
            (0, _utils.forOwn)(modifier[prop], function (key, ob) {
              var _ob = _slicedToArray(ob, 2),
                  _action = _ob[0],
                  value = _ob[1];

              if (_action === REMOVE) node.style.removeProperty(key);
              if (_action === INSERT || _action === REPLACE) node.style[key] = value;
            });
          } else {
            var _modifier$prop = _slicedToArray(modifier[prop], 2),
                _action = _modifier$prop[0],
                value = _modifier$prop[1];

            if (_action === REMOVE) node.removeAttribute(prop);
            if (_action === INSERT || _action === REPLACE) node.setAttribute(prop, value);
          }
        });
      } // 插入会影响后续的遍历，放入actions，遍历之后统一插入


      if (action === INSERT) {
        actions.push(function () {
          return node.appendChild(_webDom.default.render(modifier));
        });
      }
    }); // 插入，删除不用遍历子节点

    if (diff[0] && [REPLACE, REMOVE].includes(diff[0][0])) {
      return;
    }

    node.childNodes.forEach(function (childNode) {
      return dfs(childNode);
    });
  };

  dfs(target);
  actions.forEach(function (action) {
    return action();
  });
};

var _default = patch;
exports.default = _default;
},{"./const":"../src/const.js","./utils":"../src/utils.js","./webDom":"../src/webDom.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _vNode = _interopRequireDefault(require("../src/vNode.js"));

var _webDom = _interopRequireDefault(require("../src/webDom.js"));

var _diff = _interopRequireDefault(require("../src/diff.js"));

var _patch = _interopRequireDefault(require("../src/patch.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handleClick = function handleClick(e) {
  console.log(e, 'clicked');
};

var li = function li(text, color) {
  return new _vNode.default('li', {
    style: {
      color: color
    }
  }, [text]);
};

var ul = new _vNode.default('ul', {
  onClick: handleClick,
  className: 'container'
}, [li('列表项1', 'blue'), li('列表项2', 'pink'), li('列表项3', 'blueviolet')]);

_webDom.default.render(ul, document.getElementById('app'));

var ul2 = new _vNode.default('ul', {
  onClick: handleClick,
  className: 'container__'
}, [li('text', 'blue'), new _vNode.default('div', {}, ['replace']), li('列表项3', 'red'), li('insert', 'red')]);
var ul3 = new _vNode.default('ul', {
  onClick: handleClick,
  className: 'container__'
}, [li('text', 'blueviolet'), new _vNode.default('div', {}, ['replace'])]);

var checkPatchInsert = function checkPatchInsert() {
  var patches = (0, _diff.default)(ul, ul2);
  (0, _patch.default)(patches, document.querySelector('.container'));
};

var checkPatchDelete = function checkPatchDelete() {
  var patches = (0, _diff.default)(ul, ul3);
  (0, _patch.default)(patches, document.querySelector('.container'));
};

var btnInsert = new _vNode.default('button', {
  onClick: checkPatchInsert
}, ['Insert']);
var btnRemove = new _vNode.default('button', {
  onClick: checkPatchDelete
}, ['Remove']);
var btnRecover = new _vNode.default('button', {
  onClick: function onClick() {
    return _webDom.default.render(ul, document.getElementById('app'));
  }
}, ['Recover']);

_webDom.default.render(btnInsert, document.getElementById('btnwrap'));

_webDom.default.render(btnRecover, document.getElementById('btnwrap'));

_webDom.default.render(btnRemove, document.getElementById('btnwrap'));
},{"../src/vNode.js":"../src/vNode.js","../src/webDom.js":"../src/webDom.js","../src/diff.js":"../src/diff.js","../src/patch.js":"../src/patch.js"}],"../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62112" + '/');

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
},{}]},{},["../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/example.e31bb0bc.map