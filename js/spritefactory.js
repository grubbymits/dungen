"use strict";

const NW = 0;
const N = 1;
const NE = 2;
const W = 3;
const C = 4;
const E = 5;
const SW = 6;
const S = 7;
const SE = 8;

// standalone floor tiles
const GRASS0 = 0;
const DIRT0 = 1;
const STONE0 = 2;
const SAND0 = 3;
const STONE1 = 4;
const GRASS1 = 5;
const DIRT1 = 6;
const STONE2 = 7;
const SAND1 = 8;
const ROCKY_GRASS = 9;
const BROWN_TILE0 = 10;
const GREY_TILE0 = 11;
const BEIGE_TILE0 = 12;
const BROWN_BOARD0 = 13;
const BROWN_BOARD1 = 14;
const BROWN_TILE1 = 15;
const GREY_TILE1 = 16;
const BEIGE_TILE1 = 17;
const BROWN_BOARD2 = 18;
const BROWN_BOARD3 = 19;
const BROWN_TILE2 = 20;
const BROWN_TILE3 = 21;
const BROWN_TILE4 = 22;
const BROWN_TILE5 = 23;
const BROWN_TILE6 = 24;
const BROWN_TILE7 = 25;
const BROWN_TILE8 = 26;
const BROWN_TILE9 = 27;
const BROWN_TILE10 = 28;
const BROWN_TILE11 = 29;


// 3x3 floor tiles
const GRASS_POND = 0;
const POND = 1;
const RED_FLOWER_BED = 2;
const WHITE_FLOWER_BED = 3;
const GREEN_FLOWER_BED = 4;
const GREEN_GRASS = 5;
const ORANGE_GRASS = 6;
const PURPLE_GRASS = 7;
const BROWN_CARPET = 8;
const GREY_CARPET = 9;
const BEIGE_CARPET = 10;
const GREEN_CARPET = 11;
const ORANGE_CARPET = 12;
const BLUE_CARPET = 13;
const TATTY_BROWN_CARPET = 14;
const TATTY_GREY_CARPET = 15;
const TATTY_BEIGE_CARPET = 16;
const TATTY_GREEN_CARPET = 17;
const TATTY_ORANGE_CARPET = 18;
const TATTY_BLUE_CARPET = 19;
const BROWN_DIRT = 20;
const GREY_DIRT = 21;
const BEIGE_DIRT = 22;

// map locations need to hold:
// - one value to say what group kind it is: single, 2x2, 3x3
// - one value to select the sub group
// - and a third value that looks up the direction: NW, N, NE ..etc

class SpriteFactory {
  constructor(sheet) {
    this.spriteSheet = sheet; //new SpriteSheet("kenney-rogue", 64, 4);
    this.floorSingleTiles = [];
    this.floor3x3Tiles = [];
    this.createFloorSingleTiles();
  }
  
  getFloor3x3Tile(type, direction) {
    return this.floor3x3Tiles[type][direction];
  }
  
  floor3x3(start) {
    var tiles = [];
    for (let y = start.y; y < start.y + 3; ++y) {
      for (let x = start.x; x < start.x + 3; ++x) {
        tiles.push(new Sprite(this.spriteSheet, x, y));
      }
    }
    this.floor3x3Tiles.push(tiles);
  }
  
  getFloor1x1Tile(type) {
    return this.floorSingleTiles[type];
  }
  
  createFloorSingleTiles() {
    let tx = 5;
    let ty = 0;
    
    // From GRASS0 to BROWN_TILE11
    for (let y = ty; y < ty + 6; ++y) {
      for (let x = tx; x < tx + 5; ++x) {
        this.floorSingleTiles.push(new Sprite(this.spriteSheet, x, y));
      }
    }
  }

  createFloor3x3Tiles() {
    let tx = 2;
    let ty = 0;
  
    // GRASS_POND down to PURPLE_GRASS
    for (ty = 0; ty < 24; ty += 3) {
      let start = {x : tx, y : ty };
      this.floor3x3(start);
    }
   
    // BEIGE_CARPET across to BLUE_CARPET
    ty = 26;
    for (tx = 0; tx < 18; tx += 3) {
      let start = {x : tx, y : ty };
      this.floor3x3(start);
    }
    
    // TATTY_BEIGE_CARPET across to TATTY_BLUE_CARPET
    ty = 29;
    for (tx = 0; tx < 18; tx += 3) {
      let start = {x : tx, y : ty };
      this.floor3x3(start);
    }
  }
}