"use strict";

const SWORD_OFFSET = 7;
const AXE_OFFSET = 8;
const ARMOUR_OFFSET = 11;
const HELMET_OFFSET = 12;
const SHIELD_OFFSET = 13;
const STAFF_OFFEST = 14;
const PLAYER_OFFSET = 18;
const ENEMY_OFFSET = 19;

const TOTAL_NUM_SHEETS = 1;

SpriteSheet.totalLoaded = 0;
SpriteSheet.prototype.image;
SpriteSheet.prototype.name;
SpriteSheet.prototype.ready;

function SpriteSheet(name) {
  this.image = new Image();
  this.ready = false;
  this.image.addEventListener('load', this.onLoad);

  if (name) {
    this.image.src = name + ".png";
    this.name = name;
  }
  else {
    // TODO needs to throw error
    throw new Error("No filename passed");
  }
  console.log("load", name);
}

SpriteSheet.prototype.onLoad = function() {
  console.log("SpriteSheet.onLoad: ", this.name);
  this.ready = true;
  SpriteSheet.totalLoaded++;
  if (SpriteSheet.totalLoaded == TOTAL_NUM_SHEETS) {
    begin();
  }
};

SpriteSheet.prototype.isReady = function() {
  //console.log("Sprite.isReady", this.ready);
  return this.ready;
};

class Sprite {
  constructor(spriteSheet, offsetX, offsetY, width, height) {
    this.spriteSheet = spriteSheet;
    this.offsetX = offsetX * width;
    this.offsetY = offsetY * height;
    this.width = width;
    this.height = height;
  }

  render(desX, desY, context) {
    //context.clearRect(desX, desY, this.width, this.height);
    context.drawImage(this.spriteSheet.image,
                      this.offsetX,
                      this.offsetY,
                      this.width, this.height,
                      desX * UPSCALE_FACTOR, desY * UPSCALE_FACTOR,
                      this.width * UPSCALE_FACTOR, this.height * UPSCALE_FACTOR);
  }
}

var sprite_sheet = new SpriteSheet('tileset');
var tileSprites = [ new Sprite(sprite_sheet, 1, 1, 32, 32),
                    new Sprite(sprite_sheet, 1, 0, 32, 32),
                    new Sprite(sprite_sheet, 2, 2, 32, 32)];
                    
var knightSprite = new Sprite(sprite_sheet, 5, 18, 32, 32);
