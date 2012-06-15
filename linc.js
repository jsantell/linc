(function() {

  /*
  linc
  js execution controller
  @weblinc, @jsantell (c) 2012
  */

  var Linc, isArray, isFunction, isObject, root, _ref;
  var __hasProp = Object.prototype.hasOwnProperty;

  root = this;

  Linc = (typeof exports !== "undefined" && exports !== null) && this || (this.Linc = {});

  Linc._functions = {};

  Linc._defaults = {
    namespace: [],
    context: root
  };

  Linc.add = function() {
    var initFn, module, nMap, ns, options, _base, _i, _len, _ref, _ref2;
    nMap = this._parseNames(arguments[0]);
    options = this._makeOptions(arguments[1]);
    initFn = arguments[arguments.length - 1];
    if (!nMap.name) return null;
    module = {
      options: options,
      init: initFn,
      called: 0
    };
    if (nMap.namespaces.length) {
      _ref = nMap.namespaces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ns = _ref[_i];
        ((_ref2 = (_base = this._functions)[ns]) != null ? _ref2 : _base[ns] = {})[nMap.name] = module;
      }
    } else {
      this._functions[nMap.name] = module;
    }
    return module;
  };

  Linc.get = function(name) {
    var nMap, _ref;
    nMap = this._parseNames(name);
    return ((_ref = this._functions[nMap.namespaces.shift()]) != null ? _ref : this._functions)[nMap.name];
  };

  Linc.run = function() {
    var all, args, context, data, key, module, nMap, name, ns, nsOnly, o, _i, _len, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    args = arguments;
    nMap = this._parseNames(arguments[0]);
    o = this._makeOptions(arguments[arguments.length - 1]);
    context = (_ref = o.context) != null ? _ref : this._defaults.context;
    all = o.all;
    data = o.data;
    nsOnly = o.namespaceOnly;
    if (all) {
      _ref2 = this._functions;
      for (key in _ref2) {
        if (!__hasProp.call(_ref2, key)) continue;
        ns = _ref2[key];
        if (!isFunction(ns.init)) {
          ((_ref3 = nMap.namespaces) != null ? _ref3 : nMap.namespaces = []).push(key);
        }
      }
    }
    if (!nsOnly) {
      ((_ref4 = nMap.namespaces) != null ? _ref4 : nMap.namespaces = []).push(null);
    }
    if (nMap.name) {
      this._call(this.get(args[0]), context, data);
    } else {
      _ref5 = nMap.namespaces;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        ns = _ref5[_i];
        _ref7 = (_ref6 = this._functions[ns]) != null ? _ref6 : this._functions;
        for (name in _ref7) {
          if (!__hasProp.call(_ref7, name)) continue;
          module = _ref7[name];
          this._call(module, context, data);
        }
      }
    }
    return this;
  };

  Linc.setDefaults = function(o) {
    var option, value;
    for (option in o) {
      if (!__hasProp.call(o, option)) continue;
      value = o[option];
      if (option === 'namespace') {
        this._defaults[option] = isArray(value) ? value : [value];
      } else {
        this._defaults[option] = value;
      }
    }
    return this._defaults;
  };

  Linc._call = function(module, context, data) {
    if (isFunction(module.init)) {
      if (!(module.options.once && module.called)) {
        module.init.call(context, data);
        return module.called++;
      }
    }
  };

  Linc._parseNames = function(s) {
    var returnObj, split, _ref, _ref2;
    if (!s || isObject(s)) s = '';
    split = s.match(/^([^\.]*)?(?:\.(.+))?$/);
    return returnObj = {
      name: split[1],
      namespaces: (_ref = (_ref2 = split[2]) != null ? _ref2.split('.') : void 0) != null ? _ref : this._defaults.namespace.slice(0)
    };
  };

  Linc._makeOptions = function(o) {
    if (isObject(o)) {
      return o;
    } else {
      return {};
    }
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
