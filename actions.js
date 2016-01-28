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
    this.actor.energy(this.actor.energy + 1);
  }
}

class WalkAction extends Action {
  constructor(actor, dir) {
    super(actor);
    this.direction = dir;
  }
  set direction(dir) {
    this.direction = dir;
  }
  get direction() {
    return this.direction;
  }
  perform() {
    let map = this.actor.game.map;
    let pos = this.actor.pos;
    switch(this.direction) {
      case UP:
        if (!map.isBlocked(pos.x, pos.y-1)) {
          map.removeEntity(pos.x, pos.y);
          this.actor.pos.y -= 1;
          map.placeEntity(pos.x, pos.y-1, this.actor);
        }
      break;
      case DOWN:
        if (!map.isBlocked(pos.x, pos.y+1)) {
          map.removeEntity(pos.x, pos.y);
          this.actor.pos.y += 1;
          map.placeEntity(pos.x, pos.y+1, this.actor);
        }
      break;
      case LEFT:
        if (!map.isBlocked(pos.x-1, pos.y)) {
          map.removeEntity(pos.x, pos.y);
          this.actor.pos.x -= 1;
          map.placeEntity(pos.x-1, pos.y, this.actor);
        }
      break;
      case RIGHT:
        if (!map.isBlocked(pos.x+1, pos.y)) {
          map.removeEntity(pos.x, pos.y);
          this.actor.pos.x += 1;
          map.placeEntity(pos.x+1, pos.y, this.actor);
        }
      break;
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
