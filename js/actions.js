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
    if (this.actor.kind == HERO && this.actor.isFollowing) {
      let target = this.map.getEntity(goal);
      if (target && target.kind == HERO) {
        let neighbours = this.map.getNeighbours(goal);
        let minCost = 0;
        for (let i in neighbours) {
          let neighbour = neighbours[i];
          let cost = this.actor.pos.getCost(neighbour);
          if (cost < minCost) {
            minCost = cost;
            goal = neighbour;
          }
        }
      }
    }
    this.destination = goal;
    this.currentPath = this.map.getPath(this.actor.pos, this.destination);
    if (this.actor.kind == HERO) {
      this.game.addPathEvent(this.currentPath);
    }
  }

  perform() {

    if (this.currentPath.length === 0) {
      return;
    }

    let pos = this.actor.pos;
    let next = this.currentPath[0];
   
    // Entities move around, so path may need to be recalculated.
    if (this.map.isBlocked(next)) {
      this.currentPath = this.map.getPath(pos, this.destination);
      
      if (this.currentPath.length === 0) {
        if (this.actor.nextAction == this) {
          this.actor.nextAction = null;
        }
        return;
      } else {
        next = this.currentPath[0];
      }
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
    if (this.actor.currentEnergy < energyRequired || this.map.isBlocked(next)) {
      return this.actor.rest;
    }

    this.currentPath.shift();
    this.map.removeEntity(pos);
    this.map.placeEntity(next, this.actor);
    this.actor.pos = next;
    this.actor.useEnergy(energyRequired);
    if (this.currentPath.length === 0 && this.actor.nextAction == this) {
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
        this.actor.game.player.increaseExp(this.targetActor.exp);
      }
      this.game.audio.die();
      this.game.entitiesToRemove.push(this.targetActor);
      this.targetActor = null;
      this.actor.nextAction = null;
    } else {
      this.game.audio.hit();
      let text = this.actor.name + " deals " + damage + " to " + this.targetActor.name;
      if (this.actor.kind == HERO) {
        text += " with " + this.attack.name;
      }
      this.game.addTextEvent(text);
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
    // Weight it in favour of actually connecting.
    let connectChance = 3 * Math.random() * this.actor.agility;
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

  get name() {
    if (this.actor.primary) {
      return this.actor.primary.name;
    }
  }

  perform() {
    let energyRequired = this.actor.primaryAtkEnergy;
    if (this.actor.currentEnergy < energyRequired) {
      return this.actor.rest;
    }
    if (this.targetActor.health < 1) {
      this.actor.nextAction = null;
      return null;
    }

    if (this.actor.kind == HERO) {
      this.game.addGraphicEvent(this.actor.primary.sprite,
                                new Vec(this.actor.pos.x, this.actor.pos.y - 1));
    }

    if (this.success) {
      this.game.audio.playAttack(this.actor);
      this.dealDamage.target = this.targetActor;
      this.actor.useEnergy(energyRequired);
      return this.dealDamage;
    } else {
      this.actor.useEnergy(energyRequired);
      let text = this.targetActor.name + " dodged attack from " + this.actor.name;
      this.game.addTextEvent(text);
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

  get name() {
    if (this.actor.secondary) {
      return this.actor.secondary.name;
    }
  }

  perform() {
    let energyRequired = this.actor.secondaryAtkEnergy;
    if (this.actor.currentEnergy < energyRequired) {
      return this.actor.rest;
    }
    if (this.targetActor.health < 1) {
      this.actor.nextAction = null;
      return null;
    }

    if (this.actor.kind == HERO) {
      this.game.addGraphicEvent(this.actor.secondary.sprite,
                                new Vec(this.actor.pos.x, this.actor.pos.y - 1));
    }

    if (this.success) {
      this.game.audio.playAttack(this.actor);
      this.dealDamage.target = this.targetActor;
      this.actor.useEnergy(energyRequired);
      return this.dealDamage;
    } else {
      this.actor.useEnergy(energyRequired);
      let text = this.targetActor.name + " dodged attack from " + this.actor.name;
      this.game.addTextEvent(text);
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
    if (target.health < 1) {
      this.targetActor = null;
      return;
    }
    this.game.addGraphicEvent(targetSprite, target.pos);
    this.targetActor = target;
  }

  get target() {
    return this.targetActor;
  }

  perform() {
    if (this.targetActor === null) {
      this.actor.nextAction = null;
      return null;
    }
    if (this.targetActor.health < 1) {
      this.actor.nextAction = null;
      return null;
    }

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
      this.actor.nextAction = null;
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
    return this.visible.has(targetLoc);
  }
  
  perform() {
    this.shadow.clear();
    this.visible.clear();
    this.start = this.actor.pos;
    
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
    
    //if (pos.x != this.prevPos.x || pos.y != this.prevPos.y) {
      this.calcVisibility.perform();
      this.prevPos = pos;
    //}
    
    for (let target of this.targetGroup) {
      //if (target.pos.getCost(this.actor.pos) > this.range) {
        //continue;
      //}
      if (this.calcVisibility.isVisible(target)) {
        visibleTargets.push(target);
      }
    }
    
    if (visibleTargets.length !== 0) {
      console.log("visible targets!", visibleTargets);
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
    this.thePotion = potion;
    this.effect = potion.effect;
  }
  perform() {
    this.game.addEffect(this.actor, this.effect);
    this.game.addGraphicEvent(this.thePotion.sprite,
                              new Vec(this.actor.pos.x, this.actor.pos.y - 1));
    this.actor.nextAction = null;
  }
}
