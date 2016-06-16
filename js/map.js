"use strict";

const LARGE = 0;
const MEDIUM = 1;
const SMALL = 2;
const MIN_SMALL = 6;
const MIN_MEDIUM = 8;
const MIN_LARGE = 10;

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
    return this.blocking;
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
    this.width = width;
    this.height = height;
    this.connections = new Set();
    this.visited = false;
  }
  
  get area() {
    return this.height * this.width;
  }
  
  get numberConnections() {
    return this.connections.size;
  }
  
  addNeighbour(n) {
    this.connections.add(n);
  }
  
  getDistance(other) {
    return this.centre.getCost(other.centre);
  }
  
  get maxConnections() {
    if (this.area > MIN_MEDIUM * MIN_MEDIUM) {
      return 4;
    } else if (this.area > MIN_SMALL * MIN_SMALL) {
      return 3;
    }
    return 2;
  }
}

class GameMap {
  constructor(width, height) {
    this.locations = [];
    this.rooms = [];
    this.minRoomWidth = MIN_SMALL;
    this.minRoomHeight = MIN_SMALL;
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
    if (this.isOutOfRange(goal.x, goal.y)) {
      return [];
    }
    if (this.isBlocked(goal) && !goal.isOccupied) {
      return [];
    }
    if (start == goal) {
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
    frontier.push({loc : start, cost : 0});

    // breadth-first search
    var current = null;
    while (frontier.length > 0) {
      current = frontier.shift();
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
    if (current.loc != goal) {
      //throw("Path not found to target!");
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
    } else {
      this.locations[x][y].type = type;
      this.locations[x][y].blocked = blocking;
      if (type == PATH && y > 1 && this.locations[x][y-1].type != PATH) {
        if (this.isOutOfRange(x, y-1)) {
          return;
        }
        this.locations[x][y-1].type = WALL;
        this.locations[x][y-1].isBlocking = true;
        
        // fixups, just in case
        if (this.isOutOfRange(x, y-2)) {
          return;
        }
        if (this.locations[x][y-2].type == PATH) {
          this.locations[x][y-1].type = PATH;
          this.locations[x][y-1].isBlocking = false;
        }
        if (this.isOutOfRange(x, y+1)) {
          return;
        }
        if (this.locations[x][y+1].type == WALL) {
          this.locations[x][y+1].type = PATH;
          this.locations[x][y+1].isBlocking = false;
        }
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
        if (!this.locations[x][y].isBlocked) {
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
      for (let y = startY+1; y < startY + height-2; y++) {
        this.locations[x][y].blocked = false;
        this.placeTile(x, y, PATH, false);
        //this.locations[x][y].room = room;
      }
    }
    return room;
  }
  
  getDims(type) {
    let w = 0;
    let h = 0;
    if (type == LARGE) {
      // 23, 21, 19, 17, 15
      w = Math.floor(Math.random() * (19 - 15)) + 15;
      h = Math.floor(Math.random() * (19 - 15)) + 15;
      //w = MIN_LARGE;
      //h = MIN_LARGE;
    }
    if (type == MEDIUM) {
      // 19, 17, 15, 13, 11
      w = Math.floor(Math.random() * (17 - 12)) + 12;
      h = Math.floor(Math.random() * (17 - 12)) + 12;
      //w = MIN_MEDIUM;
      //h = MIN_MEDIUM;
    }
    if (type == SMALL) {
      // 15, 13, 11, 9
      w = Math.floor(Math.random() * (15 - 10)) + 10;
      h = Math.floor(Math.random() * (15 - 10)) + 10;
      //w = MIN_SMALL;
      //h = MIN_SMALL;
    }
    return {width : w, height : h};
  }
  
  placeRooms(roomsToPlace) {
    let numBigRooms = Math.floor(roomsToPlace / 6);
    let numMediumRooms = Math.floor(2 * roomsToPlace / 6);
    let numSmallRooms = Math.floor(3 * roomsToPlace / 6);
    const maxAttempts = 200;

    // place larger rooms first
    let numRooms = [numBigRooms, numMediumRooms, numSmallRooms];
    //const roomDims = [ [17, 17], [14, 14], [11, 11]];

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
        }
        attempts++;
      }
    }
    console.log("finished placing rooms. not placed:", roomsToPlace);
  }
  
  isCarvingIntoPath(startx, starty, width, height) {
    for (let x = startx; x < startx + width; ++x) {
      for (let y = starty; y < starty + height; ++y) {
        if (!this.locations[x][y].isBlocked) {
          return true;
        }
      }
    }
  }
  
  // The map generator needs to consider three different types of location:
  // - ceiling
  // - wall
  // - floor
  // All locations begin as ceiling. When a ceiling becomes a floor, the eight
  // surrounding locations become walls, (but only the top and centre of these
  // will change their sprite to differ a ceiling).
  // - Floor tiles can be placed in celing tiles.
  // - A floor tile cannot be placed next to a wall when placing rooms (which
  // ensured by room floor tiles having a radius of wall tiles)
  // - A wall tile cannot be created over an existing wall tile.
  
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
    
    for (let current of connectedRooms.values()) {
    
      for (let neighbour of current.connections) {
        let x = current.centre.x;
        let y = current.centre.y;
        
        if (current.centre.x < neighbour.centre.x) {
          while (x < neighbour.centre.x) {
            ++x;
            this.createRoom(x, y, PATH_WIDTH, PATH_WIDTH);
          }
        } else if (current.centre.x > neighbour.centre.x) {
          while (x > neighbour.centre.x) {
            --x;
            this.createRoom(x, y, PATH_WIDTH, PATH_WIDTH);
          }
        }
        if (current.centre.y < neighbour.centre.y) {
          while (y < neighbour.centre.y) {
            ++y;
            this.createRoom(x, y, PATH_WIDTH, PATH_WIDTH);
          }
        } else if (current.centre.y > neighbour.centre.y) {
          while (y > neighbour.centre.y) {
            --y;
            this.createRoom(x, y, PATH_WIDTH, PATH_WIDTH);
          }
        }
      }
    }
  }
  
  generate() {
    this.placeRooms(12);
    this.createConnections();
    //this.createGraph();
    //this.layPath();
  }
  
  drawRooms(context) {
    console.log("draw rooms");
    context.fillStyle = '#22AA99';
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (!this.locations[x][y].isBlocked) {
          context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          //context.stroke();
        }
      }
    }
    console.log("number of rooms:", this.rooms.length);
    context.strokeStyle = 'red';
    for (let room of this.rooms) {
      for (let neighbour of room.connections) {
        context.beginPath();
        context.moveTo(room.centre.x * TILE_SIZE, room.centre.y * TILE_SIZE);
        context.lineTo(neighbour.centre.x * TILE_SIZE, neighbour.centre.y * TILE_SIZE);
        context.stroke();
      }
    }
  }
}
