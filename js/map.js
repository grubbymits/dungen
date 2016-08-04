"use strict";

const LARGE = 0;
const MEDIUM = 1;
const SMALL = 2;
var MIN_LARGE = Math.round(Math.min(MAP_WIDTH_PIXELS, MAP_HEIGHT_PIXELS) /
                           TILE_SIZE / 4);
var MIN_MEDIUM = Math.round(MIN_LARGE * 0.8);
var MIN_SMALL = Math.round(MIN_LARGE * 0.6);

console.log("MIN_LARGE set to:", MIN_LARGE);

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
    this.dirty = true;
  }
  get isBlocked() {
    return (this.entity !== null || this.tileType == WALL ||
            this.tileType == CEILING);
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
}

class Room {
  constructor(x, y, width, height) {
    this.pos = new Vec(x, y);
    this.centre = new Vec(x + Math.floor(width / 2),
                          y + Math.floor(height / 2));
    // Adjust the centre so that when creating paths, we don't go OoB.
    if (this.centre.x > Math.floor(PATH_WIDTH / 2))
      this.centre.x -= Math.floor(PATH_WIDTH / 2);
    if (this.centre.y > Math.floor(PATH_WIDTH / 2))
      this.centre.y -= Math.floor(PATH_WIDTH / 2);

    this.width = width;
    this.height = height;
    this.connections = new Set();
    this.visited = false;
  }

  get area() {
    return this.height * this.width;
  }

  addNeighbour(n) {
    this.connections.add(n);
  }

  getDistance(other) {
    return this.centre.getCost(other.centre);
  }
}

class GameMap {
  constructor(width, height, game) {
    this.game = game;
    this.minRoomWidth = MIN_SMALL;
    this.minRoomHeight = MIN_SMALL;
    this.reset();
    this.xMax = width / TILE_SIZE;
    this.yMax = height / TILE_SIZE;
    console.log("generating map with dimensions:", this.xMax, "x", this.yMax, "tiles");

    var monsterGroup0 = [ RAT, SPIDERS]; //, RABBIT, BAT];

    var monsterGroup1 = monsterGroup0.slice();
    monsterGroup1.push(LIZARD);
    monsterGroup1.push(MUSHROOM);

    var monsterGroup2 = monsterGroup1.slice();
    monsterGroup2.push(SPIDER_CHAMPION);
    monsterGroup2.push(BAT_CHAMPION);

    var monsterGroup3 = monsterGroup2.slice();
    monsterGroup3.push(TOAD);
    monsterGroup3.push(SCARAB);

    var monsterGroup4 = monsterGroup3.slice();
    monsterGroup4.push(CENTIPEDE);
    monsterGroup4.push(SERPENT);

    var monsterGroup5 = monsterGroup4.slice();
    monsterGroup5.push(SNAKE);
    monsterGroup5.push(WOLF);

    var monsterGroup6 = monsterGroup5.slice();
    monsterGroup6.push(WILD_BOAR);
    monsterGroup6.push(BEAR);

    var monsterGroup7 = monsterGroup6.slice();
    for (let i in monsterGroup0) {
      monsterGroup7.shift();
    }

    this.monsterGroups = [ monsterGroup0,
                           monsterGroup1,
                           monsterGroup2,
                           monsterGroup3,
                           monsterGroup4,
                           monsterGroup5,
                           monsterGroup6 ];
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

  isBlocked(loc) {
    if (this.isOutOfRange(loc.x, loc.y)) {
      return true;
    }
    return loc.isBlocked;
  }

  removeEntity(pos) {
    this.locations[pos.x][pos.y].entity = null;
    this.locations[pos.x][pos.y].dirty = true;
  }

  placeEntity(pos, entity) {
    this.locations[pos.x][pos.y].entity = entity;
    this.locations[pos.x][pos.y].dirty = true;
  }

  getEntity(x, y) {
    if (this.isOutOfRange(x, y)) {
      return null;
    }
    // entity maybe null;
    return this.locations[x][y].entity;
  }

  setDirty(pos) {
    if (!this.isOutOfRange(pos))
      this.locations[pos.x][pos.y].dirty = true;
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
        if (this.locations[x][y].isBlocked ||
            this.locations[x][y].isOccupied) {
          continue;
        }
        neighbours.push(this.locations[x][y].vec);
      }
    }
    return neighbours;
  }

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
    if (this.isBlocked(goal) && !goal.isOccupied) {
      console.log("goal blocked and not by something interesting");
      return [];
    }
    if (start == goal) {
      console.log("start == goal");
      return [];
    }
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
      if (newGoal == goal) {
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
      if (current.vec == goal) {
        break;
      }
      if ((current.vec.x == goal.x && current.vec.y == goal.y)) {
        console.log("current vec == goal..");
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
    if (current.vec != goal) {
      //throw("Path not found to target!");
      console.log("path not found to target");
      return [];
    }

    // finalise the path.
    current = goal;
    var path = [current];
    while (current != start) {
      current = cameFrom.get(current);
      path.push(current);
    }
    path.reverse();
    return path.splice(1);
  }

  placeTile(x, y, type, blocking) {
    // Check for out-of-bounds
    if (this.isOutOfRange(x, y)) {
      return;
    }
    this.locations[x][y].type = type;
    this.locations[x][y].blocked = blocking;
    if (this.isOutOfRange(x, y-1)) {
      console.log("this probably shouldn't happen");
      return;
    }
    if (type == PATH && y > 1 && this.locations[x][y-1].type != PATH) {
      this.locations[x][y-1].type = WALL;

      // fixups, just in case carving paths isn't tidy
      if (this.isOutOfRange(x, y-2)) {
        return;
      }
      if (this.locations[x][y-2].type == PATH) {
        this.locations[x][y-1].type = PATH;
      }
      if (this.isOutOfRange(x, y+1)) {
        return;
      }
      if (this.locations[x][y+1].type == WALL) {
        this.locations[x][y+1].type = PATH;
      }
    }
  }


  get randomX() {
    let min = 1;
    let max = this.xMax - this.minRoomWidth;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  get randomY() {
    let min = 1;
    let max = this.yMax - this.minRoomHeight;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  isSpace(startX, startY, width, height) {
    for (let x = startX; x < startX + width; x++) {
      for (let y = startY; y < startY + height; y++) {
        if (this.isOutOfRange(x, y)) {
          return false;
        }
        // Only carve rooms into 'blocked' ceiling regions
        if (!this.locations[x][y].type == CEILING) {
          return false;
        }
      }
    }
    return true;
  }

  createRoom(startX, startY, width, height) {
    let room = new Room(startX, startY, width, height);
    this.rooms.push(room);
    for (let x = startX+1; x < startX + width-1; x++) {
      for (let y = startY+2; y < startY + height-2; y++) {
        this.placeTile(x, y, PATH, false);
        //this.locations[x][y].room = room;
      }
    }
    return room;
  }

  createPath(startX, startY) {
    for (let x = startX; x < startX + PATH_WIDTH; x++) {
      for (let y = startY; y < startY + PATH_WIDTH; y++) {
        this.placeTile(x, y, PATH, false);
      }
    }
  }

  getDims(type) {
    let w = 0;
    let h = 0;
    if (type == LARGE) {
      // 23, 21, 19, 17, 15
      w = Math.floor(Math.random() * 3) + MIN_LARGE;
      h = Math.floor(Math.random() * 3) + MIN_LARGE;
      //w = MIN_LARGE;
      //h = MIN_LARGE;
    }
    if (type == MEDIUM) {
      // 19, 17, 15, 13, 11
      w = Math.floor(Math.random() * 5) + MIN_MEDIUM;
      h = Math.floor(Math.random() * 5) + MIN_MEDIUM;
      //w = MIN_MEDIUM;
      //h = MIN_MEDIUM;
    }
    if (type == SMALL) {
      // 15, 13, 11, 9
      w = Math.floor(Math.random() * 5) + MIN_SMALL;
      h = Math.floor(Math.random() * 5) + MIN_SMALL;
      //w = MIN_SMALL;
      //h = MIN_SMALL;
    }
    return {width : w, height : h};
  }

  placeRooms(roomsToPlace) {
    console.log("trying to place", roomsToPlace, "rooms");
    let numBigRooms = Math.floor(roomsToPlace / 6);
    let numMediumRooms = Math.floor(2 * roomsToPlace / 6);
    let numSmallRooms = Math.floor(3 * roomsToPlace / 6);
    const maxAttempts = 200;

    // place larger rooms first
    let numRooms = [numBigRooms, numMediumRooms, numSmallRooms];

    for (let i = 0; i < 3 && roomsToPlace !== 0; i++) {
      let rooms = 0;
      let attempts = 0;
      while (attempts < maxAttempts && rooms < numRooms[i]) {

        let x = this.randomX;
        let y = this.randomY;
        let dims = this.getDims(i);

        if (this.isSpace(x, y, dims.width, dims.height)) {
          console.log("placing room at (x, y):", x, y, "of size:", dims.width, dims.height);
          this.createRoom(x, y, dims.width, dims.height);
          rooms++;
          roomsToPlace--;
          attempts = 0;
        }
        attempts++;
      }
    }
    console.log("finished placing rooms. not placed:", roomsToPlace);
  }

  createConnections() {
    let connectedRooms = new Set();
    let unconnectedRooms = new Set();

    let to, from;

    for (let room of this.rooms) {
      unconnectedRooms.add(room);
    }
    connectedRooms.add(this.rooms[0]);
    unconnectedRooms.delete(this.rooms[0]);

    while (unconnectedRooms.size !== 0) {
      let minDistance = MAP_WIDTH_PIXELS * MAP_HEIGHT_PIXELS;
      for (let connectedRoom of connectedRooms.values()) {
        for (let unconnectedRoom of unconnectedRooms.values()) {
          if (connectedRoom.getDistance(unconnectedRoom) < minDistance) {
            minDistance = connectedRoom.getDistance(unconnectedRoom);
            from = connectedRoom;
            to = unconnectedRoom;
          }
        }
      }
      from.addNeighbour(to);
      unconnectedRooms.delete(to);
      connectedRooms.add(to);
    }

    // add 'rooms' to create paths between the connected rooms
    for (let current of connectedRooms.values()) {

      for (let neighbour of current.connections) {
        let x = current.centre.x;
        let y = current.centre.y;

        if (current.centre.x < neighbour.centre.x) {
          while (x < neighbour.centre.x) {
            this.createPath(x, y);
            x++;
            //x += PATH_WIDTH; //= PATH_WIDTH;
          }
        } else if (current.centre.x > neighbour.centre.x) {
          while (x > neighbour.centre.x) {
            this.createPath(x, y);
            x--;
            //x -= PATH_WIDTH;
          }
        }
        if (current.centre.y < neighbour.centre.y) {
          while (y < neighbour.centre.y) {
            this.createPath(x, y);
            y++;
            //y += PATH_WIDTH;
          }
        } else if (current.centre.y > neighbour.centre.y) {
          while (y > neighbour.centre.y) {
            this.createPath(x, y);
            y--;
            //y -= PATH_WIDTH;
          }
        }
      }
    }
  }

  placeMonsters(level, total) {
    console.log("placing", total, "level", level, "monsters");
    // Try to place monsters in the larger rooms first.
    // Place ~50% of enemies into the largest 25% of the rooms.
    this.rooms.sort((a, b) => {
      if (a.area < b.area) {
        return 1;
      } else {
        return -1;
      }
    });

    let nextLimit = Math.floor(total / 8);
    let roomIdx = 0;
    let monsters = this.monsterGroups[level-1];

    for (let current = 0; current < total; ++current) {
      if (current >= nextLimit) {
        roomIdx = (roomIdx + 1) % this.rooms.length;

        if (roomIdx >= this.rooms.length * 0.25) {
          nextLimit += (total / 16);
        } else {
          nextLimit += (total / 8);
        }
        console.log("nextLimit:", nextLimit);
      }
      console.log("room id:", roomIdx);

      let room = this.rooms[roomIdx];
      const MAX_ATTEMPTS = 10;
      let attempts = 0;
      let x = room.pos.x;
      let y = room.pos.y;
      do {
        x = getBoundedRandom(room.pos.x, room.pos.x + room.width);
        y = getBoundedRandom(room.pos.y, room.pos.y + room.height);
        ++attempts;
      } while ((this.locations[x][y].isBlocked ||
               this.locations[x][y].isOccupied) &&
               attempts < MAX_ATTEMPTS);

      if (!this.locations[x][y].isOccupied &&
          !this.locations[x][y].isBlocked) {
        let pos = this.locations[x][y].vec;
        let type = Math.floor(Math.random() * monsters.length);
        let monster = this.game.createMonster(pos, type);
        //this.placeEntity(pos, monster);
      }
    }
  }

  placeChests() {
    const MAX_ATTEMPTS = 10;

    for (let room of this.rooms) {
      let attempts = 0;
      let x = room.pos.x;
      let y = room.pos.y;
      do {
        x = getBoundedRandom(room.pos.x, room.pos.x + room.width);
        y = getBoundedRandom(room.pos.y, room.pos.y + room.height);
        ++attempts;
      } while ((this.locations[x][y].isBlocked ||
               this.locations[x][y].isOccupied) &&
               attempts < MAX_ATTEMPTS);

      if (!this.locations[x][y].isOccupied &&
          !this.locations[x][y].isBlocked) {
        this.game.createChest(this.locations[x][y]);
      }

    }
  }

  placeStairs() {
    // Choose the two rooms that are the furthest apart and less the entry
    // and exit stairs in them.
    let biggestDistance = 0;
    let entry, exit;
    for (let i in this.rooms) {
      for (let j in this.rooms) {

        let from = this.rooms[i];
        let to = this.rooms[j];

        if (from == to)
          continue;

        let fromVec = this.vecToLoc(from.centre).vec;
        let toVec = this.vecToLoc(to.centre).vec;
        let path = this.getPath(fromVec, toVec);
        if (path.length > biggestDistance) {
          entry = from;
          exit = to;
          biggestDistance = path.length;
        }
      }
    }

    if (entry === undefined)
      throw("entry room is still null!");
    if (exit === undefined)
      throw("exit room is still null!");

    this.game.createStair(exit, true);
    return this.game.createStair(entry, false);
          
  }

  reset() {
    this.locations = [];
    this.rooms = [];
    for (let x = 0; x < this.xMax; x++) {
      this.locations[x] = [];
      for (let y = 0; y < this.yMax; y++) {
        this.locations[x][y] = new Location(true, null, CEILING, x, y);
      }
    }
  }

  generate(level) {
    this.reset();
    let number = Math.round((MAP_WIDTH_PIXELS * MAP_HEIGHT_PIXELS) /
                            (TILE_SIZE * TILE_SIZE * MIN_MEDIUM * MIN_MEDIUM));
    this.placeRooms(number);
    this.createConnections();
    let entry = this.placeStairs();
    this.placeChests();
    this.placeMonsters(level, 32);
    let neighbours = this.getNeighbours(entry.vec);
    if (!neighbours.length)
      throw("no free neighbours next to stairs");
    return neighbours[0];
  }
}
