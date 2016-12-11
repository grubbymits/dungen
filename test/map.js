var assert = chai.assert;
var expect = chai.expect;

describe('Vec', function() {
  describe('#getCost()', function() {
    it('The cost is 2 for vertical or horizontal and ~2.88 for diagonals', function() {
      var vec1 = new Vec(0, 0);
      var vec2 = new Vec(1, 1);
      var vec3 = new Vec(0, 1);
      var vec4 = new Vec(1, 0);
      var vec5 = new Vec(2, 2);
      assert.equal(vec1.getCost(vec2), Math.sqrt(8));
      assert.equal(vec1.getCost(vec3), 2);
      assert.equal(vec1.getCost(vec4), 2);
      assert.equal(vec3.getCost(vec4), Math.sqrt(8));
      assert.equal(vec5.getCost(vec1), Math.sqrt(32));
    });
  });

  describe('#isSame()', function() {
    it('Compare vecs', function() {
      var vec1 = new Vec(0, 0);
      var vec2 = new Vec(1, 1);
      var vec3 = new Vec(0, 0);
      assert.equal(vec1.isSame(vec2), false);
      assert.equal(vec3.isSame(vec1), true);
    });
  });
});


describe('Location', function() {
  describe('#isBlocked()', function() {
    it('locations can be blocked for many various', function() {
      
      // block on tile type
      let loc0 = new Location(false, null, CEILING, 0, 0);
      assert.equal(loc0.isBlocked, true);
      let loc1 = new Location(false, null, WALL, 0, 0);
      assert.equal(loc1.isBlocked, true);
      let loc2 = new Location(false, null, SPIKES, 0, 0);
      assert.equal(loc2.isBlocked, true);
      let loc3 = new Location(false, null, WATER, 0, 0);
      assert.equal(loc3.isBlocked, true);
      
      loc0.type = PATH;
      assert.equal(loc0.isBlocked, false);
      
      // blocking
      let loc4 = new Location(true, null, PATH, 0, 0);
      assert.equal(loc4.isBlocked, true);
      let loc5 = new Location(true, null, DIRT, 0, 0);
      assert.equal(loc5.isBlocked, true);
      
      // clear
      let loc6 = new Location(false, null, PATH, 0, 0);
      assert.equal(loc6.isBlocked, false);
      let loc7 = new Location(false, null, DIRT, 0, 0);
      assert.equal(loc7.isBlocked, false);
      
      // entity
      let loc8 = new Location(false, 1, PATH, 0, 0);
      assert.equal(loc8.isBlocked, true);
      let loc9 = new Location(false, 1, DIRT, 0, 0);
      assert.equal(loc9.isBlocked, true);
    });
  });
});

let vec = new Vec(0, 0);
let entity = { name: "test-entity" };

describe('GameMap', function() {
  describe('#constructor(width, height)', function() {
    it('Construct map', function() {
      var fn = function() { new GameMap(160, 160); };
      expect(fn).to.throw(Error, "incompatible map dimension(s)");
      let map = new GameMap(256, 256);
    });
  });
  describe('#setLocationType(x, y, type), getLocationType(x, y)', function() {
    it('Change the tile type', function() {
      let map = new GameMap(256, 256);
      map.setLocationType(0, 0, PATH);
      assert.equal(map.getLocationType(0, 0), PATH);
    });
  });
  describe('#isBlocked(vec)', function() {
    it('query whether the vec is blocked', function() {
      let map = new GameMap(256, 256);
      assert.equal(map.isBlocked(vec), true);
      map.setLocationType(0, 0, PATH);
      assert.equal(map.isBlocked(vec), false);
    });
  });
  describe('#placeEntity(vec, entity)', function() {
    it('Place entity in the map', function() {
      
      let map = new GameMap(256, 256);
      // map locations all begin as CEILING, so shouldn't be able to place
      // anything on them.
      assert.isUndefined(map.placeEntity(vec, entity),
                         "trying to place in non empty loc!");
      
      map.setLocationType(0, 0, PATH);
      map.placeEntity(vec, entity);
      assert.equal(map.isBlocked(vec), true);
    });
  });
  describe('#removeEntity(vec)', function() {
    it('Remove entity in the map', function() {
      let map = new GameMap(256, 256);
      map.setLocationType(0, 0, PATH);
      map.placeEntity(vec, entity);
      map.removeEntity(vec);
      assert.equal(map.isBlocked(vec), false);
    });
  });
  describe('#getEntity(vec)', function() {
    it('from entity from the map', function() {
      let map = new GameMap(256, 256);
      map.placeEntity(vec, entity);
      assert.equal(map.getEntity(vec).name, "test-entity");
    });
  });
  describe('#getNeighbours(vec)', function() {
    it('get free locations around the vec', function() {
      let map = new GameMap(256, 256);
      map.setLocationType(0, 0, PATH);
      assert.equal(map.getNeighbours(vec).length, 0);
      map.setLocationType(1, 0, PATH);
      assert.equal(map.getNeighbours(vec).length, 1);
      map.setLocationType(1, 1, PATH);
      assert.equal(map.getNeighbours(vec).length, 1);
      map.setLocationType(0, 1, PATH);
      assert.equal(map.getNeighbours(vec).length, 3);
    });
  });
  describe('#getPath(start, goal)', function() {
    it('Get an array of vecs as a path', function() {
      let map = new GameMap(256, 256);
      let start = new Vec(0, 0);
      let goal = new Vec(2, 0);
      let obstacle = new Vec(1, 0);
      
      map.setLocationType(0, 0, PATH);
      map.setLocationType(0, 1, PATH);
      map.setLocationType(1, 1, PATH);
      map.setLocationType(2, 1, PATH);
      map.setLocationType(2, 0, PATH);
      assert.equal(map.getPath(start, goal).length, 4);
     
      map.setLocationType(1, 0, PATH);
      map.placeEntity(obstacle, entity);
      assert.equal(map.getPath(start, goal).length, 4);
    });
  });
});