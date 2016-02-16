"use strict";

class Hero extends Actor {
  constructor(health, energy, position, sprite, game) {
    super(health, energy, position, sprite, game);
    this.bodyArmour = 0.01;
    this.helmet = 0.01;
    this.kind = HERO;
  }

  get projectileRange() {
    return 0;
  }
  get meleeAtkPower() {
    return 2;
  }
  get meleeAtkEnergy() {
    return 1;
  }
  get meleeAtkType() {
    return NORMAL;
  }
  get physicalDefense() {
    return this.bodyArmour + this.helmet;
  }
}
