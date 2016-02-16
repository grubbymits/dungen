"use strict";

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
    this.projectileRange = 0;
    this.kind = MONSTER;
  }
  get action() {
    console.log("monster get action");
    if (this.currentEnergy <= 0) {
      return this.rest;
    } else if (this.nextAction === null) {
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
    super(5, 4, 2,
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
