"use strict";

class Monster extends Actor {
  constructor(health, energy, range,
              meleeAtkPower, meleeAtkType, meleeAtkEnergy,
              rangeAtkPower, rangeAtkType, rangeAtkEnergy,
              defense,
              xp,
              position, sprite, damageSprite, game) {
    super(health, energy, position, sprite, damageSprite, MONSTER, game);
    this.level = this.game.level;
    this.exp = xp * this.level;
    this.range = range;
    this.rangedAttack = null;
    this.meleeAttack = new MeleeAttack(this);
    this.meleeAttackPower = meleeAtkPower;
    this.meleeAttackType = meleeAtkType;
    this.meleeAttackEnergy = meleeAtkEnergy;
    this.rangedAttackPower = rangeAtkPower;
    this.rangedAttackType = rangeAtkType;
    this.rangedttackEnergy = rangeAtkEnergy;
    this.physicalDefense = defense;
    this.projectileRange = 0;
  }
  get action() {
    this.currentSprite = this.sprite;
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
  reduceHealth(enemy, damage) {
    console.log("dealing", damage, "to", ENEMY_NAMES[this.index]);
    this.currentHealth -= damage;
    console.log(ENEMY_NAMES[this.index],"health now:", this.currentHealth);
    this.setAttack(enemy);
    this.currentSprite = this.damageSprite;
    // set dirty so the health bar is redrawn
    this.game.map.setDirty(this.position);
  }
}

class Rat extends Monster {
  constructor(position, game) {
    super(5, 4, 4,
          6, NORMAL, 1,
          0, 0, 0,
          1,
          1,
          position, ratSprite, damageRatSprite, game);
    this.index = RAT;
  }
}

class Spiders extends Monster {
  constructor(position, game) {
    super(8, 3, 2,
          7, NORMAL, 1,
          0, 0, 0,
          5,
          2,
          position, spidersSprite, damageSpidersSprite, game);
    this.index = SPIDERS;
    this.meleeAttackPower = 2;
    this.meleeAttack = new MeleeAttack(this);
  }
}

class Lizard extends Monster {
  constructor(position, game) {
    super(15, 4, 3,
          8, NORMAL, 1,
          0, 0, 0,
          7,
          3,
          position, lizardSprite, damageLizardSprite, game);
    this.index = LIZARD;
    this.meleeAttackPower = 4;
    this.meleeAttack = new MeleeAttack(this);
  }
}

class SpiderChampion extends Monster {
  constructor(position, game) {
    super(20, 4, 3,
          10, NORMAL, 2,
          0, 0, 0,
          8,
          3,
          position, bigSpiderSprite, damageBigSpiderSprite, game);
    this.index = SPIDER_CHAMPION;
    this.meleeAttackPower = 5;
    this.meleeAttack = new MeleeAttack(this);
  }
}
