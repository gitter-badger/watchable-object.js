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
    wo.set("a.b.c", "d2");
    assert.equal(wo.a.b.c, "d2");
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

  it("can watch for changes", function () {
    var wo = new WatchableObject();
    var i = 0;
    wo.watch(function () {
      i++;
    });
    wo.set("a", 2);
    assert.equal(i, 1);
  });

  it("can watch for changes on a sub object", function () {
    var wo = new WatchableObject({a:new WatchableObject()});
    var i = 0;
    wo.watch(function () {
      i++;
    });
    wo.set("a.b", 2);
    assert.equal(i, 1);
    wo.set("c", 1);
    assert.equal(i, 2);
  });


  it("can watch for changes on a deep sub object", function () {
    var wo = new WatchableObject({a:new WatchableObject({b:new WatchableObject()})});
    var i = 0;
    wo.watch(function () {
      i++;
    });
    wo.set("a.b.c", 2);
    assert.equal(i, 1);
    wo.set("a.b.d", 2);
    assert.equal(i, 2);
    wo.set("a.c.d", 2);
    assert.equal(i, 3);

    wo.a.b.set("d", 2);
    assert.equal(i, 4);
  });

  it("can add and dispose a listener", function () {
    new WatchableObject().watch(function() {}).dispose();
  });

  it("can add multiple listeners", function () {
    var wo = new WatchableObject();
    var i = 0;
    var l1 = wo.watch(function(){ i++ });
    var l2 = wo.watch(function(){ i++ });
    var l3 = wo.watch(function(){ i++ });
    wo.set("a", 1);
    assert.equal(i, 3);

    l1.dispose();
    l2.dispose();
    l3.dispose();
  });

  it("can removes watchable", function () {
    var i = 0;
    var wo = new WatchableObject({a:new WatchableObject()});
    var wo2 = wo.a;
    wo.set("a", void 0);
    wo.watch(function () {
      i++;
    });
    wo2.set("a", 1);
    assert.equal(i, 0);
  })




});