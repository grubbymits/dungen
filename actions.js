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
    this.actor.modEnergy(1);
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

  }

}

// Performing an attack action will return the attack attempt (eg swingweapon)
// Whether it connects depends on the actor and the target.
// DealDamage is the final action which determines how much damage is dealt.
class DealDamage extends Action {
  constructor(actor, power, type) {
    super(actor);
    this.power = power;
    this.type = type;
  }
  set target(target) {
    this.target = target;
  }

  perform() {

  }
}

class SwingWeapon extends Action {
  constructor(actor) {
    super(actor);
    let power = actor.equippedMeleeWeapon.attackPower;
    let type = actor.equippedMeleeWeapon.type;
    this.dealDamage = new DealDamage(this.actor, power, type);
  }
  set target(target) {
    this.target = target;
  }
  perform() {
    if (target.dodges) {
      return null;
    } else {
      this.dealDamage.target(target);
      return this.dealDamage;
    }
  }
}

class MeleeAttack extends Action {
  constructor(actor, direction) {
    super(actor);
    this.direction = direction;
    this.swingWeapon = new SwingWeapon(this.actor);
  }

  perform() {
    // get target.
    var target = {};
    // try to attack
    this.swingWeapon.target(target);
    return this.swingWeapon;
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
