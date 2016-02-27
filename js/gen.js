"use strict";

const LARGE = 0;
const MEDIUM = 1;
const SMALL = 2;

class Room {
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
        //let width = roomDims[i][0];
        //let height = roomDims[i][1];
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
  drawRooms(context) {
    context.fillStyle = '#22AA99';
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (!this.locations[x][y].free) {
          context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }
}