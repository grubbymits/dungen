"use strict";

class Action {
  constructor(actor) {
    this.actor = actor;
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
    console.log("rest");
    this.actor.incrementEnergy();
  }
}

class WalkAction extends Action {
  constructor(actor) {
    super(actor);
  }
  set dest(goal) {
    this.destination = goal;
  }
  perform() {
    let map = this.actor.game.map;
    let pos = this.actor.pos;
    let next = this.actor.nextStep;

    if (pos.x == next.x && pos.y == next.y) {
      console.log("first step is current pos!");
    }

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

    this.actor.shiftNextStep();
    map.removeEntity(pos);
    map.placeEntity(next, this.actor);
    this.actor.pos = next;
    this.actor.useEnergy(energyRequired);
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
    console.log("dealing melee damage");
    let power = this.actor.meleeAtkPower;
    let type = this.actor.meleeAtkType;
    let defense = this.targetActor.physicalDefense;
    let elemDefense = 1; //this.targetActor.elementalDefense(type);
    this.targetActor.reduceHealth((power - defense) * elemDefense);

    if (this.targetActor.health <= 0) {
      return new KillActor(this.actor, this.targetActor);
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
      console.log("not enough energy to perform MeleeAttack");
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

  perform() {
    let targetDistance =  this.map.getDistance(this.actor, this.targetActor);
    // if target is in range, we can return an attack action,
    // otherwise we should return a walkaction to get closer.
    if (this.actor.meleeRange >= targetDistance) {
      this.actor.meleeAttack.target = this.targetActor;
      console.log("returning melee attack");
      return this.actor.meleeAttack;
    } else if (this.actor.projectileRange >= targetDistance) {
      this.actor.rangeAttack.target = this.targetActor;
      console.log("returning range attack");
      return this.actor.rangeAttack;
    } else {
      this.actor.setDestination(this.targetActor.pos.x, this.targetActor.pos.y);
      console.log("returning walk");
      return this.actor.walk;
    }
  }
}

class FindTarget extends Action {
  constructor(actor) {
    super(actor);
    this.range = actor.range;
    this.map = this.actor.game.map;
  }

  perform() {
    console.log("performing find target");
    let radius = 0;
    let pos = this.actor.pos;

    while (radius < this.range) {
      radius = radius + 1;
      for (let x = pos.x - radius; x < pos.x + radius; x++) {
        let y = pos.y - radius;
        let target = this.map.getEntity(x, y);
        if (target) {
          this.actor.attack.target = target;
          this.actor.nextAction = this.actor.attack;
          return this.actor.nextAction;
        }
      }
      for (let x = pos.x - radius; x < pos.x + radius; x++) {
        let y = pos.y + radius;
        let target = this.map.getEntity(x, y);
        if (target) {
          this.actor.attack.target = target;
          this.actor.nextAction = this.actor.attack;
          return this.actor.nextAction;
        }
      }
      for (let y = pos.y - radius; y < pos.y + radius; y++) {
        let x = pos.x - radius;
        let target = this.map.getEntity(x, y);
        if (target) {
          this.actor.attack.target = target;
          this.actor.nextAction = this.actor.attack;
          return this.actor.nextAction;
        }
      }
      for (let y = pos.y - radius; y < pos.y + radius; y++) {
        let x = pos.x + radius;
        let target = this.map.getEntity(x, y);
        if (target) {
          this.actor.attack.target = target;
          this.actor.nextAction = this.actor.attack;
          return this.actor.nextAction;
        }
      }
    }
    return null;
  }
}

class Spell {
  constructor(type, range, radius, mana) {
    this.type = type;
    this.range = range;
    this.radius = radius;
    this.mana = mana;
  }
}

class CastSpell extends Action {
  constructor(actor) {
    super(actor);
  }
}

class CastRangedSpell extends Action {

}

class RadialSpell extends Action {

}
