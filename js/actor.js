"use strict";

class Entity {
  constructor(position, blocking, sprite, kind, game) {
    this.position = position;
    this.blocking = blocking;
    this.sprite = sprite;
    this.kind = kind;
    this.game = game;
    this.game.map.placeEntity(this.position, this);
    console.log("place entity at:", position);
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

class Chest extends Entity {
  constructor(position, game) {
    super(position, true, chestSprites[0], OBJECT, game);
  }
  pickTreasure() {
    // treasure, there are 4 types
    type = Math.random();
    if (type < 0.5) {

    } else if (type < 0.75) {

    } else if (type < 0.88) {

    } else {

    }
  }
  pickPotion() {
    // potion, there are 8 types.
    type = Math.random();
    if (type < 0.25) {
      return potions[BASIC_HEALTH_POTION];
    } else if (type < 0.5) {
      return potions[ENERGY_POTION];
    } else if (type < 0.65) {
      return potions[DEFENSE_POTION];
    } else if (type < 0.8) {
      return potions[BIG_HEALTH_POTION];
    } else if (type < 0.85) {
      return potions[AGILITY_POTION];
    } else if (type < 0.9) {
      return potions[STRENGTH_POTION];
    } else if (type < 0.95) {
      return potions[WISDOM_POTION];
    } else {
      return potions[INVINCIBILITY_POTION];
    }
  }
  pickEquipment() {
    // equipment, there are 10 types including spells and jewelry.
    type = Math.random();
    if (type < 0.1) {

    } else if (type < 0.2) {

    } else if (type < 0.3) {

    } else if (type < 0.4) {

    } else if (type < 0.5) {

    } else if (type < 0.6) {

    } else if (type < 0.7) {

    } else if (type < 0.8) {

    } else if (type < 0.9) {

    } else {

    }
  }
  interact(actor) {
    this.sprite = chestSprites[1];
    // randomly choose contained item, its normally going to be a potion or
    // treasure and for weapons and armour it is more likely to be a lesser
    // item rather than the best of its class.
    let type = Math.random();
    let item = null;
    if (type < 0.4) {
      item = this.pickTreasure();
    } else if (type < 0.8) {
      item = this.pickPotion();
    } else {
      item = this.pickEquipment();
    }
  }
}

class Actor extends Entity {
  constructor(health, energy, position, sprite, damageSprite, kind, game) {
    super(position, true, sprite, kind, game);
    this.damageSprite = damageSprite;
    this.currentSprite = this.sprite;
    this.currentHealth = health;
    this.maxHealth = health;
    this.currentEnergy = energy;
    this.maxEnergy = energy;
    this.meleeAttackRange = 3;
    this.level = 1;

    this.walk = new WalkAction(this);
    this.rest = new RestAction(this);
    this.attack = new Attack(this);
    this.findTarget = new FindTarget(this);
    this.meleeAttack = new MeleeAttack(this);
    this.nextAction = null;
    this.destination = null;
    this.currentPath = [];
    this.rangeAttack = null;
  }
  get action() {
    //this.currentSprite = this.sprite;
    //return this.nextAction;
  }
  render() {
    this.currentSprite.render(this.pos.x * TILE_SIZE, this.pos.y * TILE_SIZE, this.game.context);
    this.game.context.fillStyle = 'red';
    let healthBar = (this.currentHealth / this.maxHealth) * TILE_SIZE * UPSCALE_FACTOR;
    this.game.context.fillRect(this.pos.x * TILE_SIZE * UPSCALE_FACTOR,
                               this.pos.y * TILE_SIZE * UPSCALE_FACTOR,
                               healthBar, 1 * UPSCALE_FACTOR);
    this.game.context.fillStyle = 'blue';
    let energyBar = (this.currentEnergy / this.maxEnergy) * TILE_SIZE * UPSCALE_FACTOR;
    this.game.context.fillRect(this.pos.x * TILE_SIZE * UPSCALE_FACTOR,
                               this.pos.y * TILE_SIZE * UPSCALE_FACTOR + 2,
                               energyBar, 1 * UPSCALE_FACTOR);
  }
  get path() {
    return this.currentPath;
  }
  incrementEnergy() {
    if (this.currentEnergy < this.maxEnergy) {
      this.currentEnergy = this.currentEnergy + 1;
    } else if (this.nextAction == this.rest) {
      this.nextAction = null;
    }
  }
  useEnergy(required) {
    this.currentEnergy = this.currentEnergy - required;
  }
  set energy(energy) {
    this.currentEnergy = energy;
  }
  increaseExp(xp) {
    this.exp += xp;
  }
  get health() {
    return this.currentHealth;
  }
  get meleeRange() {
    return this.meleeAttackRange;
  }
  get nextStep() {
    return this.currentPath[0];
  }
  shiftNextStep() {
    this.currentPath.shift();
  }
  setDestination(x, y) {
    let target = this.game.map.getEntity(x, y);
    if (target) {
      if (target.kind != this.kind) {
        this.attack.target = target;
        this.nextAction = this.attack;
        return;
      }
    } else if (!this.game.map.isBlocked(x, y)) {
      this.walk.dest = this.game.map.getLocation(x, y).vec;
      this.nextAction = this.walk;
    }
  }
  setRest() {
    this.nextAction = this.rest;
  }
  setAttack(target) {
    this.attack.target = target;
    this.nextAction = this.attack;
  }
}
