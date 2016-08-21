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
    return null;
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
class DealDamage extends Action {
  constructor(actor, attack) {
    super(actor);
    this.attack = attack;
  }
  perform() {
    let power = this.attack.power;
    let type = this.attack.type;
    let defense = this.targetActor.physicalDefense;
    let elemDefense = 1; //this.targetActor.elementalDefense(type);
    let damage = Math.round(power * MAX_DEFENSE / defense);

    this.targetActor.reduceHealth(this.actor, damage);

    if (this.targetActor.health <= 0) {
      if (this.actor.increaseExp !== null) {
        this.game.addTextEvent(this.targetActor.exp + " xp",
                               this.targetActor.pos);
        this.actor.game.player.increaseExp(this.targetActor.exp);
      }
      this.game.audio.die();
      this.game.killActor(this.targetActor);
      this.targetActor = null;
      this.actor.nextAction = null;
    } else {
      this.game.audio.hit();
      this.game.addTextEvent(" -" + damage, this.targetActor.pos);
    }
  }
  set target(target) {
    this.targetActor = target;
  }
}

class AttackBase extends Action {
  constructor(actor) {
    super(actor);
    this.dealDamage = new DealDamage(actor, this);
  }

  set target(target) {
    this.targetActor = target;
  }

  get success() {
    let dodgeChance = Math.random() * this.targetActor.agility;
    let connectChance = Math.random() * this.actor.agility;
    return connectChance > dodgeChance;
  }
}

class PrimaryAttack extends AttackBase {
  constructor(actor) {
    super(actor);
  }
  
  get range() {
    return this.actor.primaryAtkRange;
  }
  
  get power() {
    return this.actor.primaryAtkPower;
  }

  perform() {
    let energyRequired = this.actor.primaryAtkEnergy;
    if (this.actor.currentEnergy < energyRequired) {
      return this.actor.rest;
    }
    if (this.success) {
      this.game.audio.playAttack(this.actor);
      this.dealDamage.target = this.targetActor;
      this.actor.useEnergy(energyRequired);
      return this.dealDamage;
    } else {
      this.actor.useEnergy(energyRequired);
      this.game.addTextEvent("Dodged!", this.targetActor.pos);
      this.game.audio.dodge();
      return null;
    }
  }
}

class SecondaryAttack extends AttackBase {
  constructor(actor) {
    super(actor);
  }
  
  get range() {
    return this.actor.secondaryAtkRange;
  }
  
  get power() {
    return this.actor.secondaryAtkPower;
  }

  perform() {
    let energyRequired = this.actor.secondaryAtkEnergy;
    if (this.actor.currentEnergy < energyRequired) {
      return this.actor.rest;
    }
    if (this.success) {
      this.game.audio.playAttack(this.actor);
      this.dealDamage.target = this.targetActor;
      this.actor.useEnergy(energyRequired);
      return this.dealDamage;
    } else {
      this.actor.useEnergy(energyRequired);
      this.game.addTextEvent("Dodged!", this.targetActor.pos);
      this.game.audio.dodge();
      return null;
    }
  }
}

class InitAttack extends Action {
  constructor(actor) {
    super(actor);
    this.map = this.actor.game.map;
  }

  set target(target) {
    this.game.addGraphicEvent(targetSprite, target.pos);
    this.targetActor = target;
  }

  get target() {
    return this.targetActor;
  }

  perform() {
    let targetDistance =  this.map.getDistance(this.actor, this.targetActor);
    // if target is in range, we can return an attack action,
    // otherwise we should return a walkaction to get closer.
    if (this.actor.primaryAttack.range >= targetDistance) {
      this.actor.primaryAttack.target = this.targetActor;
      return this.actor.primaryAttack;
    } else if (this.actor.secondaryAttack !== null &&
               this.actor.secondaryAttack.range >= targetDistance) {
      this.actor.secondaryAttack.target = this.targetActor;
      return this.actor.secondaryAttack;
    } else {
      this.actor.walk.dest = this.targetActor.pos;
      return this.actor.walk;
    }
  }
}

class Interact extends Action {
  constructor(actor) {
    super(actor);
    this.map = this.actor.game.map;
    this.targetObject = null;
  }
  set target(target) {
    this.game.addGraphicEvent(targetSprite, target.pos);
    this.targetObject = target;
  }
  get target() {
    return this.targetObject;
  }
  perform() {
    if (!this.targetObject.isInteractable) {
      this.actor.nextAction = null;
      return;
    }
    let targetDistance =  this.map.getDistance(this.actor, this.targetObject);
    if (this.actor.primaryAtkRange >= targetDistance) {
      this.targetObject.interact(this.actor);
      return null;
    } else {
      this.actor.walk.dest = this.targetObject.pos;
      return this.actor.walk;
    }
  }
}

class CalcVisibility extends Action {
  constructor(actor) {
    super(actor);
    this.map = this.actor.game.map;
    this.visible = new Set();
    this.shadow = new Set();
    this.range = this.actor.vision;
    this.start = this.actor.pos;
  }
  
  createShadow(startX, startY, range, octant) {
    for (let row = 1; row < range; ++row) {
      for (let col = 0; col <= row; ++col) {
        let vec = getOctantVec(startX, startY, col, row, octant);
        let x = vec.x;
        let y = vec.y;
        if (this.map.isOutOfRange(x, y)) {
          continue;
        }
        let loc = this.map.getLocation(x, y);
        if (this.shadow.has(loc)) {
          continue;
        } else {
          this.shadow.add(loc);
        }
      }
    }
  }
  
  isVisible(target) {
    let targetLoc = this.map.vecToLoc(target.pos);
    for (let visible of this.visible) {
      if (visible == targetLoc) {
        return true;
      }
    }
    return false;
  }
  
  perform() {
    this.shadow.clear();
    this.visible.clear();
    
    for (let octant = 0; octant < 8; ++octant) {
      for (let row = 1; row < this.range; ++row) {
        for (let col = 0; col <= row; ++col) {
          let vec = getOctantVec(this.start.x, this.start.y, col, row, octant);
          let x = vec.x;
          let y = vec.y;
          if (this.map.isOutOfRange(x, y)) {
            continue;
          }
          let loc = this.map.getLocation(x, y);
          if (this.shadow.has(loc)) {
            continue;
          } else if (loc.isWallOrCeiling) {
            this.createShadow(x, y, this.range - row, octant);
          } else {
            this.visible.add(loc);
          }
        }
      }
    }
  }
}

class FindTarget extends Action {
  constructor(actor) {
    super(actor);
    this.map = this.actor.game.map;
    this.calcVisibility = new CalcVisibility(actor);
    this.calcVisibility.perform();
    this.prevPos = this.actor.pos;
  }
  
  set targets(targets) {
    this.targetGroup = targets;
  }
  
  perform() {
    let pos = this.actor.pos;
    this.range = this.actor.vision;
    let visibleTargets = [];
    
    if (pos.x != this.prevPos.x || pos.y != this.prevPos.y) {
      this.calcVisibility.perform();
      this.prevPos = pos;
    }
    
    for (let target of this.targetGroup) {
      //if (target.pos.getCost(this.actor.pos) > this.range) {
        //continue;
      //}
      if (this.calcVisibility.isVisible(target)) {
        visibleTargets.push(target);
      }
    }
    
    if (visibleTargets.length !== 0) {
      let finalTarget = visibleTargets[0];
      let smallestCost = finalTarget.pos.getCost(this.actor.pos);
      
      for (let target of visibleTargets) {
        let cost = target.pos.getCost(this.actor.pos);
        if (cost < smallestCost) {
          smallestCost = cost;
          finalTarget = target;
        }
      }
      this.actor.attack.target = finalTarget;
      this.actor.nextAction = this.actor.attack;
      return this.actor.nextAction;
    }
    this.actor.nextAction = null;
    return null;
  }
}

class TakePotion extends Action {
  constructor(actor) {
    super(actor);
  }
  set potion(potion) {
    this.effect = potion.effect;
  }
  perform() {
    this.game.addEffect(this.actor, this.effect);
    this.actor.nextAction = null;
  }
}
