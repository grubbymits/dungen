"use strict";

class Effect {
  constructor(strength, duration) {
    this.strength = strength;
    this.duration = duration;
  }

  cause(actor) {
    console.error("Effect.apply is not implemented!");
  }
}

class PhysicalDamage extends Effect {
  constructor(strength, actor) {
    super(strength, 1);
    this.inflictor = actor;
  }

  cause(actor) {
    if (actor.currentHealth < 1) {
      return true;
    }
    actor.game.addHPEvent(actor.pos, -this.strength);
    actor.game.audio.hit();
    actor.game.addSpriteChangeEvent(actor, actor.damageSprite);
    actor.reduceHealth(this.inflictor, this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

class HealEffect extends Effect {
  constructor(strength, duration) {
    super(strength, duration);
  }

  cause(actor) {
    actor.game.audio.cure();
    actor.game.addSpriteChangeEvent(actor, actor.healSprite);
    actor.game.addHPEvent(actor.pos, this.strength);
    actor.increaseHealth(this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

class RestoreEnergy extends Effect {
  constructor(strength, duration) {
    super(strength, duration);
  }

  cause(actor) {
    actor.game.audio.cure();
    actor.increaseEnergy(this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

class BurnEffect extends Effect {
  constructor(strength, duration, actor) {
    super(strength, duration);
    this.inflictor = actor;
    console.log(strength + " burn damage for " + duration);
  }

  cause(actor) {
    if (actor.currentHealth < 1) {
      return true;
    }
    actor.game.addHPEvent(actor.pos, -this.strength);
    actor.game.addSpriteChangeEvent(actor, actor.burntSprite);
    actor.reduceHealth(this.inflictor, this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

class PoisonEffect extends Effect {
  constructor(strength, duration, actor) {
    super(strength, duration);
    console.log(strength + " poison damage for " + duration);
    this.inflictor = actor;
  }

  cause(actor) {
    if (actor.currentHealth < 1) {
      return true;
    }
    actor.game.addHPEvent(actor.pos, -this.strength);
    actor.game.addSpriteChangeEvent(actor, actor.poisonedSprite);
    actor.reduceHealth(this.inflictor, this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

class FreezeEffect extends Effect {
  constructor(strength, duration, actor) {
    super(strength, duration);
    this.inflictor = actor;
  }

  cause(actor) {
    if (actor.currentHealth < 1) {
      return true;
    }
    actor.game.addAPEvent(actor.pos, -this.strength);
    actor.game.addSpriteChangeEvent(actor, actor.frozenSprite);
    actor.reduceEnergy(this.inflictor, this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

class ShockEffect extends Effect {
  constructor(strength, duration, actor) {
    super(strength, duration);
    this.inflictor = actor;
  }

  cause(actor) {
    if (actor.currentHealth < 1) {
      return true;
    }
    actor.game.addHPEvent(actor.pos, -this.strength);
    actor.game.addAPEvent(actor.pos, -this.strength);
    actor.game.addSpriteChangeEvent(actor, actor.shockedSprite);
    actor.reduceHealth(this.inflictor, this.strength);
    actor.reduceEnergy(this.inflictor, this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

