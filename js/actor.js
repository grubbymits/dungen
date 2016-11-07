"use strict";

class Actor extends Entity {
  constructor(health, energy, vision,
              position, sprite, damageSprite, kind, game) {
    super(position, true, sprite, kind, game);
    this.damageSprite = damageSprite;
    this.currentSprite = this.sprite;
    this.currentHealth = health;
    this.maxHealth = health;
    this.currentEnergy = energy;
    this.maxEnergy = energy;
    //this.meleeAttackRange = 3;
    this.level = 1;
    this.id = 0;
    this.vision = vision;

    this.walk = new WalkAction(this);
    this.rest = new RestAction(this);
    this.attack = new InitAttack(this);
    this.findTarget = new FindTarget(this);
    this.primaryAttack = new PrimaryAttack(this);
    this.secondaryAttack = null;
    this.interact = new Interact(this);
    this.nextAction = null;
    this.destination = null;
    this.currentPath = [];
    this.rangeAttack = null;
  }
  get action() {
    // needs to be implemented differently for heros and monsters atm
    return null;
  }
  render() {
    this.currentSprite.render(this.pos.x * TILE_SIZE,
                              this.pos.y * TILE_SIZE,
                              this.game.overlayContext);
  }
  get path() {
    return this.currentPath;
  }
  incrementEnergy() {
    if (this.currentEnergy < this.maxEnergy - 1) {
      this.currentEnergy = this.currentEnergy + 2;
    } else if (this.currentEnergy < this.maxEnergy) {
      this.currentEnergy++;
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
  get health() {
    return this.currentHealth;
  }
  get nextStep() {
    return this.currentPath[0];
  }

  shiftNextStep() {
    this.currentPath.shift();
  }

  setDestination(vec) {
    let target = this.game.map.getEntity(vec);
    if (target) {
      if (target.kind == OBJECT) {
        if (target.isInteractable) {
          this.interact.target = target;
          this.nextAction = this.interact;
          return;
        }
      } else if (target.kind != this.kind) {
        this.attack.target = target;
        this.nextAction = this.attack;
        return;
      }
    } else if (!this.game.map.isBlocked(vec)) {
      this.walk.dest = vec; //this.game.map.getLocation(x, y).vec;
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
  applyEffect(effect) {
    this.game.addEffect(this, effect);
  }
}
