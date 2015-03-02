var protoclass = require("protoclass");

function WatchableObject(properties) {
  if (properties) {
    for (var key in properties) {
      this[key] = properties[key];
    }
  }
}

/**
 */

protoclass(WatchableObject, {

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
    }

    // might be a bindable objectc
    if (cv) return cv[chain[i]];
  },

  /**
   */

  set: function(property, value) {
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
  },

  /**
   */

  setProperties: function(properties) {
    for (var key in properties) {
      this.set(key, properties[key]);
    }
  },

  /**
   */

  watch: function (property, listener) {
    
  }
});

module.exports = WatchableObject;
