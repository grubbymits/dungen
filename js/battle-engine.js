class BattleEngine {
  constructor() {
    this.observers = new Set();
    this.currentEffects = new Map();
  }

  addObserver(observer) {
    this.observers.add(observer);
  }
 
  removeObserver(observer) {
    this.observers.remove(observer);
  }

  addEffect(actor, target, effect, duration) {
    if (!this.currentEffects.has(actor)) {
      console.log("actor isn't in current effects.");
      return;
    }
    this.currentEffects.get(actor).add(effect);
    let result = effect(actor, target, duration);

    for (observer of observers) {
      observer.notify(actor, target, result)
    }
  }

  applyEffects(index) {
    let actor = this.actors[index];
    if (this.currentEffects.has(actor)) {
      let effects = this.currentEffects.get(actor);
      for (let effect of effects.values()) {
        effect.cause(actor);
        if (effect.finished) {
          effects.delete(effect);
        }
      }
    } else {
      console.log("actor isn't in effects.");
    }
    // Each actor receives some EP at the beginning of their turn.
    if (actor.currentEnergy < actor.maxEnergy - 1) {
      actor.currentEnergy = actor.currentEnergy + 2;
    } else if (actor.currentEnergy < actor.maxEnergy) {
      actor.currentEnergy++;
    }
  }
}
