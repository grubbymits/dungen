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
  getNeighbourCost(other) {
    if ((other.x == this.x) || (other.y == this.y)) {
      return 2;
    }
    return 3;
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
  clear() {
    this.blocking = false;
    this.entity = null;
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
    this.xMax = width / TILE_SIZE;
    this.yMax = height / TILE_SIZE;

    this.shadow = new Set();
    this.newVisible = new Set();
    this.newPartialVisible = new Set();
    this.locations = [];
    for (let x = 0; x < this.xMax; x++) {
      this.locations[x] = [];
      for (let y = 0; y < this.yMax; y++) {
        this.locations[x][y] = new Location(true, null, CEILING, x, y);
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

  getLocUp(vec) {
    if (this.isOutOfRange(vec.x, vec.y - 1)) {
      throw "Index out of range:";
    }
    return this.locations[vec.x][vec.y - 1];
  }

  getLocDown(vec) {
    if (this.isOutOfRange(vec.x, vec.y + 1)) {
      throw "Index out of range:";
    }
    return this.locations[vec.x][vec.y + 1];
  }

  getLocLeft(vec) {
    if (this.isOutOfRange(vec.x - 1, vec.y)) {
      throw "Index out of range:";
    }
    return this.locations[vec.x - 1][vec.y];
  }

  getLocRight(vec) {
    if (this.isOutOfRange(vec.x + 1, vec.y)) {
      throw "Index out of range:";
    }
    return this.locations[vec.x + 1][vec.y];
  }

  getFreeOpposite(current, opposite) {
    let dest = current;
    if ((opposite.x < current.x) && (!this.getLocRight(current).isBlocked)) {
      dest = this.getLocRight(current).vec;
    } else if ((opposite.y < current.y) && (!this.getLocDown(current).isBlocked)) {
      dest = this.getLocDown(current).vec;
    } else if ((opposite.x > current.x) && (!this.getLocLeft(current).isBlocked)) {
      dest = this.getLocLeft(current).vec;
    } else if ((opposite.y > current.y) && (!this.getLocUp(current).isBlocked)) {
      dest = this.getLocUp(current).vec;
    } else {
      console.log("failed to find new location");
    }
    return dest;
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
    let loc = this.getLocation(vec.x, vec.y);
    return loc.isBlocked;
  }

  removeEntity(vec) {
    let loc = this.locations[vec.x][vec.y];
    if (loc.entity == null) {
      console.log(loc);
      throw("entity already null");
    }
    loc.clear();
  }

  placeEntity(vec, entity) {
    let loc = this.locations[vec.x][vec.y];
    if (loc.entity !== null) {
      console.log(loc);
      throw("trying to place in non empty loc!");
    }

    if (entity.kind == HERO) {
      this.addVisibleTiles(vec, entity.vision);
    }

    loc.entity = entity;
    entity.pos = vec;
    loc.blocking = true;
  }

  getEntity(vec) {
    if (this.isOutOfRange(vec.x, vec.y)) {
      return null;
    }
    // entity maybe null;
    return this.locations[vec.x][vec.y].entity;
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

  addVisible(loc) {
    loc.visibility = VISIBLE;
    this.newVisible.add(loc.vec);
    if (this.newPartialVisible.has(loc.vec)) {
      this.newPartialVisible.delete(loc.vec);
    }
  }
  
  calcVisibilityForOctant(startX, startY, maxDistance, octant) {
    for (let row = 1; row < maxDistance; ++row) {
      for (let col = 0; col <= row; ++col) {
        let vec = getOctantVec(startX, startY, col, row, octant);
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
          this.addVisible(loc);
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
          this.addVisible(loc);
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
          this.newPartialVisible.add(loc.vec);
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
    if (start === undefined)
      throw("start is undefined");
    if (goal === undefined)
      throw("goal is undefined");

    if (this.isOutOfRange(goal.x, goal.y)) {
      return [];
    }
    if (this.isBlocked(goal) && !this.vecToLoc(goal).isOccupied) {
      return [];
    }
    if (start.isSame(goal)) {
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
        let newCost = costSoFar.get(current.vec) + current.vec.getNeighbourCost(next);

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
