var protoclass = require("protoclass");

/**
 */

function WatchableObject(properties) {
  this.__watchable = {};
  if (properties) {
    for (var key in properties) {
      this._watchChild(key, this[key] = properties[key]);
    }
  }
}

/**
 */

protoclass(WatchableObject, {

  /**
   */

  watch: function(listener) {

    if (!this._listeners) {
      this._listeners = listener;
    } else if (typeof this._listeners === "function") {
      this._listeners = [this._listeners, listener];
    } else {
      this._listeners.push(listener);
    }

    var self = this;

    return {
      dispose: function() {
        var i = 0;
        if (typeof self._listeners !== "function" && ~(i = self._listeners.indexOf(listener))) {
          self._listeners.splice(i, 1);
          if (self._listeners.length === 0) self._listeners = void 0;
        } else {
          self._listeners = void 0;
        }
      }
    };
  },

  /**
   */

  get: function(property) {

    var isString;

    // optimal
    if ((isString = (typeof property === "string")) && !~property.indexOf(".")) {
      return this[property];
    }

    // avoid split if possible
    var chain = isString ? property.split(".") : property;
    var cv    = this;

    // go through all the properties
    for (var i = 0, n = chain.length - 1; i < n; i++) {

      cv    = cv[chain[i]];

      if (!cv) return;

      if (cv.get) return cv.get(property);
    }

    // might be a bindable objectc
    return cv[chain[i]];
  },

  /**
   */

  set: function(property, value, trigger) {
    var keypath;

    if (typeof property === "string") {
      keypath = property.split(".");
    } else {
      keypath = property;
    }

    var cv = this;
    var hasChanged = this.get(keypath) !== value;
    var nv;

    for (var i = 0, n = keypath.length - 1; i < n; i++) {
      nv = cv[keypath[i]];
      if (nv && nv.set) {
        return nv.set(keypath.slice(i + 1), value);
      } else if (!nv) {
        nv = cv[keypath[i]] = {};
      }

      cv = nv;
    }

    cv[keypath[i]] = value;

    if (cv == this) {
      this._watchChild(property, value);
    }

    if (trigger !== false) this._triggerChange();
  },

  /**
   */

  _watchChild: function(property, value) {

    if (!value || !value.watch) {
      if (this.__watchable[property]) this.__watchable[property].dispose();
      this.__watchable[property] = void 0;
      return;
    }

    var self = this;

    this.__watchable[property] = value.watch(function() {
      self._triggerChange();
    });
  },

  /**
   */

  setProperties: function(properties) {
    for (var key in properties) {
      this.set(key, properties[key], false);
    }
    this._triggerChange();
  },

  /**
   */

  _triggerChange: function() {
    if (this._listeners) {
      if (typeof this._listeners === "function") {
        return this._listeners();
      }
      for (var i = this._listeners.length; i--;) {
        this._listeners[i]();
      }
    }
  }
});

module.exports = WatchableObject;
