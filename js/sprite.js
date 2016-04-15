"use strict";

const SWORD_OFFSET = 7;
const AXE_OFFSET = 8;
const ARMOUR_OFFSET = 11;
const HELMET_OFFSET = 12;
const SHIELD_OFFSET = 13;
const STAFF_OFFEST = 14;
const PLAYER_OFFSET = 18;
const ENEMY_OFFSET = 19;

const TOTAL_NUM_SHEETS = 2;

var loadedgreenSpriteSheets = 0;

class SpriteSheet {
  constructor(name) {
    this.image = new Image();
    this.ready = false;
    this.image.addEventListener('load', this.onLoad);

    if (name) {
      this.image.src = "res/img/" + name + ".png";
      this.name = name;
    }
    else {
      throw new Error("No filename passed");
    }
    console.log("load", name);
  }
  onLoad() {
    console.log("greenSpriteSheet.onLoad: ", this.name);
    this.ready = true;
    loadedgreenSpriteSheets++;
    if (loadedgreenSpriteSheets == TOTAL_NUM_SHEETS) {
      begin();
    }
  }
  get isReady() {
    return this.ready;
  }
}

class Sprite {
  constructor(spriteSheet, offsetX, offsetY, width, height) {
    this.greenSpriteSheet = greenSpriteSheet;
    this.offsetX = offsetX * TILE_SIZE;
    this.offsetY = offsetY * TILE_SIZE;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
  }

  render(desX, desY, context) {
    //context.clearRect(desX, desY, this.width, this.height);
    context.drawImage(this.greenSpriteSheet.image,
                      this.offsetX,
                      this.offsetY,
                      this.width, this.height,
                      desX * UPSCALE_FACTOR, desY * UPSCALE_FACTOR,
                      this.width * UPSCALE_FACTOR, this.height * UPSCALE_FACTOR);
  }
}

var greenSpriteSheet = new SpriteSheet('tileset-green-64');
var redgreenSpriteSheet = new SpriteSheet('tileset-red-64');
var tileSprites = [ new Sprite(greenSpriteSheet, 1, 1, 32, 32),
                    new Sprite(greenSpriteSheet, 7, 0, 32, 32),
                    new Sprite(greenSpriteSheet, 2, 2, 32, 32)];

var rogueSprite = new Sprite(greenSpriteSheet, 0, 18, 32, 32);
var warlockSprite = new Sprite(greenSpriteSheet, 1, 18, 32, 32);
var berserkerSprite = new Sprite(greenSpriteSheet, 2, 18, 32, 32);
var archerSprite = new Sprite(greenSpriteSheet, 4, 18, 32, 32);
var knightSprite = new Sprite(greenSpriteSheet, 5, 18, 32, 32);
var mageSprite = new Sprite(greenSpriteSheet, 6, 18, 32, 32);
var blackMageSprite = new Sprite(greenSpriteSheet, 7, 18, 32, 32);

var damageKnightSprite = new Sprite(redgreenSpriteSheet, 5, 18, 32, 32);
var damageMageSprite = new Sprite(redgreenSpriteSheet, 6, 18, 32, 32);

var monsterSprites = [ new Sprite(greenSpriteSheet, 0, 19, 32, 32),
                       new Sprite(greenSpriteSheet, 1, 19, 32, 32),
                       new Sprite(greenSpriteSheet, 2, 19, 32, 32),
                       new Sprite(greenSpriteSheet, 3, 19, 32, 32),
                       new Sprite(greenSpriteSheet, 4, 19, 32, 32),
                       new Sprite(greenSpriteSheet, 5, 19, 32, 32),
                       new Sprite(greenSpriteSheet, 6, 19, 32, 32),
                       new Sprite(greenSpriteSheet, 7, 19, 32, 32),
                       new Sprite(greenSpriteSheet, 0, 20, 32, 32),
                       new Sprite(greenSpriteSheet, 1, 20, 32, 32),
                       new Sprite(greenSpriteSheet, 2, 20, 32, 32),
                       new Sprite(greenSpriteSheet, 3, 20, 32, 32),
                       new Sprite(greenSpriteSheet, 4, 20, 32, 32),
                       new Sprite(greenSpriteSheet, 5, 20, 32, 32),
                       new Sprite(greenSpriteSheet, 6, 20, 32, 32),
                       new Sprite(greenSpriteSheet, 7, 20, 32, 32),
                       new Sprite(greenSpriteSheet, 0, 21, 32, 32),
                       new Sprite(greenSpriteSheet, 1, 21, 32, 32),
                       new Sprite(greenSpriteSheet, 2, 21, 32, 32),
                       new Sprite(greenSpriteSheet, 3, 21, 32, 32),
                       new Sprite(greenSpriteSheet, 4, 21, 32, 32),
                       new Sprite(greenSpriteSheet, 5, 21, 32, 32),
                       new Sprite(greenSpriteSheet, 6, 21, 32, 32),
                       new Sprite(greenSpriteSheet, 7, 21, 32, 32),
                       new Sprite(greenSpriteSheet, 0, 22, 32, 32),
                       new Sprite(greenSpriteSheet, 1, 22, 32, 32),
                       new Sprite(greenSpriteSheet, 2, 22, 32, 32),
                       new Sprite(greenSpriteSheet, 3, 22, 32, 32),
                       new Sprite(greenSpriteSheet, 4, 22, 32, 32),
                       new Sprite(greenSpriteSheet, 5, 22, 32, 32),
                       new Sprite(greenSpriteSheet, 6, 22, 32, 32),
                       new Sprite(greenSpriteSheet, 7, 22, 32, 32)
                      ];
var monsterDamageSprites = [ new Sprite(redgreenSpriteSheet, 0, 19, 32, 32),
                             new Sprite(redgreenSpriteSheet, 1, 19, 32, 32),
                             new Sprite(redgreenSpriteSheet, 2, 19, 32, 32),
                             new Sprite(redgreenSpriteSheet, 3, 19, 32, 32),
                             new Sprite(redgreenSpriteSheet, 4, 19, 32, 32),
                             new Sprite(redgreenSpriteSheet, 5, 19, 32, 32),
                             new Sprite(redgreenSpriteSheet, 6, 19, 32, 32),
                             new Sprite(redgreenSpriteSheet, 7, 19, 32, 32),
                             new Sprite(redgreenSpriteSheet, 0, 20, 32, 32),
                             new Sprite(redgreenSpriteSheet, 1, 20, 32, 32),
                             new Sprite(redgreenSpriteSheet, 2, 20, 32, 32),
                             new Sprite(redgreenSpriteSheet, 3, 20, 32, 32),
                             new Sprite(redgreenSpriteSheet, 4, 20, 32, 32),
                             new Sprite(redgreenSpriteSheet, 5, 20, 32, 32),
                             new Sprite(redgreenSpriteSheet, 6, 20, 32, 32),
                             new Sprite(redgreenSpriteSheet, 7, 20, 32, 32),
                             new Sprite(redgreenSpriteSheet, 0, 21, 32, 32),
                             new Sprite(redgreenSpriteSheet, 1, 21, 32, 32),
                             new Sprite(redgreenSpriteSheet, 2, 21, 32, 32),
                             new Sprite(redgreenSpriteSheet, 3, 21, 32, 32),
                             new Sprite(redgreenSpriteSheet, 4, 21, 32, 32),
                             new Sprite(redgreenSpriteSheet, 5, 21, 32, 32),
                             new Sprite(redgreenSpriteSheet, 6, 21, 32, 32),
                             new Sprite(redgreenSpriteSheet, 7, 21, 32, 32),
                             new Sprite(redgreenSpriteSheet, 0, 22, 32, 32),
                             new Sprite(redgreenSpriteSheet, 1, 22, 32, 32),
                             new Sprite(redgreenSpriteSheet, 2, 22, 32, 32),
                             new Sprite(redgreenSpriteSheet, 3, 22, 32, 32),
                             new Sprite(redgreenSpriteSheet, 4, 22, 32, 32),
                             new Sprite(redgreenSpriteSheet, 5, 22, 32, 32),
                             new Sprite(redgreenSpriteSheet, 6, 22, 32, 32),
                             new Sprite(redgreenSpriteSheet, 7, 22, 32, 32)
                            ];
/*
var ratSprite = new Sprite(greenSpriteSheet, 0, 19, 32, 32);
var spidersSprite = new Sprite(greenSpriteSheet, 1, 19, 32, 32);
var lizardSprite = new Sprite(greenSpriteSheet, 2, 19, 32, 32);
var bigSpiderSprite = new Sprite(greenSpriteSheet, 3, 19, 32, 32);
var toadSprite = new Sprite(greenSpriteSheet, 4, 19, 32, 32);
var scarabSprite = new Sprite(greenSpriteSheet, 5, 19, 32, 32);
var centipedeSprite = new Sprite(greenSpriteSheet, 6, 19, 32, 32);
var serpentSprite = new Sprite(greenSpriteSheet, 7, 19, 32, 32);
var mushroomSprite = new Sprite(greenSpriteSheet, 0, 20, 32, 32);
var rabbitSprite = new Sprite(greenSpriteSheet, 1, 20, 32, 32);
var batSprite = new Sprite(greenSpriteSheet, 2, 20, 32, 32);
var bigBatSprite = new Sprite(greenSpriteSheet, 3, 20, 32, 32);
var snakeSprite = new Sprite(greenSpriteSheet, 4, 20, 32, 32);
var wolfSprite = new Sprite(greenSpriteSheet, 5, 20, 32, 32);
var boarSprite = new Sprite(greenSpriteSheet, 6, 20, 32, 32);
var bearSprite = new Sprite(greenSpriteSheet, 7, 20, 32, 32);
var slimesSprite = new Sprite(greenSpriteSheet, 0, 21, 32, 32);
var bigSlimeSprite = new Sprite(greenSpriteSheet, 1, 21, 32, 32);
var scorpionSprite = new Sprite(greenSpriteSheet, 2, 21, 32, 32);
var krakenSprite = new Sprite(greenSpriteSheet, 3, 21, 32, 32);
var vampireSprite = new Sprite(greenSpriteSheet, 4, 21, 32, 32);
var mummySprite = new Sprite(greenSpriteSheet, 5, 21, 32, 32);
var wraithSprite = new Sprite(greenSpriteSheet, 6, 21, 32, 32);
var carabiaSprite = new Sprite(greenSpriteSheet, 7, 21, 32, 32);
var goblinSprite = new Sprite(greenSpriteSheet, 0, 22, 32, 32);
var zombieSprite = new Sprite(greenSpriteSheet, 1, 22, 32, 32);
var undeadSprite = new Sprite(greenSpriteSheet, 2, 22, 32, 32);
var orcSprite = new Sprite(greenSpriteSheet, 3, 22, 32, 32);
var cyclopsSprite = new Sprite(greenSpriteSheet, 4, 22, 32, 32);
var werewolfSprite = new Sprite(greenSpriteSheet, 5, 22, 32, 32);
var golemSprite = new Sprite(greenSpriteSheet, 6, 22, 32, 32);
var demonSprite = new Sprite(greenSpriteSheet, 7, 22, 32, 32);
*/
var chestSprites = [ new Sprite(greenSpriteSheet, 0, 4, 32, 32),
                     new Sprite(greenSpriteSheet, 1, 4, 32, 32)
                   ];
var potionSprites = [ new Sprite(greenSpriteSheet, 0, 5, 32, 32),
                      new Sprite(greenSpriteSheet, 1, 5, 32, 32),
                      new Sprite(greenSpriteSheet, 2, 5, 32, 32),
                      new Sprite(greenSpriteSheet, 3, 5, 32, 32),
                      new Sprite(greenSpriteSheet, 4, 5, 32, 32),
                      new Sprite(greenSpriteSheet, 5, 5, 32, 32),
                      new Sprite(greenSpriteSheet, 6, 5, 32, 32),
                      new Sprite(greenSpriteSheet, 7, 5, 32, 32),
                    ];
var swordSprites = [ new Sprite(greenSpriteSheet, 0, 7, 32, 32),
                     new Sprite(greenSpriteSheet, 1, 7, 32, 32),
                     new Sprite(greenSpriteSheet, 2, 7, 32, 32),
                     new Sprite(greenSpriteSheet, 3, 7, 32, 32),
                     new Sprite(greenSpriteSheet, 4, 7, 32, 32),
                     new Sprite(greenSpriteSheet, 5, 7, 32, 32),
                     new Sprite(greenSpriteSheet, 6, 7, 32, 32),
                     new Sprite(greenSpriteSheet, 7, 7, 32, 32),
                   ];
var axeSprites = [ new Sprite(greenSpriteSheet, 0, 8, 32, 32),
                   new Sprite(greenSpriteSheet, 1, 8, 32, 32),
                   new Sprite(greenSpriteSheet, 2, 8, 32, 32),
                   new Sprite(greenSpriteSheet, 3, 8, 32, 32),
                   new Sprite(greenSpriteSheet, 4, 8, 32, 32),
                   new Sprite(greenSpriteSheet, 5, 8, 32, 32),
                   new Sprite(greenSpriteSheet, 6, 8, 32, 32),
                   new Sprite(greenSpriteSheet, 7, 8, 32, 32),
                  ];
var armourSprites = [ new Sprite(greenSpriteSheet, 0, 11, 32, 32),
                      new Sprite(greenSpriteSheet, 1, 11, 32, 32),
                      new Sprite(greenSpriteSheet, 2, 11, 32, 32),
                      new Sprite(greenSpriteSheet, 3, 11, 32, 32),
                      new Sprite(greenSpriteSheet, 4, 11, 32, 32),
                      new Sprite(greenSpriteSheet, 5, 11, 32, 32),
                      new Sprite(greenSpriteSheet, 6, 11, 32, 32),
                      new Sprite(greenSpriteSheet, 7, 11, 32, 32),
                    ];
var helmetSprites = [ new Sprite(greenSpriteSheet, 0, 12, 32, 32),
                      new Sprite(greenSpriteSheet, 1, 12, 32, 32),
                      new Sprite(greenSpriteSheet, 2, 12, 32, 32),
                      new Sprite(greenSpriteSheet, 3, 12, 32, 32),
                      new Sprite(greenSpriteSheet, 4, 12, 32, 32),
                      new Sprite(greenSpriteSheet, 5, 12, 32, 32),
                      new Sprite(greenSpriteSheet, 6, 12, 32, 32),
                      new Sprite(greenSpriteSheet, 7, 12, 32, 32),
                    ];
var shieldSprites = [ new Sprite(greenSpriteSheet, 0, 13, 32, 32),
                      new Sprite(greenSpriteSheet, 1, 13, 32, 32),
                      new Sprite(greenSpriteSheet, 2, 13, 32, 32),
                      new Sprite(greenSpriteSheet, 3, 13, 32, 32),
                      new Sprite(greenSpriteSheet, 4, 13, 32, 32),
                      new Sprite(greenSpriteSheet, 5, 13, 32, 32),
                      new Sprite(greenSpriteSheet, 6, 13, 32, 32),
                      new Sprite(greenSpriteSheet, 7, 13, 32, 32),
                    ];
var staffSprites = [ new Sprite(greenSpriteSheet, 0, 14, 32, 32),
                     new Sprite(greenSpriteSheet, 1, 14, 32, 32),
                     new Sprite(greenSpriteSheet, 2, 14, 32, 32),
                     new Sprite(greenSpriteSheet, 3, 14, 32, 32),
                     new Sprite(greenSpriteSheet, 4, 14, 32, 32),
                     new Sprite(greenSpriteSheet, 5, 14, 32, 32),
                     new Sprite(greenSpriteSheet, 6, 14, 32, 32),
                     new Sprite(greenSpriteSheet, 7, 14, 32, 32),
                    ];
var treasureSprites = [ new Sprite(greenSpriteSheet, 0, 15, 32, 32),
                        new Sprite(greenSpriteSheet, 1, 15, 32, 32),
                        new Sprite(greenSpriteSheet, 2, 15, 32, 32),
                        new Sprite(greenSpriteSheet, 3, 15, 32, 32),
                        new Sprite(greenSpriteSheet, 4, 15, 32, 32),
                        new Sprite(greenSpriteSheet, 5, 15, 32, 32),
                        new Sprite(greenSpriteSheet, 6, 15, 32, 32),
                        new Sprite(greenSpriteSheet, 7, 15, 32, 32),
                      ];
var spellSprites = [ new Sprite(greenSpriteSheet, 0, 17, 32, 32),
                     new Sprite(greenSpriteSheet, 1, 17, 32, 32),
                     new Sprite(greenSpriteSheet, 2, 17, 32, 32),
                     new Sprite(greenSpriteSheet, 3, 17, 32, 32),
                     new Sprite(greenSpriteSheet, 4, 17, 32, 32),
                     new Sprite(greenSpriteSheet, 5, 17, 32, 32),
                     new Sprite(greenSpriteSheet, 6, 17, 32, 32),
                     new Sprite(greenSpriteSheet, 7, 17, 32, 32),
                    ];

var crystalBallSprite = new Sprite(greenSpriteSheet, 7, 18, 32, 32);
