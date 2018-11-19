"use strict";

class Actor extends Entity {
  constructor(health, energy, vision,
              position, sprite, damageSprite, kind, game) {
    super(position, sprite, kind, game);
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
    this.rest = new RestAction(this, game.battleEngine);
    this.attack = new InitAttack(this, game.battleEngine);
    this.findTarget = new FindTarget(this);
    this.primaryAttack = new PrimaryAttack(this, game.battleEngine);
    this.secondaryAttack = null;
    this.interaction = new Interact(this);
    this.nextAction = null;
    this.destination = null;
    this.currentPath = [];
    this.rangeAttack = null;
    this.isStatic = false;
    this.nextUpdate = Date.now();
    this.map = this.game.map;
  }

  get action() {
    // needs to be implemented differently for heros and monsters atm
    return null;
  }

  set lastPerformed(time) {
    // set a maximum game rate
    this.nextUpdate = time + 1000;
  }

  get path() {
    return this.currentPath;
  }

  incrementEnergy() {
    if (this.currentEnergy < this.maxEnergy - 1) {
      this.currentEnergy = this.currentEnergy + 2;
      return 2;
    } else if (this.currentEnergy < this.maxEnergy) {
      this.currentEnergy++;
      return 1;
    } else if (this.nextAction == this.rest) {
      this.nextAction = null;
    }
    return 0;
  }

  useEnergy(required) {
    this.currentEnergy = this.currentEnergy - required;
  }

  set energy(energy) {
    this.currentEnergy = energy;
  }

  reduceEnergy(damage) {
    this.currentEnergy -= damage;
    if (this.currentEnergy < 0) {
      this.currentEnergy = 0;
    }
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
    console.log("setDestination:", vec);
    let target = this.game.map.getEntity(vec);
    if (target) {
      if (target.kind != this.kind && target.kind != OBJECT) {
        console.log("attack!", target);
        this.attack.target = target;
        this.nextAction = this.attack;
        return;
      }
      if (target.isInteractable) {
        console.log("object is interactable");
        this.interaction.target = target;
        this.nextAction = this.interaction;
        return;
      }
      console.log("doing nothing, target:", target);
    } else if (!this.game.map.isBlocked(vec)) {
      console.log("set destination");
      this.walk.dest = vec; //this.game.map.getLocation(x, y).vec;
      this.nextAction = this.walk;
    } else {
      console.log("no target, but map is blocked:",
                  this.game.map.getLocation(vec.x, vec.y));
    }
  }

  //setRest() {
    //this.nextAction = this.rest;
  //}

  //setAttack(target) {
    //this.attack.target = target;
    //this.nextAction = this.attack;
  //}
  //applyEffect(effect) {
    //this.game.addEffect(this, effect);
  //}
}
