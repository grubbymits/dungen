"use strict";

const POTION_OFFSET = 5;
const SPELL_OFFSET = 6;
const SWORD_OFFSET = 7;
const AXE_OFFSET = 8;
const THROWING_OFFSET = 9;
const BOW_OFFSET = 9;
const PROJECTILE_OFFSET = 10;
const ARMOUR_OFFSET = 11;
const HELMET_OFFSET = 12;
const SHIELD_OFFSET = 13;
const STAFF_OFFSET = 14;
const TREASURE_OFFSET = 15;
const SYMBOL_OFFSET = 17;
const HERO_OFFSET = 18;
const MONSTER_OFFSET = 19;

class SpriteSheet {
  constructor(name) {
    this.image = new Image();
    this.ready = false;

    if (name) {
      this.image.src = "res/img/" + name + ".png";
      this.name = name;
    }
    else {
      throw new Error("No filename passed");
    }
    console.log("load", name);
  }
}

class Sprite {
  constructor(spriteSheet, offsetX, offsetY) {
    this.spriteSheet = spriteSheet;
    this.offsetX = offsetX * TILE_SIZE;
    this.offsetY = offsetY * TILE_SIZE;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
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

var greenSpriteSheet = new SpriteSheet('tileset-green-64');
var redSpriteSheet = new SpriteSheet('tileset-red-64');
var blueSpriteSheet = new SpriteSheet('tileset-blue-64');
var yellowSpriteSheet = new SpriteSheet('tileset-yellow-64');
var uiSpriteSheet = new SpriteSheet('ui');

var targetSprite = new Sprite(uiSpriteSheet, 0, 0);
var currentActorSprite = new Sprite(uiSpriteSheet, 1, 0);


const TILE_TRIANGLE_DOTS = 0;
const TILE_HORIZONTAL_LINES = 1;
const TILE_DIAGONAL_LINES = 2;
const TILE_DENSE_CROSS = 3;
const TILE_LARGE_CROSS = 4;
const TILE_LARGE_SQUARE = 5;
const TILE_SMALL_SQUARE = 6;
const TILE_SPARSE_CROSS = 7;

const TILE_LIGHT_SOLID = 8;
const TILE_LIGHT_RAISED = 9;
const TILE_DARK_SOLID = 10;
const TILE_DARK_CRACKED = 11;
const TILE_DARK_DOOR = 12;
const TILE_LIGHT_RAISED_LAYER = 13;
const TILE_DARK_RAISED_LAYER = 14;
const TILE_THICK_BRICK = 15;
const TILE_THIN_BRICK = 16;
const TILE_THIN_BRICK_HOLE = 17;
const TILE_NARROW_DOOR = 18;
const TILE_ROUND_DOOR = 19;
const TILE_SQUARE_DOOR = 20;
const TILE_PILLARS = 21;
const TILE_PILLAR_DOOR = 22;
const TILE_GRATE = 23;
const TILE_SPIKES = 24;
const TILE_CHEQUER = 25;
const TILE_WATER = 26;
const TILE_DIRT = 27;
const TILE_SPACE = 28;

var tileSprites = [];
// Path patterns
for (let x = 0; x < 8; ++x) {
  tileSprites.push(new Sprite(greenSpriteSheet, x, 0));
}

for (let x = 0; x < 5; ++x) {
  tileSprites.push(new Sprite(greenSpriteSheet, x, 1));
}

for (let y = 2; y < 4; ++y) {
  for (let x = 0; x < 8; ++x) {
    tileSprites.push(new Sprite(greenSpriteSheet, x, y));
  }
}

for (let x = 0; x < 6; ++x) {
  tileSprites.push(new Sprite(greenSpriteSheet, x, SYMBOL_OFFSET));
}

var entryStairSprite = new Sprite(greenSpriteSheet, 6, 1);
var exitStairSprite = new Sprite(greenSpriteSheet, 5, 1);
                    
var heroSprites = [];
var damageHeroSprites = [];
var frozenHeroSprites = [];
var shockedHeroSprites = [];
var monsterSprites = [];
var monsterDamageSprites = [];
var frozenMonsterSprites = [];
var shockedMonsterSprites = [];
var swordSprites = [];
var fireSwordSprites = [];
var iceSwordSprites = [];
var electricSwordSprites = [];
var axeSprites = [];
var fireAxeSprites = [];
var iceAxeSprites = [];
var electricAxeSprites = [];
var staffSprites = [];
var fireStaffSprites = [];
var iceStaffSprites = [];
var electricStaffSprites = [];
var bowSprites = [];
var fireBowSprites = [];
var iceBowSprites = [];
var electricBowSprites = [];
var arrowSprites = [];
var fireArrowSprites = [];
var iceArrowSprites = [];
var electricArrowSprites = [];
var throwingSprites = [];
var fireThrowingSprites = [];
var iceThrowingSprites = [];
var electricThrowingSprites = [];
var armourSprites = [];
var helmetSprites = [];
var shieldSprites = [];
var spellSprites = [];
var potionSprites = [];
var treasureSprites = [];

for (let y = MONSTER_OFFSET; y < (MONSTER_OFFSET + 4); ++y) {
  for (let x = 0; x < 8; ++x) {
    monsterSprites.push(new Sprite(greenSpriteSheet, x, y));
    monsterDamageSprites.push(new Sprite(redSpriteSheet, x, y));
    frozenMonsterSprites.push(new Sprite(blueSpriteSheet, x, y));
    shockedMonsterSprites.push(new Sprite(yellowSpriteSheet, x, y));
  }
}

for (let x = 0; x < 3; ++x) {
  throwingSprites.push(new Sprite(greenSpriteSheet, x, THROWING_OFFSET));
  fireThrowingSprites.push(new Sprite(redSpriteSheet, x, THROWING_OFFSET));
  iceThrowingSprites.push(new Sprite(blueSpriteSheet, x, THROWING_OFFSET));
  electricThrowingSprites.push(new Sprite(yellowSpriteSheet, x, THROWING_OFFSET));
}

for (let x = 3; x < 8; ++x) {
  bowSprites.push(new Sprite(greenSpriteSheet, x, BOW_OFFSET));
  fireBowSprites.push(new Sprite(redSpriteSheet, x, BOW_OFFSET));
  iceBowSprites.push(new Sprite(blueSpriteSheet, x, BOW_OFFSET));
  electricBowSprites.push(new Sprite(yellowSpriteSheet, x, BOW_OFFSET));
  arrowSprites.push(new Sprite(greenSpriteSheet, x, PROJECTILE_OFFSET));
  fireArrowSprites.push(new Sprite(redSpriteSheet, x, PROJECTILE_OFFSET));
  iceArrowSprites.push(new Sprite(blueSpriteSheet, x, PROJECTILE_OFFSET));
  electricArrowSprites.push(new Sprite(yellowSpriteSheet, x, PROJECTILE_OFFSET));
}

for (let x = 0; x < 8; ++x) {
  spellSprites.push(new Sprite(greenSpriteSheet, x, SPELL_OFFSET));

  swordSprites.push(new Sprite(greenSpriteSheet, x, SWORD_OFFSET));
  fireSwordSprites.push(new Sprite(redSpriteSheet, x, SWORD_OFFSET));
  iceSwordSprites.push(new Sprite(blueSpriteSheet, x, SWORD_OFFSET));
  electricSwordSprites.push(new Sprite(yellowSpriteSheet, x, SWORD_OFFSET));
  
  axeSprites.push(new Sprite(greenSpriteSheet, x, AXE_OFFSET));
  fireAxeSprites.push(new Sprite(redSpriteSheet, x, AXE_OFFSET));
  iceAxeSprites.push(new Sprite(blueSpriteSheet, x, AXE_OFFSET));
  electricAxeSprites.push(new Sprite(yellowSpriteSheet, x, AXE_OFFSET));
  
  staffSprites.push(new Sprite(greenSpriteSheet, x, STAFF_OFFSET));
  fireStaffSprites.push(new Sprite(redSpriteSheet, x, STAFF_OFFSET));
  iceStaffSprites.push(new Sprite(blueSpriteSheet, x, STAFF_OFFSET));
  electricStaffSprites.push(new Sprite(yellowSpriteSheet, x, STAFF_OFFSET));
  
  armourSprites.push(new Sprite(greenSpriteSheet, x, ARMOUR_OFFSET));
  helmetSprites.push(new Sprite(greenSpriteSheet, x, HELMET_OFFSET));
  shieldSprites.push(new Sprite(greenSpriteSheet, x, SHIELD_OFFSET));
  spellSprites.push(new Sprite(greenSpriteSheet, x, SPELL_OFFSET));
  potionSprites.push(new Sprite(greenSpriteSheet, x, POTION_OFFSET));
  treasureSprites.push(new Sprite(greenSpriteSheet, x, TREASURE_OFFSET));
  
  heroSprites.push(new Sprite(greenSpriteSheet, x, HERO_OFFSET));
  damageHeroSprites.push(new Sprite(redSpriteSheet, x, HERO_OFFSET));
  frozenHeroSprites.push(new Sprite(blueSpriteSheet, x, HERO_OFFSET));
  shockedHeroSprites.push(new Sprite(yellowSpriteSheet, x, HERO_OFFSET));
}
var chestSprites = [ new Sprite(greenSpriteSheet, 0, 4),
                     new Sprite(greenSpriteSheet, 1, 4)
                   ];

var skullSprites = [ new Sprite(greenSpriteSheet, 0, 16),
                     new Sprite(greenSpriteSheet, 1, 16),
                     new Sprite(greenSpriteSheet, 2, 16)
                   ];
