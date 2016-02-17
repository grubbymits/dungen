"use strict";

class Hero extends Actor {
  constructor(health, energy, position, sprite, game) {
    super(health, energy, position, sprite, game);
    this.equipArmour = basicArmour;
    this.equipHelmet = basicHelmet;
    this.equipWeapon = basicSword;
    this.equipShield = basicShield;
    this.equipArrows = null;
    this.kind = HERO;
    console.log("HERO:", this.meleeWeapon);
  }
  
  get armour() {
    return this.equipArmour;
  }
  
  get helmet() {
    return this.equipHelmet;
  }
  
  get shield() {
    return this.equipShield;
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
  get physicalDefense() {
    return this.equipArmour.defense + this.equipHelmet.defense;
  }
}
