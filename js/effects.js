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
  constructor(actor, strength) {
    super(strength, 1);
    this.inflictor = actor;
  }

  cause(actor) {
    actor.game.addTextEvent(actor.name + " takes " + this.strength + " physical damage");
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
    actor.game.addTextEvent(actor.name + " is healed by " + this.strength + "HP");
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
    actor.game.addTextEvent(actor.name + " is healed by " + this.strength + "AP");
    actor.increaseEnergy(this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

class BurnEffect extends Effect {
  constructor(strength, duration) {
    super(strength, duration);
  }

  cause(actor) {
    actor.game.addTextEvent(actor.name + " takes " + this.strength + " burn damage");
    actor.game.addSpriteChangeEvent(actor, actor.burntSprite);
    actor.reduceHealth(this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

class PoisonEffect extends Effect {
  constructor(strength, duration) {
    super(strength, duration);
  }

  cause(actor) {
    actor.game.addTextEvent(actor.name + " takes " + this.strength + " poison damage");
    actor.game.addSpriteChangeEvent(actor, actor.poisonedSprite);
    actor.reduceHealth(this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

class FreezeEffect extends Effect {
  constructor(strength, duration) {
    super(strength, duration);
  }

  cause(actor) {
    actor.game.addTextEvent(actor.name + " has " + this.strength + " AP sapped away");
    actor.game.addSpriteChangeEvent(actor, actor.frozenSprite);
    actor.reduceEnergy(this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

class ShockEffect extends Effect {
  constructor(strength, duration) {
    super(strength, duration);
  }

  cause(actor) {
    actor.game.addTextEvent(actor.name + " has " + this.strength + " HP and AP zapped away");
    actor.game.addSpriteChangeEvent(actor, actor.shockedSprite);
    actor.reduceEnergy(this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}

