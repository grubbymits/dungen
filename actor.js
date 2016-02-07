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
  
  get pos() {
    return this.position;
  }
  set pos(pos) {
    this.position = pos;
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
    this.nextAction = null;
    this.destination = new Vec(this.position.x, this.position.y);
    this.currentPath = [];
    this.rangeAttack = null;
    this.meleeAttack = null;
  }
  get action() {
    //console.log("nextAction");
    // If this actor has a destination which it is not at, move toward it.
    if (this.destination != this.position && this.currentPath.length != 0) {
      //console.log("nextAction = walk");
      this.nextAction = this.walk;
    } else {
      this.nextAction = null;
    }
    return this.nextAction;
  }
  get path() {
    return this.currentPath;
  }
  get energy() {
    this.currentEnergy;
  }
  incrementEnergy() {
    this.currentEnergy = this.currentEnergy + 1;
  }
  useEnergy(required) {
    this.currentEnergy = this.currentEnergy - required;
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
}

class Monster extends Actor {
  constructor(health, energy, position, sprite, game) {
    super(health, energy, position, sprite, game);
    this.level = this.game.level;
    this.meleeAttack = null;
    this.rangedAttack = null;
    this.meleeAttackPower = 0;
    this.rangedAttackPower = 0;
  }
  calcAction() {
    if (this.energy <= 0) {
      return this.rest;
    }
  }
  get meleeAtkPower() {
    return this.meleeAttackPower + (this.level * this.meleeAttackPower * 0.05);
  }
  get rangedAtkPower() {
    return this.rangedAttackPower + (this.level * this.meleeAttackPower * 0.05);
  }
}



class Rat extends Monster {
  constructor(position, game) {
    super(5, 3, position, ratSprite);
    this.index = RAT;
    this.meleeAttackPower = 1;
    this.meleeAttack = new MeleeAttack(this);
  }
}

class Spiders extends Monster {
  constructor(position, game) {
    super(8, 3, position, spidersSprite, game);
    this.index = SPIDERS;
    this.meleeAttackPower = 2;
    this.meleeAttack = new MeleeAttack(this);
  }
}

class Lizard extends Monster {
  constructor(position, game) {
    super(15, 4, position, lizardSprite, game);
    this.index = LIZARD;
    this.meleeAttackPower = 4;
    this.meleeAttack = new MeleeAttack(this);
  }
}

class SpiderChampion extends Monster {
  constructor(position, game) {
    super(20, 4, position, bigSpiderSprite, game);
    this.index = SPIDER_CHAMPION;
    this.meleeAttackPower = 5;
    this.meleeAttack = new MeleeAttack(this);
  }
}
