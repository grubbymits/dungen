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
  getCost(from) {
    var costX = Math.abs(from.x - this.x) * 2;
    var costY = Math.abs(from.y - this.y) * 2;
    if (costX == 0) {
      return costY;
    } else if (costY == 0) {
      return costX;
    }
  }
}

// We need a priority queue for pathfinding. An array of WeightedVec can be
// customed sorted which would provide the needed functionality.

class Location {
  constructor(blocking, entity, type, x, y) {
    this.blocking = blocking;
    this.entity = entity;
    this.tileType = type;
    this.vec = new Vec(x, y);
  }
  get isBlocking() {
    if (this.entity) {
      return this.blocking || this.entity.blocking;
    }
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
    console.log("getPath");
    console.log("start = ", start, " goal = ", goal);
    // if, somewhere, the click is out range or is a blocked location, ignore it.
    if (this.isOutOfRange(goal.x, goal.y)) {
      return null;
    }
    if (this.locations[goal.x][goal.y].blocking) {
      return null;
    }
    // Adapted from http://www.redblobgames.com/pathfinding/a-star/introduction.html
    var frontier = [];
    frontier.push(start);
    var cameFrom = new Map();
    cameFrom.set(start, null);
   
    console.log("begin BFS");
    var counter = 0;
    // breadth-first search
    while (frontier.length > 0 && counter < 1000) {
      let current = frontier.shift();
      counter++;
      
      // exit early
      if (current == goal) {
        break;
      }
      
      // need to include the cost of moving diagonal. lets round 1.44 to 1.5 and have
      // a normal move cost 2 and a diagonal cost 3 and this can correlate directly to
      // the cost that it will take the actor to move.
      var neighbours = this.getNeighbours(current);
      
      for (let next of neighbours) {
        if (cameFrom.has(next)) {
          console.log("already visited this node");
          continue;
        }
        frontier.push(next);
        cameFrom.set(next, current);
      }
    }
   
    console.log("now finalise path");
    // finalise the path.
    var current = goal;
    var path = [current];
    while (current != start) {
      current = cameFrom.get(current);
      path.push(current);
    }
    path.reverse();
    console.log("path created: ", path);
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
      throw new console.error("Index out of range:", x, y);
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

  removeEntity(x, y) {
    this.locations[x][y].entity(null);
  }
  
  placeEntity(x, y, entity) {
    this.locations[x][y].entity(entity);
  }
  
  getEntity(x, y) {
    if (this.isOutOfRange(x, y)) {
      return null;
    }
    var loc = this.locations[x][y];
    // entity maybe null;
    return loc.entity;
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
