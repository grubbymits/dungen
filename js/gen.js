class Rooom {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.area = width * height;
    this.neighbours = [];
  }
}


class MapGenerator {
  constructor(width, height, minSize, maxSize, minConnections, maxConnections) {
    this.width = width;
    this.height = height;
    this.minConnections = minConnections;
    this.maxConnections = maxConnections;
    // set the min to include the space required by the walls.
    this.minRoomWidth = 8;
    this.minRoomHeight = 8;
    
    // initialise map with all the space free
    for (let x = 0; x < width; x++) {
      this.locations[x] = [];
      for (let y = 0; y < height; y++) {
        this.locations[x][y] = { free: true, room: null };
      }
    }
    this.rooms = [];
  }
  get randomX() {
    let min = 1;
    let max = this.mapWidth - this.minRoomWidth;
    return Math.floor(Math.random() * (max - min)) + min;
  }
  get randomY() {
    let min = 1;
    let max = this.mapHeight - this.minRoomHeight;
    return Math.floor(Math.random() * (max - min)) + min;
  }
  isSpace(startX, startY, width, height) {
    for (let x = startX; x < startX + width; x++) {
      for (let y = startY; y < startY + height; y++) {
        if (isOutOfRange(x, y)) {
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
    this.rooms.push(room);
    for (let x = startX; x < startX + width; x++) {
      for (let y = startY; y < startY + height; y++) {
        this.locations[x][y].free = false;
        this.locations[x][y].room = room;
      }
    }
  }
  placeRooms(roomsToPlace, attempts) {
    let numBigRooms = Math.floor(roomsToPlace / 6);
    let numMediumRooms = Math.floor(2 * roomsToPlace / 6);
    let numSmallRooms = Math.floor(3 * roomsToPlace / 6);
    
    while (roomsToPlace !== 0 && attempts < maxAttempts) {
      
      // place larger rooms first
      for (let room = 0; room < numBigRooms; ++room) {
        let x = this.randomX;
        let y = this.randomY;
        let width = 12;
        let height = 12;
        
        if (isSpace(x, y, width, height)) {
          createRoom(x, y, width, height);
        }
      }
    }
  }
}