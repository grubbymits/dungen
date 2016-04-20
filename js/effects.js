class Effect {
  constructor(strength, duration) {
    this.strength = strength;
    this.duration = duration;
  }
  cause(hero) {
    console.error("Effect.apply is not implemented!");
  }
}

class HealEffect extends Effect {
  constructor(strength, duration) {
    super(strength, duration);
  }
  cause(hero) {
    hero.game.audio.cure();
    hero.increaseHealth(this.strength);
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
  cause(hero) {
    hero.increaseEnergy(this.strength);
    --this.duration;
    if (this.duration === 0) {
      return true;
    }
    return false;
  }
}