"use strict";

const CEILING = 0;
const PATH = 1;
const WALL = 2;
const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST= 3;
const MAX_DIRECTION = 4;

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
}

class Location {
  constructor(blocking, entity, type, x, y) {
    this.blocking = blocking;
    this.entity = entity;
    this.tileType = type;
    this.vec = new Vec(x, y);
  }
  get isBlocking() {
    //if (this.entity) {
      //return this.blocking || this.entity.blocking;
    //}
    return this.blocking;
  }
  set isBlocking(blocking) {
    this.blocking = blocking;
  }

  set type(type) {
    this.tileType = type;
  }

  get type() {
    return this.tileType;
  }
}

class GameMap {
  constructor(width, height) {
    this.locations = [];
    //this.width = width;
    //this.height = height;
    this.xMax = width / TILE_SIZE;
    this.yMax = height / TILE_SIZE;

    for (let x = 0; x < this.xMax; x++) {
      this.locations[x] = [];
      for (let y = 0; y < this.yMax; y++) {
        this.locations[x][y] = new Location(true, null, CEILING, x, y);
      }
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

  getNeighbours(vec) {
    var neighbours = [];
    for (let x = vec.x - 1; x < vec.x + 2; x++) {
      for (let y = vec.y - 1; y < vec.y + 2; y++) {
        if (this.isOutOfRange(x, y)) {
          continue;
        }
        if (this.locations[x][y].isBlocking) {
          continue;
        }
        if (x == vec.x && y == vec.y) {
          continue;
        }
        neighbours.push(this.locations[x][y].vec);
      }
    }
    return neighbours;
  }

  getPath(start, goal) {
    // if, somewhere, the click is out range or is a blocked location, ignore it.
    if (this.isOutOfRange(goal.x, goal.y)) {
      return [];
    }
    if (this.locations[goal.x][goal.y].isBlocking) {
      return [];
    }
    if (start == goal) {
      return [];
    }

    // Adapted from http://www.redblobgames.com/pathfinding/a-star/introduction.html
    var frontier = [];
    var cameFrom = new Map();
    var costSoFar = new Map();
    cameFrom.set(start, null);
    costSoFar.set(start, 0);
    // frontier is a sorted list of locations with their lowest cost
    frontier.push({loc : start, cost : 0});

    // breadth-first search
    while (frontier.length > 0) {
      let current = frontier.shift();

      // exit early
      if (current.loc == goal) {
        break;
      }

      var neighbours = this.getNeighbours(current.loc);

      for (let next of neighbours) {
        let newCost = costSoFar.get(current.loc) + current.loc.getCost(next);

        if (!costSoFar.has(next) || newCost < costSoFar.get(next)) {
          frontier.push({loc : next, cost : newCost});
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
          cameFrom.set(next, current.loc);
        }
      }
    }

    console.log("now finalise path");
    // finalise the path.
    var current = goal;
    var path = [current];
    let counter = 0;
    while (current != start) {
      current = cameFrom.get(current);
      path.push(current);
    }
    path.reverse();
    // If the destination of the walk was to an entity, return the path to it
    // and not on top of it.
    if (this.locations[goal.x][goal.y].entity !== null) {
      path.pop();
    }
    console.log("path created: ", path.length);
    return path;
  }

  isOutOfRange(x, y) {
    if (x < 0 || y < 0 || x > this.xMax || y > this.yMax) {
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

  isBlocked(x, y) {
    if (this.isOutOfRange(x, y)) {
      return true;
    } else if (this.locations[x][y].entity) {
      return this.locations[x][y].entity.isBlocking;
    }
    return false;
  }

  removeEntity(pos) {
    this.locations[pos.x][pos.y].entity = null;
  }

  placeEntity(pos, entity) {
    console.log("entity placed at", pos);
    console.log(entity);
    this.locations[pos.x][pos.y].entity = entity;
  }

  getEntity(x, y) {
    if (this.isOutOfRange(x, y)) {
      return null;
    }
    // entity maybe null;
    return this.locations[x][y].entity;
  }

  placeTile(x, y, type, blocking) {
    // Check for out-of-bounds
    if (this.isOutOfRange(x, y)) {
      return;
    } else {
      this.locations[x][y].type = type;
      this.locations[x][y].isBlocking = blocking;
      if (type == PATH && y > 1 && this.locations[x][y-1].type != PATH) {
        this.locations[x][y-1].type = WALL;
        this.locations[x][y-1].isBlocking = true;
      }
    }
  }

  generate() {
    console.log("GameMap.generate");
    for (let x = 4; x < this.xMax - 4; x++) {
      for (let y = 4; y < this.yMax - 4; y++) {
        this.placeTile(x, y, PATH, false);
      }
    }
  }
}
