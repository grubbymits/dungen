"use strict";

class Hero extends Actor {
  constructor(health, energy, position, sprite, damageSprite, game) {
    super(health, energy, position, sprite, damageSprite, game);
    this.equipWeapon = null;
    this.equipArmour = null;
    this.equipShield = null;
    this.equipArrows = null;

    this.kind = HERO;
    this.isFollowing = false;
    this.leader = null;
    this.nextAction = null;
    this.lvl = 1;
    this.currentExp = 0;
    this.expToNextLvl = 2;
  }
  get armour() {
    return this.equipArmour;
  }
  get arrows() {
    return this.equipArrows;
  }
  get weapon() {
    return this.equipWeapon;
  }
  get shield() {
    return this.equipShield;
  }
  get helmet() {
    return this.equipHelmet;
  }
  get ring() {
    return this.equipRing;
  }
  get projectileRange() {
    return 0;
  }
  get meleeAtkPower() {
    return this.equipWeapon.power;
  }
  get meleeAtkEnergy() {
    return this.equipWeapon.energy;
  }
  get meleeAtkType() {
    return this.equipWeapon.type;
  }
  get range() {
    return this.equipWeapon.range;
  }
  get physicalDefense() {
    var total = 0;
    if (this.equipArmour) {
      total += this.equipArmour.defense;
    }
    if (this.equipHelmet) {
      total += this.equipHelmet.defense;
    }
    return total;
  }
  get action() {
    this.currentSprite = this.sprite;
    if (this.isFollowing) {
      if (this.leader.nextAction == this.leader.attack) {
        this.attack.target = this.leader.attack.target;
        this.nextAction = this.attack;
      } else if (this.position.getCost(this.leader.position) > 3) {
        this.walk.dest = this.leader.position;
        this.nextAction = this.walk;
      } else {
        this.nextAction = this.findTarget;
      }
    }
    return this.nextAction;
  }
  reduceHealth(enemy, damage) {
    this.currentHealth -= damage;
    this.game.map.setDirty(this.position);
    this.currentSprite = this.damageSprite;
    if (this.isFollowing) {
      this.setAttack(enemy);
      this.nextAction = this.attack;
    }
  }
  increaseExp(exp) {
    this.currentExp += exp;
    if (this.currentExp >= this.expToNextLvl) {
      this.lvl++;
      this.expToNextLvl *= 1.5;
    }
  }

  follow(leader) {
    this.leader = leader;
    this.isFollowing = true;
    this.walk.dest = this.leader.position;
    this.nextAction = this.walk;
  }
}

class Knight extends Hero {
  constructor(health, energy, position, game) {
    super(health, energy, position, knightSprite, damageKnightSprite, game);
    this.equipArmour = basicArmour;
    this.equipHelmet = basicHelmet;
    this.equipWeapon = basicSword;
    this.equipShield = basicShield;
  }
}

class Mage extends Hero {
  constructor(health, energy, position, game) {
    super(health, energy, position, wizardSprite, damageMageSprite, game);
    console.log("creating mage");
    this.equipArmour = basicArmour;
    this.equipWeapon = basicStaff;
    this.equipCrystalBall = crystalBall;
    //this.equipRing = basicRing;
  }
  get magicBall() {
    return this.equipCrystalBall;
  }
}

class Player {
  constructor(hero) {
    this.currentHero = hero;
    this.heroes = [hero];
  }
  addHero(hero) {
    this.heroes.push(hero);
  }
  setDestination(x, y) {
    this.currentHero.setDestination(x, y);
  }
  setRest() {
    for (let hero of this.heroes) {
      hero.setRest();
    }
  }
}
