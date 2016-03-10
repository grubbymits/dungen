"use strict";

class Action {
  constructor(actor) {
    this.actor = actor;
    this.game = this.actor.game;
  }
  set bindActor(actor) {
    this.actor = actor;
  }
  perform() {

  }
}

class RestAction extends Action {
  constructor(actor) {
    super(actor);
  }
  perform() {
    this.actor.incrementEnergy();
  }
}

class WalkAction extends Action {
  constructor(actor) {
    super(actor);
    this.destination = this.actor.pos;
    this.currentPath = [];
    this.map = this.actor.game.map;
  }
  set dest(goal) {
    this.destination = goal;
    this.currentPath = this.map.getPath(this.actor.position, this.destination);
  }
  perform() {
    if (this.currentPath.length == 0) {
      return;
    }
    let pos = this.actor.pos;
    let next = this.currentPath[0];

    var energyRequired = 0;
    if (pos.x == next.x) {
      energyRequired = 2;
    } else if (pos.y == next.y) {
      energyRequired = 2;
    } else {
      energyRequired = 3;
    }

    // May not be able to perform the action, so rest and allow the next actor
    // to take their turn.
    if (this.actor.currentEnergy < energyRequired) {
      return this.actor.rest;
    }

    this.currentPath.shift();
    this.map.removeEntity(pos);
    this.map.placeEntity(next, this.actor);
    this.actor.pos = next;
    this.actor.useEnergy(energyRequired);
    if (this.currentPath.length == 0 && this.actor.nextAction == this) {
      this.actor.nextAction = null;
    }
  }

}

// Performing an attack action will return the attack attempt (eg swingweapon)
// Whether it connects depends on the actor and the target.
// DealDamage is the final action which determines how much damage is dealt.
class DealMeleeDamage extends Action {
  constructor(actor) {
    super(actor);
  }
  perform() {
    let power = this.actor.meleeAtkPower;
    let type = this.actor.meleeAtkType;
    let defense = this.targetActor.physicalDefense;
    let elemDefense = 1; //this.targetActor.elementalDefense(type);
    let damage = Math.round(power * (1 / defense)); //* (1 / elemDefense);

    this.targetActor.reduceHealth(this.actor, damage);
    document.getElementById("hitSound").play();

    if (this.targetActor.health <= 0) {
      if (this.actor.increaseExp !== null) {
        console.log("increaseExp by", this.targetActor.exp);
        this.actor.increaseExp(this.targetActor.exp);
      }
      this.game.killActor(this.targetActor);
      this.targetActor = null;
      this.actor.nextAction = null;
    }
  }
  set target(target) {
    this.targetActor = target;
  }
}

class MeleeAttack extends Action {
  constructor(actor) {
    super(actor);
    this.dealDamage = new DealMeleeDamage(actor);
  }

  set target(target) {
    this.targetActor = target;
  }

  perform() {
    //if (target.dodges) {
      //return null;
    //} else {
    let energyRequired = this.actor.meleeAtkEnergy;
    if (this.actor.currentEnergy < energyRequired) {
      return this.actor.rest;
    }
    this.dealDamage.target = this.targetActor;
    this.actor.useEnergy(energyRequired);
    return this.dealDamage;
    //}
  }
}

class Attack extends Action {
  constructor(actor) {
    super(actor);
    this.map = this.actor.game.map;
  }

  set target(target) {
    this.targetActor = target;
  }

  get target() {
    return this.targetActor;
  }

  perform() {
    let targetDistance =  this.map.getDistance(this.actor, this.targetActor);
    // if target is in range, we can return an attack action,
    // otherwise we should return a walkaction to get closer.
    if (this.actor.meleeRange >= targetDistance) {
      this.actor.meleeAttack.target = this.targetActor;
      return this.actor.meleeAttack;
    } else if (this.actor.projectileRange >= targetDistance) {
      this.actor.rangeAttack.target = this.targetActor;
      return this.actor.rangeAttack;
    } else {
      this.actor.walk.dest = this.targetActor.pos;
      return this.actor.walk;
    }
  }
}

class FindTarget extends Action {
  constructor(actor) {
    super(actor);
    this.map = this.actor.game.map;
  }

  perform() {
    let radius = 0;
    let pos = this.actor.pos;
    this.range = this.actor.range;

    while (radius < this.range) {
      radius = radius + 1;
      for (let x = pos.x - radius; x < pos.x + radius; x++) {
        let y = pos.y - radius;
        let target = this.map.getEntity(x, y);
        if (target) {
          if (target.kind != this.actor.kind) {
            this.actor.attack.target = target;
            this.actor.nextAction = this.actor.attack;
            return this.actor.nextAction;
          }
        }
      }
      for (let x = pos.x - radius; x < pos.x + radius; x++) {
        let y = pos.y + radius;
        let target = this.map.getEntity(x, y);
        if (target) {
          if (target.kind != this.actor.kind) {
            this.actor.attack.target = target;
            this.actor.nextAction = this.actor.attack;
            return this.actor.nextAction;
          }
        }
      }
      for (let y = pos.y - radius; y < pos.y + radius; y++) {
        let x = pos.x - radius;
        let target = this.map.getEntity(x, y);
        if (target) {
          if (target.kind != this.actor.kind) {
            this.actor.attack.target = target;
            this.actor.nextAction = this.actor.attack;
            return this.actor.nextAction;
          }
        }
      }
      for (let y = pos.y - radius; y < pos.y + radius; y++) {
        let x = pos.x + radius;
        let target = this.map.getEntity(x, y);
        if (target) {
          if (target.kind != this.actor.kind) {
            this.actor.attack.target = target;
            this.actor.nextAction = this.actor.attack;
            return this.actor.nextAction;
          }
        }
      }
    }
    this.actor.nextAction = null;
    return null;
  }
}

class Interact extends Action {
  constructor(actor) {
    super(actor);
  }
  bindObject(obj) {
    this.obj = obj;
  }
  perform() {
    this.obj.interact(this.actor);
  }
}
