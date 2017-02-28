"use strict";

class MonsterPosition {
  constructor(type, vec) {
    this.type = type;
    this.vec = vec;
  }
}

class Room {
  
  constructor(x, y, width, height, id) {
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
    this.id = id;
    console.log("creating room with id:", id);
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

class MapGenerator {
  constructor(width, height, roomType, pathType) {
    this.roomFloor = roomType;
    this.pathFloor = pathType;
    // randomly choose either 4 or 5 for constant denominator
    let denominator = 5;
    if (Math.random() < 0.5) {
      denominator = 4;
    }
    console.log("room size denominator:", denominator);

    this.minLargeDim = Math.round(Math.min(MAP_WIDTH_PIXELS, MAP_HEIGHT_PIXELS) /
                                TILE_SIZE / denominator);
    this.medRoomDim = Math.round(this.minLargeDim * 0.8);
    this.minRoomDim = Math.round(this.minLargeDim * 0.6);

    this.xMax = width / TILE_SIZE;
    this.yMax = height / TILE_SIZE;
  }

  // Generate level and return start position
  generate(level, width, height, numPlayers) {
    this.rooms = [];
    //this.chestLocs = [];
    //this.skullLocs = [];
    //this.tombstoneLocs = [];
    //this.signLocs = [];
    //this.magicalObjectLocs = [];
    this.numPlayers = numPlayers;
    this.reservedLocs = [];
    this.symbolLocs = [];
    this.monsterPlacements = [];
    this.map = new GameMap(width, height);
    let numRooms = Math.round((MAP_WIDTH_PIXELS * MAP_HEIGHT_PIXELS) /
                              (TILE_SIZE * TILE_SIZE * this.medRoomDim * this.medRoomDim));
    this.placeRooms(numRooms);
    this.createConnections();
    this.fixupMap();
    this.placeStairs();
    this.decorate(); //Rooms();
  }

  fixupMap() {
    for (let x = 0; x < this.map.width; ++x) {
      for (let y = 0; y < this.map.height - 1; ++y) {

        let tileType = this.map.getLocationType(x, y);
        let tileBelowType = this.map.getLocationType(x, y + 1);

        if (tileType == CEILING) {
          if (tileBelowType != CEILING) {
            this.map.setLocationType(x, y + 1, WALL);
          }
        }
        else if (tileType != WALL) {
          if (tileBelowType == WALL) {
            this.map.setLocationType(x, y + 1, tileType);
          }
        }
      }
    }
  }

  placeTile(x, y, type, blocking) {
    // Check for out-of-bounds
    if (this.map.isOutOfRange(x, y)) {
      return;
    }
    this.map.setLocationType(x, y, type);
    this.map.setLocationBlocking(x, y, blocking);
  }

  get randomX() {
    let min = 1;
    let max = this.xMax - this.minRoomDim;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  get randomY() {
    let min = 1;
    let max = this.yMax - this.minRoomDim;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  isSpace(startX, startY, width, height) {
    for (let x = startX; x < startX + width; x++) {
      for (let y = startY; y < startY + height; y++) {
        if (this.map.isOutOfRange(x, y)) {
          return false;
        }
        // Only carve rooms into 'blocked' ceiling regions
        if (!this.map.getLocationType(x, y) == CEILING) {
          return false;
        }
      }
    }
    return true;
  }

  createRoom(startX, startY, width, height) {
    let room = new Room(startX, startY, width, height, this.rooms.length);
    this.rooms.push(room);
    for (let x = startX+1; x < startX + width-1; x++) {
      for (let y = startY+1; y < startY + height-1; y++) {
        this.placeTile(x, y, this.roomFloor, false);
      }
    }
    return room;
  }

  createPath(startX, startY) {
    for (let x = startX; x < startX + PATH_WIDTH; x++) {
      for (let y = startY; y < startY + PATH_WIDTH; y++) {
        this.placeTile(x, y, this.pathFloor, false);
      }
    }
  }

  getDims(type) {
    let w = 0;
    let h = 0;
    if (type == LARGE) {
      // 23, 21, 19, 17, 15
      w = Math.floor(Math.random() * 3) + this.minLargeDim;
      h = Math.floor(Math.random() * 3) + this.minLargeDim;
    }
    if (type == MEDIUM) {
      // 19, 17, 15, 13, 11
      w = Math.floor(Math.random() * 5) + this.medRoomDim;
      h = Math.floor(Math.random() * 5) + this.medRoomDim;
    }
    if (type == SMALL) {
      // 15, 13, 11, 9
      w = Math.floor(Math.random() * 5) + this.minRoomDim;
      h = Math.floor(Math.random() * 5) + this.minRoomDim;
    }
    return {width : w, height : h};
  }

  placeSign(room) {
    if (room.id == this.entryRoom.id || room.id == this.exitRoom.id) {
      return;
    }
    for (let x = room.pos.x; x < room.pos.x + room.width; ++x) {
      for (let y = room.pos.y; y < room.pos.y + room.height; ++y) {

        let loc = this.map.getLocation(x, y);
        if (loc.isBlocked) {
          continue;
        }

        if (this.map.getLocationType(x, y - 1) == WALL) {
          if ((this.map.getLocationType(x - 1, y - 1) == PATH) ||
              (this.map.getLocationType(x + 1, y - 1) == PATH)) {
            this.reserveLoc(SIGN, loc);
            //this.signLocs.push(loc);
            //loc.blocked = true;
            return;
          }
        } else if (this.map.getLocationType(x - 1, y) == WALL) {
          if ((this.map.getLocationType(x - 1, y - 1) == PATH) ||
              (this.map.getLocationType(x - 1, y + 1) == PATH)) {
            this.reserveLoc(SIGN, loc);
            //this.signLocs.push(loc);
            //loc.blocked = true;
            return;
          }
        } else if (this.map.getLocationType(x + 1, y) == WALL) {
          if ((this.map.getLocationType(x + 1, y - 1) == PATH) ||
              (this.map.getLocationType(x + 1, y + 1) == PATH)) {
            this.reserveLoc(SIGN, loc);
            //this.signLocs.push(loc);
            //loc.blocked = true;
            return;
          }
        } else if (this.map.getLocationType(x, y + 1) == WALL) {
          if ((this.map.getLocationType(x - 1, y + 1) == PATH) ||
              (this.map.getLocationType(x + 1, y + 1) == PATH)) {
            this.reserveLoc(SIGN, loc);
            //this.signLocs.push(loc);
            //loc.blocked = true;
            return;
          }
        }
      }
    }
  }

  placeSkull(room) {
    if (room.id == this.entryRoom.id || room.id == this.exitRoom.id) {
      return;
    }
    let loc = this.getRandomLocation(room);
    if (!loc.isBlocked) {
      this.reserveLoc(SKULL, loc);
      //this.skullLocs.push(loc);
      //loc.blocked = true;
    }
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
    console.log("creating connections between rooms");
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

  getRandomLocation(room) {
    const MAX_ATTEMPTS = 10;
    let attempts = 0;
    let x = room.pos.x;
    let y = room.pos.y;
    do {
      x = getBoundedRandom(room.pos.x, room.pos.x + room.width);
      y = getBoundedRandom(room.pos.y, room.pos.y + room.height);
      ++attempts;
    } while (this.map.getLocation(x, y).isBlocked || attempts < MAX_ATTEMPTS);

    return this.map.getLocation(x, y);
  }

  reserveLoc(type, loc) {
    this.reservedLocs.push({ type: type, loc: loc });
    loc.blocked = true;
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
    console.log("monster choices:");
    for (let monsterIdx in monsters) {
      console.log(ENEMY_NAMES[monsters[monsterIdx]]);
    }

    for (let current = 0; current < total; ++current) {
      if (current >= nextLimit) {
        roomIdx = (roomIdx + 1) % this.rooms.length;

        if (roomIdx >= this.rooms.length * 0.25) {
          nextLimit += (total / 16);
        } else {
          nextLimit += (total / 8);
        }
      }

      let room = this.rooms[roomIdx];
      if (room.id == this.entryRoom.id) {
        continue;
      }

      let loc = this.getRandomLocation(room);
      if (!loc.isBlocked) {
        let type = Math.floor(Math.random() * monsters.length);
        this.monsterPlacements.push(new MonsterPosition(monsters[type], loc.vec));
        loc.blocked = true;
      }
    }
  }

  placeChests() {
    const MAX_ATTEMPTS = 10;

    for (let room of this.rooms) {
      if (room.id == this.entryRoom.id || room.id == this.exitRoom.id) {
        continue;
      }

      let attempts = 0;
      let x = room.pos.x;
      let y = room.pos.y;
      do {
        x = getBoundedRandom(room.pos.x, room.pos.x + room.width);
        y = getBoundedRandom(room.pos.y, room.pos.y + room.height);
        ++attempts;
      } while (this.map.getLocation(x, y).isBlocked || attempts < MAX_ATTEMPTS);

      let loc = this.map.getLocation(x, y);
      if (!loc.isBlocked) {
        this.reserveLoc(CHEST, loc);
        //this.chestLocs.push(loc);
        //loc.blocked = true;
      }
    }
  }

  getStairLoc(room) {
    let x = room.centre.x;
    let y = room.centre.y;
    let loc = this.map.getLocation(x, y);
    while (loc.isBlocked) {
      x = getBoundedRandom(room.pos.x, room.pos.x + room.width);
      y = getBoundedRandom(room.pos.y, room.pos.y + room.height);
      loc = this.map.getLocation(x, y);
    }
    loc.blocked = true;
    return loc;
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

        let path = this.map.getPath(from.centre, to.centre);
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

    this.entryRoom = entry;
    this.exitRoom = exit;
    this.exitStairLoc = this.getStairLoc(exit);
    this.entryStairLoc = this.getStairLoc(entry);
    let neighbours = this.map.getNeighbours(this.entryStairLoc.vec);
    if (!neighbours.length)
      throw("no free neighbours next to stairs");
    else {
      this.entryVecs = [];
      for (let i = 0; i < this.numPlayers; ++i) {
        this.entryVecs.push(neighbours[i]);
        this.map.setLocationBlocking(this.entryVecs[i].x, this.entryVecs[i].y,
                                     true);
      }
    }
    let loc = this.getRandomLocation(entry);
    console.log("reserving loc for ally:", loc);
    this.reserveLoc(ALLY, loc);
  }
}


