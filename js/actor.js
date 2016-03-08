"use strict";

class Entity {
  constructor(position, blocking, sprite, game) {
    this.position = position;
    this.blocking = blocking;
    this.sprite = sprite;
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

class Actor extends Entity {
  constructor(health, energy, position, sprite, damageSprite, game) {
    super(position, true, sprite, game);
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
    let healthBar = (this.currentHealth / this.maxHealth) * TILE_SIZE;
    this.game.context.fillRect(this.pos.x * TILE_SIZE, (this.pos.y * TILE_SIZE), healthBar, 1);
    this.game.context.fillStyle = 'blue';
    let energyBar = (this.currentEnergy / this.maxEnergy) * TILE_SIZE;
    this.game.context.fillRect(this.pos.x * TILE_SIZE, (this.pos.y * TILE_SIZE) + 2, energyBar, 1);
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
