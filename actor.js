"use strict";

class Entity {
  constructor(position, blocking, sprite, game) {
    this.position = position;
    this.blocking = blocking;
    this.sprite = sprite;
    this.game = game;
  }
}

class Actor extends Entity {
  constructor(health, energy, position, sprite, game) {
    super(position, true, sprite, game);
    this.health = health;
    this.energy = energy;
    this.walk = new WalkAction(this, null);
    this.rest = new RestAction(this);
    this.nextAction = this.rest;
  }
  get action() {
    // Calculate what the next action should be.
    return this.nextAction;
  }
  get pos() {
    return this.position;
  }
  set energy(energy) {
    this.energy = energy;
  }

}

class Hero extends Actor {
  constructor(health, energy, position, sprite) {
    super(health, energy, position, sprite);
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

function createMonster(type, position, game) {
  switch(type) {
    default:
    throw new console.error("Unknown monster type!");
  }
}
