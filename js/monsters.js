"use strict";

class Monster extends Actor {
  constructor(health, energy,
              index,
              defense, vision, agility,
              xp,
              atkPower, atkType, atkEnergy,
              position, game) {
    super(health, energy, vision, position,
          monsterSprites[index], monsterDamageSprites[index],
          MONSTER, game);
    this.level = this.game.level;
    this.index = index;
    this.exp = xp * this.level;
    this.attackPower = atkPower;
    this.attackType = atkType;
    this.attackEnergy = atkEnergy;
    this.physicalDefense = defense;
    this.agility = agility;
    this.findTarget.targets = this.game.heroes;
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
  get primaryAtkPower() {
    return this.attackPower; //+ (this.level * this.meleeAttackPower * 0.05);
  }
  get primaryAtkEnergy() {
    return this.attackEnergy;
  }
  get primaryAtkType() {
    return this.attackType;
  }
  get primaryAtkRange() {
    return 3;
  }
  get secondaryAtkRange() {
    return 0;
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
  render() {
    super.render();
    this.game.context.fillStyle = 'orangered';
    let healthBar = (this.currentHealth / this.maxHealth) * TILE_SIZE * UPSCALE_FACTOR;
    this.game.context.fillRect(this.pos.x * TILE_SIZE * UPSCALE_FACTOR,
                               this.pos.y * TILE_SIZE * UPSCALE_FACTOR,
                               healthBar, 2 * UPSCALE_FACTOR);
  }
}

class Rat extends Monster {
  constructor(position, game) {
    super(38,     // health
          4,      // energy
          RAT,    // kind
          15,     // defense
          4,      // vision
          13,     // agility
          5,      // xp
          1.5,    // attack power
          NORMAL, // attack type
          2,      // attack energy
          position, game);
  }
}

class Rabbit extends Monster {
  constructor(position, game) {
    super(40,     // health
          5,      // energy
          RABBIT,    // kind
          15,     // defense
          4,      // vision
          15,     // agility
          6,      // xp
          1.7,    // attack power
          NORMAL, // attack type
          2,      // attack energy
          position, game);
  }
}

class Spiders extends Monster {
  constructor(position, game) {
    super(44,
          4,
          SPIDERS,
          15,
          4,
          14,
          6,
          1.5,
          NORMAL,
          2,
          position, game);
  }
}

class Bat extends Monster {
  constructor(position, game) {
    super(36,     // health
          5,      // energy
          BAT,    // kind
          10,     // defense
          5,      // vision
          16,     // agility
          7,      // xp
          1.5,    // attack power
          NORMAL, // attack type
          2,      // attack energy
          position, game);
  }
}

class Lizard extends Monster {
  constructor(position, game) {
    super(60,
          5,
          LIZARD,
          18,
          5,
          7,
          8,
          2,
          NORMAL,
          2,
          position, game);
  }
}

class SpiderChampion extends Monster {
  constructor(position, game) {
    super(70,
          4,
          SPIDER_CHAMPION,
          20,
          5,
          10,
          10,
          2.5,
          NORMAL,
          2,
          position, game);
  }
}

class Toad extends Monster {
  constructor(position, game) {
    super(40,     // health
          4,      // energy
          RAT,    // kind
          15,     // defense
          4,      // vision
          13,     // agility
          5,      // xp
          1.5,    // attack power
          NORMAL, // attack type
          2,      // attack energy
          position, game);
  }
}
/*
const TOAD = 4;
const SCARAB = 5;
const CENTIPEDE = 6;
const SERPENT = 7;
const MUSHROOM = 8;
const BAT_CHAMPION = 11;
const SNAKE = 12;
const WOLF = 13;
const WILD_BOAR = 14;
const BEAR = 15;
const SLIMES = 16;
const SLIME_CHAMPION = 17;
const SCORPION = 18;
const KRAKEN = 19;
const VAMPIRE = 20;
const MUMMY = 21;
const WRAITH = 22;
const CARABIA = 23;
const GOBLIN = 24;
const ZOMBIE = 25;
const UNDEAD = 26;
const ORC = 27;
const CYCLOP = 28;
const WEREWOLF = 29;
const GOLEM = 30;
const DEMON = 31;
*/