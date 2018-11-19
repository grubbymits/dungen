"use strict";

class Action {
  constructor(actor, engine) {
    this.actor = actor;
    this.game = this.actor.game;
    this.engine = engine;
  }
  perform() {
    return null;
  }
}

class RestAction extends Action {
  constructor(actor, engine) {
    super(actor, engine);
  }
  perform() {
    let amount = this.actor.incrementEnergy();
    this.engine.addEvent(new OneEntityChange(this.actor, REST_EVENT, amount));
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
    this.game.addAnimationEvent(this.actor, pos, next);
    //this.actor.pos = next;
    this.actor.useEnergy(energyRequired);
    if (this.currentPath.length === 0 && this.actor.nextAction == this) {
      this.actor.nextAction = null;
    }
  }

}

class AttackBase extends Action {
  constructor(actor, engine) {
    super(actor, engine);
  }

  dealDamage(power) {

    if (this.type  === NORMAL) {
      console.log("deal normal damage");
      let defense = this.targetActor.physicalDefense;
      let damage = Math.round(power * MAX_DEFENSE / defense);
      var effect = DamageHP(this.actor, this.targetActor, 1, damage,
                            PHYSICAL_EVENT);
      this.engine.addEffect(this.actor, this.targetActor, effect);
      return;
    }

    let magicDamage = Math.round(power * MAX_MAGIC_DEFENSE / defense);
    if (magicDamage !== magicDamage)
      throw("magicDamage not calculated correctly");

    let magicResistance = this.targetActor.magicResistance;
    if (magicResistance !== magicResistance)
      throw("magicResistance not calculated correctly");

    var duration = Math.round(this.magicPower * MAX_MAGIC_RESISTANCE /
                              magicResistance);
    if (duration !== duration) {
      throw("duration not calculated correctly:", duration);
    }

    console.log("deal magic damage");
    switch(elemType) {
      default:
        throw("unhandled element type");
      case FIRE:
      case POISON:
        let eventType = elemType == FIRE ? FIRE_EVENT : POISON_EVENT;
        this.engine.addEffect(this.actor, this.targetActor,
                              HPDamage(this.targetActor, duration, this.strength,
                              eventType));
        break;
      case ICE:
        this.engine.addEffect(this.actor, this.targetActor,
                              APDamage(this.targetActor, duration, this.strength,
                                       ICE_EVENT));
        break;
      case ELECTRIC:
        this.engine.addEffect(this.actor, this.targetActor,
                              DamageHPAP(this.targetActor, duration, this.strength,
                              ELECTRIC_EVENT));
        break;
    }
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
  constructor(actor, engine) {
    super(actor, engine);
  }
  
  get range() {
    return this.actor.primaryAtkRange;
  }
  
  get power() {
    return this.actor.primaryAtkPower;
  }

  get magicPower() {
    return this.actor.primaryAtkMagicPower;
  }

  get name() {
    if (this.actor.primary) {
      return this.actor.primary.name;
    }
  }

  get type() {
    return this.actor.primaryAtkType;
  }

  perform() {
    if (this.targetActor.currentHealth < 1) {
      this.targetActor = null;
      return;
    }
    let cost = this.actor.pos.getCost(this.targetActor.pos);
    let energyRequired = Math.round(this.actor.primaryAtkEnergy * cost);

    if (this.actor.currentEnergy < energyRequired) {
      return this.actor.rest;
    }
    if (this.targetActor.health < 1) {
      this.actor.nextAction = null;
      this.targetActor = null;
      return null;
    }

    this.actor.useEnergy(energyRequired);
    this.engine.addEvent(new ItemUse(this.actor, this.actor.primary,
                                     PRIMARY_ATTACK_EVENT));

    if (!this.success) {
      this.engine.addEvent(new OneEntityChange(this.targetActor, DODGE_EVENT, 0));
      this.game.audio.dodge();
      return null;
    }

    this.game.audio.playAttack(this.actor);
    return this.dealDamage(this.power);
  }
}

class SecondaryAttack extends AttackBase {
  constructor(actor, engine) {
    super(actor, engine);
  }
  
  get range() {
    return this.actor.secondaryAtkRange;
  }
  
  get power() {
    return this.actor.secondaryAtkPower;
  }

  get magicPower() {
    return this.actor.secondaryAtkMagicPower;
  }

  get name() {
    if (this.actor.secondary) {
      return this.actor.secondary.name;
    }
  }

  get type() {
    return this.actor.secondaryAtkType;
  }

  perform() {
    let cost = this.actor.pos.getCost(this.targetActor.pos);
    let energyRequired = Math.round(this.actor.secondaryAtkEnergy * cost);
    if (this.actor.currentEnergy < energyRequired) {
      return this.actor.rest;
    }
    if (this.targetActor.health < 1) {
      this.actor.nextAction = null;
      this.targetActor = null;
      return null;
    }

    this.actor.useEnergy(energyRequired);
    this.engine.addEvent(new ItemUse(this.actor, this.actor.secondary,
                         SECONDARY_ATTACK_EVENT));

    if (!this.success) {
      this.engine.addEvent(new OneEntityChange(this.targetActor, DODGE_EVENT, 0));
      this.game.audio.dodge();
      return null;
    }

    this.game.audio.playAttack(this.actor);
    return this.dealDamage(this.power);
  }
}

class InitAttack extends Action {
  constructor(actor, engine) {
    super(actor, engine);
    this.map = this.actor.game.map;
  }

  set target(target) {
    if (target === null) {
      console.log("trying to target null...");
      return;
    }
    if (target.health < 1) {
      this.targetActor = null;
      return;
    }
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
      this.targetActor = null;
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
    if (targetDistance < 3) {
      console.log("target to interact:", this.targetObject);
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
    this.calcVisibility.perform();
    this.prevPos = pos;
    
    for (let target of this.targetGroup) {
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
  constructor(actor, engine) {
    super(actor, engine);
  }

  set potion(potion) {
    this.thePotion = potion;
    this.effect = potion.effect;
  }

  perform() {
    this.engine.addEffect(this.actor, this.effect);
    this.engine.addEvent(new ItemUse(this.actor, this.thePotion, POTION_EVENT));
    this.actor.nextAction = null;
  }
}

class CastSpell extends Action {
  constructor(actor, engine) {
    super(actor, engine);
  }

  set spell(spell) {
    this.magic = spell;
  }

  set target(target) {
    this.targetActor = target;
  }

  perform() {
    if (this.actor.currentEnergy >= this.magic.energy) {
      switch(this.magic.elem) {
        default:
          throw("unhandled element");
        case HEALTH:
          var effect = HealHP(this.targetActor, this.magic.strength,
                              this.magic.duration);
          break;
      }
      this.engine.addEffect(this.targetActor, effect);
      this.engine.addEvent(new ItemUse(this.actor, this.magic, SPELL_EVENT));
      this.actor.reduceEnergy(this.magic.energy);
      this.actor.nextAction = null;
    }
  }
}

