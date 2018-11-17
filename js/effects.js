"use strict";

class Effect {
  constructor(strength, duration) {
    this.strength = strength;
    this.duration = duration;
    this.finished = false;
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
      this.finished = true;
      return { type : NOTHING; value : 0 };
    }
    actor.game.audio.hit();
    actor.reduceHealth(this.inflictor, this.strength);
    --this.duration;
    if (this.duration === 0) {
      this.finished = true;
    }
    return { type : DAMAGE; value : -this.strength }
  }
}

class HealEffect extends Effect {
  constructor(strength, duration) {
    super(strength, duration);
  }

  cause(actor) {
    actor.game.audio.cure();
    actor.increaseHealth(this.strength);
    --this.duration;
    if (this.duration === 0) {
      this.finished = true;
    }
    return { type : HP; value : this.strength };
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
      this.finished = true;
    }
    return { type : AP; value : this.strength };
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
      return { type: NOTHING; value : 0 };
    }
    actor.reduceHealth(this.inflictor, this.strength);
    --this.duration;
    if (this.duration === 0) {
      this.finished = true;
    }
    return { type: BURN; value : this.strength };
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
      return { type: NOTHING; value : 0 };
    }
    actor.reduceHealth(this.inflictor, this.strength);
    --this.duration;
    if (this.duration === 0) {
      this.finished = true;
    }
    return { type: POISON; value : this.strength };
  }
}

class FreezeEffect extends Effect {
  constructor(strength, duration, actor) {
    super(strength, duration);
    this.inflictor = actor;
  }

  cause(actor) {
    if (actor.currentHealth < 1) {
      return { type: NOTHING; value : 0 };
    }
    actor.reduceEnergy(this.inflictor, this.strength);
    --this.duration;
    if (this.duration === 0) {
      this.finished = true;
    }
    return { type: FREEZE; value : this.strength };
  }
}

class ShockEffect extends Effect {
  constructor(strength, duration, actor) {
    super(strength, duration);
    this.inflictor = actor;
  }

  cause(actor) {
    if (actor.currentHealth < 1) {
      return { type: NOTHING; value : 0 };
    }
    actor.reduceHealth(this.inflictor, this.strength);
    actor.reduceEnergy(this.inflictor, this.strength);
    --this.duration;
    if (this.duration === 0) {
      this.finished = true;
    }
    return { type: SHOCK; value : this.strength };
  }
}

