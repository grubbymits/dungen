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
    this.actor.currentEnergy++;
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
    
    var energyRequired = 0;
    if (pos.x == next.x) {
      energyRequired = 2;
    } else if (pos.y == next.y) {
      energyRequired = 2;
    } else {
      energyRequired = 3;
    }
    console.log("energy required = ", energyRequired);
    
    // May not be able to perform the action, so rest and allow the next actor
    // to take their turn.
    if (this.actor.currentEnergy < energyRequired) {
      return this.rest;
    }
    
    this.actor.shiftNextStep();
    map.removeEntity(pos);
    map.placeEntity(next);
    this.actor.pos = next;
    this.actor.currentEnergy -= energyRequired;
    console.log("currentEnergy = ", this.actor.currentEnergy);
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
    let power = this.actor.meleeAttack.power;
    let type = this.actor.meleeAttack.type;
    let defense = this.target.physicalDefense;
    let elemDefense = this.target.elementalDefense(type);
    this.target.health((power - defense) * elemDefense);
    
    if (this.target.health <= 0) {
      return new KillActor(this.actor, this.target);
    }
  }
  set target(target) {
    this.target = target;
  }
}

class MeleeAttack extends Action {
  constructor(actor) {
    super(actor);
    this.direction = direction;
    let power = actor.equippedMeleeWeapon.attackPower;
    let type = actor.equippedMeleeWeapon.type;
    this.dealDamage = new DealDamage(actor, power, type);
  }
  
  set target(target) {
    this.target = target;
  }

  perform() {
    if (target.dodges) {
      return null;
    } else {
      //this.dealDamage.target(target);
      return this.dealDamage;
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
    let radius = 0;
    let pos = this.actor.pos;
    
    while (radius < this.range) {
      radius = radius + 1;
      for (let x = pos.x - radius; x < pos.x + radius; x++) {
        let y = pos.y - radius;
        let target = this.map.getEntity(x, y);
        if (target === null) {
          continue;
        } else {
          // if target is in range, we can return an attack action,
          // otherwise we should return a walkaction to get closer.
        }
      }
      for (let x = pos.x - radius; x < pos.x + radius; x++) {
        let y = pos.y + radius;
        let target = this.map.findEntity(x, y);
        if (target === null) {
          continue;
        }
      }
      for (let y = pos.y - radius; y < pos.y + radius; y++) {
        let x = pos.x - radius;
        let target = this.map.getEntity(x, y);
        if (target === null) {
          continue;
        }
      }
      for (let y = pos.y - radius; y < pos.y + radius; y++) {
        let x = pos.x + radius;
        let target = this.map.getEntity(x, y);
        if (target === null) {
          continue;
        }
      }
    }
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
