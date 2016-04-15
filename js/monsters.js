"use strict";

class Monster extends Actor {
  constructor(health, energy, index,
              defense, range, xp,
              atkPower, atkType, atkEnergy,
              position, game) {
    super(health, energy, position,
          monsterSprites[index], monsterDamageSprites[index],
          MONSTER, game);
    this.level = this.game.level;
    this.index = index;
    this.exp = xp * this.level;
    this.range = range;
    this.attackPower = atkPower;
    this.attackType = atkType;
    this.attackEnergy = atkEnergy;
    this.physicalDefense = defense;
    //this.meleeSound = document.getElementById("punchSound");
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
  get atkPower() {
    return this.attackPower; //+ (this.level * this.meleeAttackPower * 0.05);
  }
  get atkEnergy() {
    return this.attackEnergy;
  }
  get atkType() {
    return this.attackType;
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
    super(40, 4, RAT,          // health, energy
          15, 3, 5,        // defense, range, xp
          1.5, NORMAL, 2,   // atkPower, atkType, atkEnergy
          position, game);
  }
}

class Spiders extends Monster {
  constructor(position, game) {
    super(44, 4, SPIDERS,
          15, 3, 6,
          1.5, NORMAL, 2,
          position, game);
  }
}

class Lizard extends Monster {
  constructor(position, game) {
    super(60, 5, LIZARD,
          18, 4, 8,
          2, NORMAL, 2,
          position, game);
  }
}

class SpiderChampion extends Monster {
  constructor(position, game) {
    super(70, 4, SPIDER_CHAMPION,
          20, 4, 10,
          2.5, NORMAL, 2,
          position, game);
  }
}
