"use strict";

class Entity {
  constructor(position, blocking, sprite, game) {
    this.position = position;
    this.blocking = blocking;
    this.sprite = sprite;
    this.game = game;
    console.log("constructing entity");
  }
  render() {
    this.sprite.render(this.pos.x * TILE_SIZE, this.pos.y * TILE_SIZE, this.game.context);
  }
}

class Actor extends Entity {
  constructor(health, energy, position, sprite, game) {
    super(position, true, sprite, game);
    this.currentHealth = health;
    this.maxHealth = health;
    this.currentEnergy = energy;
    this.maxEnergy = energy;
    this.walk = new WalkAction(this);
    this.rest = new RestAction(this);
    this.findTarget = new TargetFinder(this);
    this.targetGen = this.findTarget.find();
    this.nextAction = null;
    this.destination = new Vec(this.position.x, this.position.y);
    this.currentPath = [];
  }
  get action() {
    console.log("nextAction");
    // If this actor has a destination which it is not at, move toward it.
    if (this.destination != this.position && this.currentPath.length != 0) {
      console.log("nextAction = walk");
      this.nextAction = this.walk;
    } else {
      this.nextAction = null;
    }
  }
  get pos() {
    return this.position;
  }
  set pos(pos) {
    this.position = pos;
  }
  get path() {
    return this.currentPath;
  }
  get energy() {
    this.currentEnergy;
  }
  set energy(energy) {
    this.currentEnergy = energy;
  }
  get nextStep() {
    return this.currentPath[0];
  }
  shiftNextStep() {
    this.currentPath.shift();
  }
  setDestination(x, y) {
    this.destination = this.game.map.getLocation(x, y).vec;
    this.currentPath = this.game.map.getPath(this.position, this.destination);
  }
}

class Hero extends Actor {
  constructor(health, energy, position, sprite, game) {
    super(health, energy, position, sprite, game);
  }
  setWalkAction(dir) {
    this.nextAction = this.walk(this, dir);
  }
}

class Monster extends Actor {
  constructor(health, energy, position, sprite) {
    super(health, energy, position, sprite);
  }
  calcAction() {
    if (this.energy <= 0) {
      return this.rest;
    }
  }
}

class Rat extends Monster {
  constructor(position, game) {
    super(5, 3, position, ratSprite);
    this.index = 0;
  }
}

class Spiders extends Monster {
  constructor(position, game) {
    super(5, 3, position, spidersSprite);
    this.index = 1;
  }
}

class Lizard extends Monster {
  constructor(position, game) {
    super(15, 4, position, lizardSprite);
    this.index = 2;
  }
}

class SpiderChampion extends Monster {
  constructor(position, game) {
    super(20, 4, position, bigSpiderSprite);
    this.index = 3;
  }
}

const ENEMY_NAMES = [ "Rat",
                      "Spiders",
                      "Lizard",
                      "Spider Champion",
                      "Toad",
                      "Scarab",
                      "Centipede",
                      "Serpent",    // 7
                      "Mushroom",
                      "Rabbit",
                      "Bat",
                      "Bat Champion",
                      "Snake",
                      "Wolf",
                      "Wild Boar",
                      "Bear",        // 15
                      "Slimes",
                      "Slime Champion",
                      "Scorpion",
                      "Kraken",
                      "Vampire",
                      "Mummy",
                      "Wraith",
                      "Carabia",      // 23
                      "Goblin",
                      "Zombie",
                      "Undead",
                      "Orc",
                      "Cyclop",
                      "Werewolf",
                      "Golem",
                      "Demon" ];

const RAT = 0;
const SPIDERS = 1;
const LIZARD = 2;
const SPIDER_CHAMPION = 3;
const TOAD = 4;
const SCARAB = 5;
const CENTIPEDE = 6;
const SERPENT = 7;
const MUSHROOM = 8;
const RABBIT = 9;
const BAT = 10;
const BAT_CHAMPION = 11;
const SNAKE = 12;
const WOLF = 13;
const WILD_BOAR = 14;
const BEAR = 15;
const SLIMES = 16;
const SLIME_CHAMPION = 17;
const SCORPION = 18;
const KRAKEN = 19;
const VAMPIRE = 20;
const MUMMY = 21;
const WRAITH = 22;
const CARABIA = 23;
const GOBLIN = 24;
const ZOMBIE = 25;
const UNDEAD = 26;
const ORC = 27;
const CYCLOP = 28;
const WEREWOLF = 29;
const GOLEM = 30;
const DEMON = 31;

const ROGUE = 0;
const WARLOCK = 1;
const BERSERKER = 2;
const ARCHER = 4;
const KNIGHT = 5;
const WIZARD = 6;
const BLACK_MAGE = 7;

function createMonster(type, position, game) {
  switch(type) {
    default:
    throw new console.error("Unknown monster type!");
  }
}
