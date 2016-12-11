"use strict";

const LARGE = 0;
const MEDIUM = 1;
const SMALL = 2;

const HIDDEN = 0;
const PARTIALLY_VISIBLE = 1;
const VISIBLE = 2;

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getCost(other) {
    var costX = Math.abs(other.x - this.x) * 2;
    var costY = Math.abs(other.y - this.y) * 2;
    if (costX === 0) {
      return costY;
    } else if (costY === 0) {
      return costX;
    } else {
      return Math.sqrt(Math.pow(costX, 2) + Math.pow(costY, 2));
    }
  }
  isSame(other) {
    return other.x == this.x && other.y == this.y;
  }
}

class Location {
  constructor(blocking, entity, type, x, y) {
    this.blocking = blocking;
    this.entity = entity;
    this.tileType = type;
    this.vec = new Vec(x, y);
    this.visible = HIDDEN;
  }
  get isBlocked() {
    // this.blocking is used to cause a temp block until an entity is placed.
    return (this.entity !== null || this.tileType == WALL ||
            this.tileType == CEILING || this.tileType == WATER ||
            this.tileType == SPIKES || this.blocking);
  }
  get isWallOrCeiling() {
    return (this.tileType == WALL || this.tileType == CEILING);
  }
  set blocked(blocking) {
    this.blocking = blocking;
  }
  get isOccupied() {
    return (this.entity !== null);
  }
  set type(type) {
    this.tileType = type;
  }
  get type() {
    return this.tileType;
  }
  set visibility(visible) {
    // once visible, it can't become hidden or partial
    if (this.visible != VISIBLE) {
      this.visible = visible;
      //this.dirty = true;
    }
  }
  get isVisible() {
    return this.visible == VISIBLE;
  }
  get isPartiallyVisible() {
    return this.visible == PARTIALLY_VISIBLE;
  }
  get isHidden() {
    return this.visible == HIDDEN;
  }
  set tileSprite(sprite) {
    this.sprite = sprite;
  }
  get tileSprite() {
    return this.sprite;
  }
}

class GameMap {
  constructor(width, height) {
    if ((width % TILE_SIZE != 0) ||
        (height % TILE_SIZE != 0)) {
      throw new Error("incompatible map dimension(s)");
    }
    this.xMax = width / TILE_SIZE;
    this.yMax = height / TILE_SIZE;
    
    this.shadow = new Set();
    this.newVisible = [];
    this.newPartialVisible = [];
    this.newDirty = [];
    this.locations = [];
    for (let x = 0; x < this.xMax; x++) {
      this.locations[x] = [];
      for (let y = 0; y < this.yMax; y++) {
        this.locations[x][y] = new Location(false, null, CEILING, x, y);
      }
    }
    console.log("generating map with dimensions:", this.xMax, "x", this.yMax, "tiles");
  }

  isOutOfRange(x, y) {
    if (x < 0 || y < 0 || x > this.xMax-1 || y > this.yMax-1) {
      return true;
    } else {
      return false;
    }
  }

  getLocation(x, y) {
    if (this.isOutOfRange(x, y)) {
      throw "Index out of range:";
    }
    return this.locations[x][y];
  }

  getLocationType(x, y) {
    if (this.isOutOfRange(x, y)) {
      throw "Index out of range:";
    }
    return this.locations[x][y].type;
  }

  setLocationType(x, y, type) {
    if (this.isOutOfRange(x, y)) {
      throw "Index out of range:";
    }
    this.locations[x][y].type = type;
  }

  setLocationBlocking(x, y, blocking) {
    if (this.isOutOfRange(x, y)) {
      throw "Index out of range:";
    }
    this.locations[x][y].blocked = blocking;
  }

  getLocationSprite(x, y) {
    if (this.isOutOfRange(x, y)) {
      throw "Index out of range:";
    }
    return this.locations[x][y].tileSprite;
  }

  isBlocked(vec) {
    if (this.isOutOfRange(vec.x, vec.y)) {
      return true;
    }
    return this.getLocation(vec.x, vec.y).isBlocked;
  }

  removeEntity(vec) {
    let loc = this.locations[vec.x][vec.y];
    loc.entity = null;
    //this.locations[vec.x][vec.y].dirty = true;
    if (loc.isVisible) {
      this.newDirty.push(vec);
    }
  }

  placeEntity(vec, entity) {
    let loc = this.locations[vec.x][vec.y];
    if (loc.blocked) {
      throw("trying to place in non empty loc!");
    }

    if (entity.kind == HERO) {
      this.addVisibleTiles(vec, entity.vision);
    }

    loc.entity = entity;
    entity.pos = vec;
    loc.blocking = false;

    //this.locations[pos.x][pos.y].dirty = true;
    if (loc.isVisible) {
      this.newDirty.push(vec);
    }
  }

  getEntity(vec) {
    if (this.isOutOfRange(vec.x, vec.y)) {
      return null;
    }
    // entity maybe null;
    return this.locations[vec.x][vec.y].entity;
  }

  setDirty(vec) {
    if (!this.isOutOfRange(vec.x, vec.y)) {
      //this.locations[vec.x][vec.y].dirty = true;
      this.newDirty.push(vec);
    }
  }

  get width() {
    return this.xMax;
  }

  get height() {
    return this.yMax;
  }

  getDistance(entity0, entity1) {
    return entity0.pos.getCost(entity1.pos);
  }

  vecToLoc(vec) {
    return this.locations[vec.x][vec.y];
  }

  getNeighbours(vec) {
    var neighbours = [];
    for (let x = vec.x - 1; x < vec.x + 2; x++) {
      for (let y = vec.y - 1; y < vec.y + 2; y++) {
        if (this.isOutOfRange(x, y)) {
          continue;
        }
        if (x == vec.x && y == vec.y) {
          continue;
        }
        if (x != vec.x && y != vec.y) {
          // diagnoal neighbours are only possible if the adjacent tiles are
          // are free
          if (this.locations[x][vec.y].isBlocked ||
              this.locations[vec.x][y].isBlocked) {
            continue;
          }
        }
        if (this.locations[x][y].isBlocked) {
          continue;
        }
        neighbours.push(this.locations[x][y].vec);
      }
    }
    return neighbours;
  }
  
  
  createShadow(startX, startY, maxDistance, octant) {
    for (let row = 1; row < maxDistance; ++row) {
      for (let col = 0; col <= row; ++col) {
        let vec = getOctantVec(startX, startY, col, row, octant);
        let x = vec.x;
        let y = vec.y;
        if (this.isOutOfRange(x, y)) {
          continue;
        }
        if (this.shadow.has(this.getLocation(x, y))) {
          continue;
        }
        this.shadow.add(this.getLocation(x, y));
      }
    }
  }
  
  calcVisibilityForOctant(startX, startY, maxDistance, octant) {
    for (let row = 1; row < maxDistance; ++row) {
      for (let col = 0; col <= row; ++col) {
        let vec = getOctantVec(startX, startY, col, row, octant);
        //let y = startY + (row * dy);
        let x = vec.x;
        let y = vec.y;
        if (this.isOutOfRange(x, y)) {
          continue;
        }
        if (this.shadow.has(this.locations[x][y])) {
          continue;
        }

        let loc = this.locations[x][y];
        if (!loc.isVisible) {
          loc.visibility = VISIBLE;
          this.newVisible.push(vec);
        }

        if (loc.isWallOrCeiling) {
          this.createShadow(x, y, maxDistance, octant);
        }
      }
    }
  }
  
  addVisibleTiles(start, maxDistance) {
    this.shadow.clear();
    let octant = 0;
    for (let x = -1; x < 2; ++x) {
      for (let y = -1; y < 2; ++y) {
        let loc = this.locations[start.x + x][start.y + y]; //.visibility = VISIBLE;
        if (!loc.isVisible) {
          this.newVisible.push(loc.vec);
          loc.visibility = VISIBLE;
        }

        if (0 === x && 0 === y) {
          continue;
        }
        this.calcVisibilityForOctant(start.x, start.y, maxDistance, octant);
        ++octant;
      }
    }
    for (let x = start.x-maxDistance; x <= start.x+maxDistance; ++x) {
      for (let y = start.y-maxDistance; y <= start.y+maxDistance; ++y) {
        if (this.isOutOfRange(x, y)) {
          continue;
        }
        let loc = this.locations[x][y];
        if (loc.isHidden) {
          this.locations[x][y].visibility = PARTIALLY_VISIBLE;
          this.newPartialVisible.push(loc.vec);
        }
      }
    }
  }

  areEqualVecs(a, b) {
    return a.x == b.x && a.y == b.y;
  }

  // return an array of Vecs
  getPath(start, goal) {
    // ignore if the click is out range, blocked or the current location.
    if (start == undefined)
      throw("start is undefined");
    if (goal == undefined)
      throw("goal is undefined");

    if (this.isOutOfRange(goal.x, goal.y)) {
      console.log("goal is out of range");
      return [];
    }
    if (this.isBlocked(goal) && !this.vecToLoc(goal).isOccupied) {
      console.log("goal blocked and not by something interesting");
      return [];
    }
    if (start.isSame(goal)) {
      console.log("start == goal");
      return [];
    }

    // get the references to the vecs in the map, so using them as map
    // keys work.
    start = this.vecToLoc(start).vec;
    goal = this.vecToLoc(goal).vec;

    // if the goal is an entity, make a path to be next to it.
    if (this.vecToLoc(goal).isOccupied) {
      let targetNeighbours = this.getNeighbours(goal);
      let cost = start.getCost(goal);
      var newGoal = goal;
      for (let neighbour of targetNeighbours) {
        if (start.getCost(neighbour) < cost) {
          newGoal = neighbour;
          cost = start.getCost(neighbour);
        }
      }
      // Already next to the target
      if (newGoal.isSame(goal)) {
        return [];
      } else {
        goal = newGoal;
      }
    }

    // Adapted from http://www.redblobgames.com/pathfinding/a-star/introduction.html
    var frontier = [];
    var cameFrom = new Map();
    var costSoFar = new Map();
    cameFrom.set(start, null);
    costSoFar.set(start, 0);
    // frontier is a sorted list of locations with their lowest cost
    frontier.push({vec : start, cost : 0});

    // breadth-first search
    var current = null;
    while (frontier.length > 0) {
      current = frontier.shift();
      // exit early
      if (current.vec.isSame(goal)) { //== goal) {
        break;
      }
      var neighbours = this.getNeighbours(current.vec);
      for (let next of neighbours) {
        let newCost = costSoFar.get(current.vec) + current.vec.getCost(next);

        if (!costSoFar.has(next) || newCost < costSoFar.get(next)) {
          frontier.push({vec: next, cost : newCost});
          costSoFar.set(next, newCost);

          frontier.sort((a, b) => {
            if (a.cost > b.cost) {
              return 1;
            } else if (a.cost < b.cost) {
              return -1;
            } else {
              return 0;
            }
          });
          cameFrom.set(next, current.vec);
        }
      }
    }
    if (!current.vec.isSame(goal)) { //!= goal) {
      console.log("path not found to target");
      return [];
    }

    // finalise the path.
    current = goal;
    var path = [current];
    while (!current.isSame(start)) { // != start) {
      current = cameFrom.get(current);
      path.push(current);
    }
    path.reverse();
    return path.splice(1);
  }
}
