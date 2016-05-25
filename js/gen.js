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
    //console.log("adding neighbour of distance:", this.getDistance(n));
    this.connections.add(n);
    n.addParent(this);
    //console.log("number of neighbours:", this.neighbours.length);
  }
  
  addParent(p) {
    this.connections.add(p);
  }
  
  removeNeighbour(n) {
    //console.log("removing child from parent");
    n.removeParent(this);
    this.connections.delete(n);
  }
  
  removeParent(p) {
    this.connections.delete(p);
  }
  
  getDistance(other) {
    return this.centre.getCost(other.centre);
  }
  
  get maxConnections() {
    if (this.area > 380) {
      return 4;
    } else if (this.area > 81) {
      return 3;
    }
    return 2;
  }
}

class MapGenerator {
  constructor(width, height, minConnections, maxConnections) {
    this.width = width;
    this.height = height;
    this.minConnections = minConnections;
    this.maxConnections = maxConnections;
    // set the min to include the space required by the walls.
    this.minRoomWidth = 9;
    this.minRoomHeight = 9;
    this.locations = [];

    // initialise map with all the space free
    for (let x = 0; x < width; x++) {
      this.locations[x] = [];
      for (let y = 0; y < height; y++) {
        //this.locations[x][y] = { free: true, room: null };
        this.locations[x][y] = new Location(false, null, CEILING, x, y);
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
        if (this.locations[x][y].isBlocked) {
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
        this.locations[x][y].blocked = true;
        //this.locations[x][y].room = room;
      }
    }
  }
  
  getDims(type) {
    let w = 0;
    let h = 0;
    if (type == LARGE) {
      // 23, 21, 19, 17, 15
      w = Math.floor(Math.random() * (20 - 15)) + 15;
      h = Math.floor(Math.random() * (20 - 15)) + 15;
      //w = 6;
      //h = 6;
    }
    if (type == MEDIUM) {
      // 19, 17, 15, 13, 11
      w = Math.floor(Math.random() * (16 - 11)) + 11;
      h = Math.floor(Math.random() * (16 - 11)) + 11;
      //w = 4;
      //h = 4;
    }
    if (type == SMALL) {
      // 15, 13, 11, 9
      w = Math.floor(Math.random() * (11 - 9)) + 9;
      h = Math.floor(Math.random() * (11 - 9)) + 9;
      //w = 2;
      //h = 2;
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
  
  layPath() {
    let toVisit = [this.rooms[0]];
    while (toVisit.length !== 0) {
      let current = toVisit.shift();
      
      for (let neighbour of current.connections) {
        let x = current.centre.x;
        let y = current.centre.y;
        
        // First, see if there is a path from current to neighbour.
        // If not, then start carving a path.
        // If during the carving, the path crosses through another
        // room/path, perform the path find again.
        // If there is still no path found, continue carving.
        
        if (current.centre.x < neighbour.centre.x) {
          while (x < neighbour.centre.x) {
            ++x;
            this.createRoom(x, y, 3, 3);
          }
        } else if (current.centre.x > neighbour.centre.x) {
          while (x > neighbour.centre.x) {
            --x;
            this.createRoom(x, y, 3, 3);
          }
        }
        if (current.centre.y < neighbour.centre.y) {
          while (y < neighbour.centre.y) {
            ++y;
            this.createRoom(x, y, 3, 3);
          }
        } else if (current.centre.y > neighbour.centre.y) {
          while (y > neighbour.centre.y) {
            --y;
            this.createRoom(x, y, 3, 3);
          }
        }
        current.connections.delete(neighbour);
        neighbour.connections.delete(current);
        toVisit.push(neighbour);
      }
    }
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
        if (room.numberConnections >= room.maxConnections) {
          break;
        }
        if (other.numberConnections + potentialNeighbours.length < other.maxConnections) {
          potentialNeighbours.push(other);
        }
      }
      console.log("size of potential neighbours:", potentialNeighbours.length);
      // add one or more neighbours to the room if there are any available.
      for (let i in potentialNeighbours) {
        room.addNeighbour(potentialNeighbours[i]);
        toVisit.push(potentialNeighbours.shift());
      }
    }
  }
  
  drawRooms(context) {
    console.log("draw rooms");
    context.fillStyle = '#22AA99';
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.locations[x][y].isBlocked) {
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

  /*
  doesIntersectY(x, y, gradient, offset, height) {
    let calcY = x * gradient + offset;
    return (y <= calcY && calcY <= y - height);
  }
  
  intersects(parent, child) {
    // This rooms has four lines that define its area and we check whether
    // any of those line intersect the path between the parent and child.
    let dx = child.centre.x - parent.centre.x;
    let dy = child.centre.y - parent.centre.y;
    let gradient = dy / dx;
    
    let offset = child.centre.y - (child.centre.x * gradient);
    var found = [];
    
    for (let room of this.rooms) {
      let x = room.pos.x;
      if (this.doesIntersectY(room.pos.x, room.pos.y, gradient, offset, room.height) ||
          this.doesIntersectY(room.pos.x + room.width, room.pos.y, gradient, offset, room.height) ||
          this.doesIntersectX(room.pos.x, room.pos.y, gradient, offset, room.width) ||
          this.doesIntersectX(room.pos.x, room.pos.y - room.height, gradient, offset, room.width))
        found.push(room);
    }
    return found;
  }
  
  refineGraph() {
    // For each connection, check whether it intersects a different room(s)
    // before its target. If this happens we can make the connection to and
    // from the intersecting room, which may already be connected to the parent
    // or child.
    let toVisit = [this.rooms[0]];
    
    for (let parent of toVisit) {
      let newNeighbours = [];
      console.log("refining from new parent");
      for (let child of parent.connections) {
        let intersecting = this.intersects(parent, child);
        console.log(intersecting.length, "intersecting rooms");

        // for each of the intersecting rooms, add that room between the parent
        // and children, while also removing the direct link from the parent and
        // child.
        if (intersecting.length !== 0) {
          let removeNeighbour = false;
          for (let intersect of intersecting) {
            if (parent.connections.has(intersect)) {
              continue;
            } else {
              removeNeighbour = true;
            }
            newNeighbours.push(intersect);
            //parent.neighbours.add(intersect);
            intersect.addNeighbour(child);
          }
          if (removeNeighbour) {
            parent.removeNeighbour(child);
          }
        }
      }
      for (let neighbour of newNeighbours) {
        parent.addNeighbour(neighbour);
      }
    }
    console.log("finished refining graph");
  }
  */