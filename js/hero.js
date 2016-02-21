"use strict";

class Hero extends Actor {
  constructor(health, energy, position, sprite, game) {
    super(health, energy, position, sprite, game);
    this.equipArrows = null;
    this.kind = HERO;
    this.isFollowing = false;
    this.leader = null;
    this.nextAction = null;
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
  get meleeRange() {
    return this.equipWeapon.range;
  }
  get action() {
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

  follow(leader) {
    this.leader = leader;
    this.isFollowing = true;
    this.walk.dest = this.leader.position;
    this.nextAction = this.walk;
  }
}

class Knight extends Hero {
  constructor(health, energy, position, game) {
    super(health, energy, position, knightSprite, game);
    this.equipArmour = basicArmour;
    this.equipHelmet = basicHelmet;
    this.equipWeapon = basicSword;
    this.equipShield = basicShield;
  }
  get helmet() {
    return this.equipHelmet;
  }
  get shield() {
    return this.equipShield;
  }
  get physicalDefense() {
    return this.equipArmour.defense + this.equipHelmet.defense;
  }
}

class Wizard extends Hero {
  constructor(health, energy, position, game) {
    super(health, energy, position, wizardSprite, game);
    this.equipArmour = basicArmour;
    this.equipWeapon = basicStaff;
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
