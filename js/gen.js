"use strict";

const LARGE = 0;
const MEDIUM = 1;
const SMALL = 2;

class Room {
  constructor(x, y, width, height) {
    this.pos = new Vec(x, y);
    this.centre = new Vec(x + Math.floor(width / 2),
                          y + Math.floor(height / 2));
    this.width = width;
    this.height = height;
    this.neighbours = [];
    this.parents = [];
    this.numberConnections = 0;
    this.visited = false;
  }
  get area() {
    return this.height * this.width;
  }
  addNeighbour(n) {
    console.log("adding neighbour of distance:", this.getDistance(n));
    this.neighbours.push(n);
    n.addParent(this);
    console.log("number of neighbours:", this.neighbours.length);
    //n.addConnection();
    //this.addConnection();
  }
  addParent(p) {
    this.parents.push(p);
  }
  addConnection() {
    this.numberConnections++;
  }
  getDistance(other) {
    return this.centre.getCost(other.centre);
  }
  get maxConnections() {
    if (this.area > 400) {
      return 3;
    } else if (this.area > 220) {
      return 2;
    }
    return 1;
  }
}

class MapGenerator {
  constructor(width, height, minConnections, maxConnections) {
    this.width = width;
    this.height = height;
    this.minConnections = minConnections;
    this.maxConnections = maxConnections;
    // set the min to include the space required by the walls.
    this.minRoomWidth = 8;
    this.minRoomHeight = 8;
    this.locations = [];

    // initialise map with all the space free
    for (let x = 0; x < width; x++) {
      this.locations[x] = [];
      for (let y = 0; y < height; y++) {
        this.locations[x][y] = { free: true, room: null };
      }
    }
    this.rooms = [];
  }
  isOutOfRange(x, y) {
    return (x >= this.width || y >= this.height);
  }
  get randomX() {
    let min = 1;
    let max = this.width - this.minRoomWidth;
    return Math.floor(Math.random() * (max - min)) + min;
  }
  get randomY() {
    let min = 1;
    let max = this.height - this.minRoomHeight;
    return Math.floor(Math.random() * (max - min)) + min;
  }
  isSpace(startX, startY, width, height) {
    for (let x = startX; x < startX + width; x++) {
      for (let y = startY; y < startY + height; y++) {
        if (this.isOutOfRange(x, y)) {
          return false;
        }
        if (!this.locations[x][y].free) {
          return false;
        }
      }
    }
    return true;
  }
  createRoom(startX, startY, width, height) {
    let room = new Room(startX, startY, width, height);
    console.log("place room at (", startX, startY, ") of width and height:",
                width, height);
    this.rooms.push(room);
    for (let x = startX; x < startX + width; x++) {
      for (let y = startY; y < startY + height; y++) {
        this.locations[x][y].free = false;
        this.locations[x][y].room = room;
      }
    }
  }
  getDims(type) {
    let w = 0;
    let h = 0;
    if (type == LARGE) {
      // 23, 21, 19, 17, 15
      w = Math.floor(Math.random() * (23 - 15)) + 15;
      h = Math.floor(Math.random() * (23 - 15)) + 15;
    }
    if (type == MEDIUM) {
      // 19, 17, 15, 13, 11
      w = Math.floor(Math.random() * (19 - 11)) + 11;
      h = Math.floor(Math.random() * (19 - 11)) + 11;
    }
    if (type == SMALL) {
      // 15, 13, 11, 9
      w = Math.floor(Math.random() * (15 - 9)) + 9;
      h = Math.floor(Math.random() * (15 - 9)) + 9;
    }
    return {width : w, height : h};
  }
  placeRooms(roomsToPlace) {
    let numBigRooms = Math.floor(roomsToPlace / 6);
    let numMediumRooms = Math.floor(2 * roomsToPlace / 6);
    let numSmallRooms = Math.floor(3 * roomsToPlace / 6);
    const maxAttempts = 100;

    // place larger rooms first
    let numRooms = [numBigRooms, numMediumRooms, numSmallRooms];
    //const roomDims = [ [17, 17], [14, 14], [11, 11]];

    for (let i = 0; i < 3 && roomsToPlace !== 0; i++) {
      let rooms = 0;
      let attempts = 0;
      while (attempts < maxAttempts && rooms < numRooms[i]) {

        let x = this.randomX;
        let y = this.randomY;
        console.log("x, y:", x, y);
        let dims = this.getDims(i);

        if (this.isSpace(x, y, dims.width, dims.height)) {
          this.createRoom(x, y, dims.width, dims.height);
          rooms++;
          roomsToPlace--;
        }
        attempts++;
      }
    }
    console.log("finished placing rooms. not placed:", roomsToPlace);
  }
  createGraph() {
    // start at the largest room
    this.rooms.sort((a, b) => {
      if (a.area < b.area) {
        return 1;
      } else if (a.area > b.area) {
        return -1;
      } else {
        return 0;
      }
    });
    let toVisit = [this.rooms[0]];
    while (toVisit.length !== 0) {
      let room = toVisit.shift();
      room.visited = true;
      let potentialNeighbours = [];
      for (let other of this.rooms) {
        if (room == other || other.visited) {
          continue;
        }
        potentialNeighbours.push(other);
      }
      // sort the neighbours in proximity
      potentialNeighbours.sort((a, b) => {
        if (room.getDistance(a) > room.getDistance(b)) {
          return 1;
        } else if (room.getDistance(a) < room.getDistance(b)) {
          return -1;
        } else {
          return 0;
        }
      });
      // add one or more neighbours to the room if there are any available.
      for (let i = 0; i < room.maxConnections; ++i) {
        if (potentialNeighbours.length !== 0) {
          room.addNeighbour(potentialNeighbours[0]);
          toVisit.push(potentialNeighbours.shift());
        }
      }
    }
  }
  intersects(parent, child) {
    // This rooms has four lines that define its area and we check whether
    // any of those line intersect the path between the parent and child.
    let dx = child.pos.x - parent.pos.x;
    let dy = child.pos.y - parent.pos.y;

  }
  refineGraph() {
    // For each connection, check whether it intersects a different room(s)
    // before its target. If this happens we can make the connection to and
    // from the intersecting room, which may already be connected to the parent
    // or child.
    for (let parent of this.rooms) {
      for (let child of parent.children) {
        let intersecting = [];

        for (let intersect of this.rooms) {
          if (intersect == parent || intersect == child) {
            continue;
          }
        }
      }
    }
  }
  drawRooms(context) {
    console.log("draw rooms");
    context.fillStyle = '#22AA99';
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (!this.locations[x][y].free) {
          context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
    console.log("number of rooms:", this.rooms.length);
    context.strokeStyle = 'red';
    for (let room of this.rooms) {
      for (let neighbour of room.neighbours) {
        context.beginPath();
        context.moveTo(room.centre.x * TILE_SIZE, room.centre.y * TILE_SIZE);
        context.lineTo(neighbour.centre.x * TILE_SIZE, neighbour.centre.y * TILE_SIZE);
        context.stroke();
      }
    }
  }
}
