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

  getWeight(vec) {

  }
}

class Location {
  constructor(blocking, entity, type) {
    this.blocking = blocking;
    this.entity = entity;
    this.tileType = type;
  }
  get isBlocking() {
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
    this.width = width;
    this.height = height;
    this.xMax = width / TILE_SIZE;
    this.yMax = height / TILE_SIZE;

    for (let x = 0; x < this.xMax; x++) {
      this.locations[x] = [];
      for (let y = 0; y < this.yMax; y++) {
        this.locations[x][y] = new Location(true, null, CEILING);
      }
    }
  }

  isOutOfRange(x, y) {
    if (x < 0 || y < 0 || x > this.xMax || y > this.yMax) {
      return true;
    } else {
      return false;
    }
  }

  findTarget(actor, range) {
    var pos = actor.position;
    for (let x = pos.x - range; x < pos.x + range; x++) {
      for (let y = pos.y - range; y < pos.y + range; y++) {
        if (this.isOutOfRange(x, y)) {
          continue;
        }
        var loc = this.locations[x][y];
        if (loc.entity !== null) {
          if (loc.entity instanceof Hero) {
            return loc.entity;
          }
        }
      }
    }
    return null;
  }

  getLocation(x, y) {
    if (this.isOutOfRange(x, y)) {
      throw new console.error("Index out of range:", x, y);
    }
    return this.locations[x][y];
  }

  placeTile(x, y, type, blocking) {
    // Check for out-of-bounds
    if (x < 0 || y < 0 || x > this.xMax || y > this.yMax) {
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
