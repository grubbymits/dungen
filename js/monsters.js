"use strict";

class Monster extends Actor {
  constructor(health, energy,
              defense, range, xp,
              meleeAtkPower, meleeAtkType, meleeAtkEnergy,
              position, sprite, damageSprite, game) {
    super(health, energy,
          position, sprite, damageSprite, MONSTER, game);
    this.level = this.game.level;
    this.exp = xp * this.level;
    this.range = range;
    this.rangedAttack = null;
    this.meleeAttack = new MeleeAttack(this);
    this.meleeAttackPower = meleeAtkPower;
    this.meleeAttackType = meleeAtkType;
    this.meleeAttackEnergy = meleeAtkEnergy;
    this.rangedAttackPower = 0;
    this.rangedAttackType = 0;
    this.rangedttackEnergy = 0;
    this.physicalDefense = defense;
    this.projectileRange = 0;
    this.meleeSound = document.getElementById("punchSound");
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
    return this.meleeAttackPower; //+ (this.level * this.meleeAttackPower * 0.05);
  }
  get rangedAtkPower() {
    return this.rangedAttackPower; //+ (this.level * this.meleeAttackPower * 0.05);
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
    super(18, 4,          // health, energy
          10, 3, 5,        // defense, range, xp
          1.5, NORMAL, 2,   // atkPower, atkType, atkEnergy
          position, ratSprite, damageRatSprite, game);
    this.index = RAT;
  }
}

class Spiders extends Monster {
  constructor(position, game) {
    super(20, 4,
          11, 3, 6,
          1.5, NORMAL, 2,
          position, spidersSprite, damageSpidersSprite, game);
    this.index = SPIDERS;
    this.meleeAttack = new MeleeAttack(this);
  }
}

class Lizard extends Monster {
  constructor(position, game) {
    super(30, 5,
          13, 4, 8,
          2, NORMAL, 2,
          position, lizardSprite, damageLizardSprite, game);
    this.index = LIZARD;
    this.meleeAttack = new MeleeAttack(this);
  }
}

class SpiderChampion extends Monster {
  constructor(position, game) {
    super(40, 4,
          13, 4, 10,
          2.5, NORMAL, 2,
          position, bigSpiderSprite, damageBigSpiderSprite, game);
    this.index = SPIDER_CHAMPION;
    this.meleeAttack = new MeleeAttack(this);
  }
}
