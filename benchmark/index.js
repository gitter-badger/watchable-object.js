var Benchmark = require("benchmark");
var suite = new Benchmark.Suite();

var WatchableObject = require("..");


var kp = ["a", "b", "c"];
suite.add("WatchableObject.get([a,b,c])", function () {
  new WatchableObject({a:{b:{c:1}}}).get(kp);
});

suite.add("new WatchableObject()", function () {
  new WatchableObject();
});

suite.add("new WatchableObject({a:1,b:2,c:3})", function () {
  new WatchableObject({a:1,b:2,c:3});
});


suite.add("WatchableObject.get(a)", function () {
  new WatchableObject({a:1}).get("a");
});

suite.add("WatchableObject.get(a.b.c)", function () {
  new WatchableObject({a:{b:{c:1}}}).get("a.b.c");
});

var kp = ["a", "b", "c"];
suite.add("WatchableObject.get([a,b,c])", function () {
  new WatchableObject({a:{b:{c:1}}}).get(kp);
});


suite.add("undefined WatchableObject.get(a.b.c)", function () {
  new WatchableObject().get("a.b.c");
});

suite.add("WatchableObject.set(a, 1)", function () {
  new WatchableObject().set("a", 1);
});

suite.add("WatchableObject.set(a.b.c, 1)", function () {
  new WatchableObject().set("a.b.c", 1);
});

suite.add("WatchableObject({a:WatchableObject}).set(a.b.c, 1)", function () {
  new WatchableObject({a:new WatchableObject()}).set("a.b.c", 1);
});

suite.on("cycle", function (event) {
  console.log(String(event.target));
});


suite.on("complete", function() {
  console.log("Fastest is '%s'", this.filter("fastest").pluck("name"));
});

suite.run({ async: true });