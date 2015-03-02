var WatchableObject = require("..");
var assert          = require("assert");
var sinon           = require("sinon");

describe(__filename + "#", function () {

  it("can create a new watchable object", function () {
    new WatchableObject();
  });

  it("can set properties on the watchable object", function () {
    var wo = new WatchableObject({a: "b" });
    assert.equal(wo.a, "b");
  });

  it("can 'get' a property", function () {
    assert.equal(new WatchableObject({a:"b"}).get("a"), "b");
  });

  it("can 'get' a deep property", function () {
    assert.equal(new WatchableObject({a:{b:{c:"d"}}}).get("a.b.c"), "d");
  });

  it("can 'get' a deep property that doesn't exist", function () {
    assert.equal(new WatchableObject().get("a.b.c"), void 0);
  });

  it("can 'set' a property", function () {
    var wo = new WatchableObject();
    wo.set("a", "b");
    assert.equal(wo.a, "b");
  });

  it("can 'set' a deep property", function () {
    var wo = new WatchableObject();
    wo.set("a.b.c", "d");
    assert.equal(wo.a.b.c, "d");
  });

  it("can 'set' a deep property on a sub object", function () {
    var wo = new WatchableObject({a:new WatchableObject({b:new WatchableObject()})});
    var aspy = sinon.spy(wo.a, "set");
    var bspy = sinon.spy(wo.a.b, "set");
    wo.set("a.b.c", "d");
    assert.equal(aspy.callCount, 1);
    assert.equal(bspy.callCount, 1);
  });

  it("can set multiple properties", function () {
    var wo = new WatchableObject();
    wo.setProperties({ a: 1, b: 2 });
    assert.equal(wo.a, 1);
    assert.equal(wo.b, 2);
  });
});