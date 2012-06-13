(function() {
  var Linc, isArray, isFunction, isObject, parseNames, root, _ref;
  var __hasProp = Object.prototype.hasOwnProperty;

  root = this;

  Linc = (typeof exports !== "undefined" && exports !== null) && this || (this.Linc = {});

  Linc._functions = {};

  Linc._defaults = {
    namespace: [],
    context: root
  };

  Linc.add = function() {
    var initFn, module, nSpace, name, nameObj, ns, _base, _i, _len, _ref;
    nameObj = parseNames(arguments[0]);
    initFn = arguments[arguments.length - 1];
    name = nameObj.name;
    nSpace = nameObj.namespaces;
    if (!name) return null;
    module = {
      options: isObject(arguments[1]) ? arguments[1] : {},
      init: initFn
    };
    if (nSpace && nSpace.length) {
      for (_i = 0, _len = nSpace.length; _i < _len; _i++) {
        ns = nSpace[_i];
        if ((_ref = (_base = this._functions)[ns]) == null) _base[ns] = {};
        this._functions[ns][name] = module;
      }
    } else {
      this._functions[name] = module;
    }
    return module;
  };

  Linc.get = function(name) {
    var module, nameObj, ns;
    nameObj = parseNames(name);
    name = nameObj.name;
    ns = nameObj.namespaces.shift();
    return module = ns ? this._functions[ns][name] : this._functions[name];
  };

  Linc.run = function() {
    var all, args, context, funcs, module, nSpace, name, nameObj, namespaceOnly, ns, o, _i, _len, _ref, _ref2, _ref3;
    args = arguments;
    nameObj = args.length && !isObject(args[0]) ? parseNames(args[0]) : {};
    name = nameObj.name;
    nSpace = (_ref = nameObj.namespaces) != null ? _ref : this._defaults.namespace.slice(0);
    o = isObject(args[args.length - 1]) ? args[args.length - 1] : {};
    context = (_ref2 = o.context) != null ? _ref2 : this._defaults.context;
    all = o.all;
    namespaceOnly = o.namespaceOnly;
    if (all) {
      nSpace = (function() {
        var _ref3, _results;
        _ref3 = this._functions;
        _results = [];
        for (name in _ref3) {
          if (!__hasProp.call(_ref3, name)) continue;
          ns = _ref3[name];
          if (!isFunction(ns.init)) _results.push(name);
        }
        return _results;
      }).call(this);
    }
    if (!namespaceOnly) nSpace.push(null);
    for (_i = 0, _len = nSpace.length; _i < _len; _i++) {
      ns = nSpace[_i];
      funcs = (_ref3 = this._functions[ns]) != null ? _ref3 : this._functions;
      for (name in funcs) {
        if (!__hasProp.call(funcs, name)) continue;
        module = funcs[name];
        if (isFunction(module.init)) {
          if (!(module.options.once && module.called)) {
            module.init.call(context);
            module.called = true;
          }
        }
      }
    }
    return Linc;
  };

  Linc.setDefaults = function(o) {
    var option, value;
    for (option in o) {
      if (!__hasProp.call(o, option)) continue;
      value = o[option];
      if (option === 'namespace') {
        this._defaults[option] = isArray(value) ? value : [];
        if (!this._defaults[option].length && value) {
          this._defaults[option].push(value);
        }
      } else {
        this._defaults[option] = value;
      }
    }
    return this._defaults;
  };

  parseNames = function(s) {
    var returnObj, split, _ref, _ref2;
    split = s.match(/^([^\.]*)?(?:\.(.+))?$/);
    return returnObj = {
      name: split[1],
      namespaces: (_ref = (_ref2 = split[2]) != null ? _ref2.split('.') : void 0) != null ? _ref : Linc._defaults.namespace.slice(0)
    };
  };

  isArray = (_ref = Array.isArray) != null ? _ref : function(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  };

  isFunction = function(o) {
    return Object.prototype.toString.call(o) === '[object Function]';
  };

  isObject = function(o) {
    return o === Object(o) && !isFunction(o);
  };

}).call(this);
