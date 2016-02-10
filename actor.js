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
    this.attack = new Attack(this);
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
  incrementEnergy() {
    if (this.currentEnergy < this.maxEnergy) {
      this.currentEnergy = this.currentEnergy + 1;
    }
  }
  useEnergy(required) {
    this.currentEnergy = this.currentEnergy - required;
  }
  set energy(energy) {
    this.currentEnergy = energy;
  }
  reduceHealth(damage) {
    this.currentHealth -= damage;
  }
  get health() {
    return this.currentHealth;
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
  //setDestination(pos) {
    //this.destination = pos; //this.game.map.getLocation(x, y).vec;
    //this.currentPath = this.game.map.getPath(this.position, this.destination);
  //}
}

class Hero extends Actor {
  constructor(health, energy, position, sprite, game) {
    super(health, energy, position, sprite, game);
    this.bodyArmour = 1;
    this.helmet = 1;
  }
  
  get physicalDefense() {
    return this.bodyArmour + this.helmet;
  }
}

class Monster extends Actor {
  constructor(health, energy, range,
              meleeAtkPower, meleeAtkType, meleeAtkEnergy,
              rangeAtkPower, rangeAtkType, rangeAtkEnergy,
              defense,
              position, sprite, game) {
    super(health, energy, position, sprite, game);
    this.level = this.game.level;
    this.range = range;
    this.rangedAttack = null;
    this.meleeAttack = new MeleeAttack(this);
    this.findTarget = new FindTarget(this);
    this.meleeAttackPower = meleeAtkPower;
    this.meleeAttackType = meleeAtkType;
    this.meleeAttackEnergy = meleeAtkEnergy;
    this.rangedAttackPower = rangeAtkPower;
    this.rangedAttackType = rangeAtkType;
    this.rangedttackEnergy = rangeAtkEnergy;
    this.physicalDefense = defense;
    this.meleeRange = 2;
    this.projectileRange = 0;
  }
  get action() {
    console.log("monster get action");
    if (this.nextAction !== null) {
      return this.nextAction;
    }
    else if (this.currentEnergy <= 0) {
      this.nextAction = this.rest;
    } else {
      this.nextAction = this.findTarget;
    }
    return this.nextAction;
  }
  get meleeAtkPower() {
    return this.meleeAttackPower + (this.level * this.meleeAttackPower * 0.05);
  }
  get rangedAtkPower() {
    return this.rangedAttackPower + (this.level * this.meleeAttackPower * 0.05);
  }
  get meleeAtkEnergy() {
    return this.meleeAttackEnergy;
  }
  get meleeAtkType() {
    return this.meleeAttackType;
  }
}

class Rat extends Monster {
  constructor(position, game) {
    super(5, 3, 2,
          1, NORMAL, 1,
          0, 0, 0,
          1,
          position, ratSprite, game);
    this.index = RAT;
  }
}

class Spiders extends Monster {
  constructor(position, game) {
    super(8, 3, 2, position, spidersSprite, game);
    this.index = SPIDERS;
    this.meleeAttackPower = 2;
    this.meleeAttack = new MeleeAttack(this);
  }
}

class Lizard extends Monster {
  constructor(position, game) {
    super(15, 4, 3, position, lizardSprite, game);
    this.index = LIZARD;
    this.meleeAttackPower = 4;
    this.meleeAttack = new MeleeAttack(this);
  }
}

class SpiderChampion extends Monster {
  constructor(position, game) {
    super(20, 4, 3, position, bigSpiderSprite, game);
    this.index = SPIDER_CHAMPION;
    this.meleeAttackPower = 5;
    this.meleeAttack = new MeleeAttack(this);
  }
}
