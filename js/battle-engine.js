class BattleEngine {
  constructor() {
    this.observers = new Set();
    this.currentEffects = new Map();
    this.events = [];
  }

  reset() {
    this.observers.clear();
    this.currentEffects.clear();
    this.events = [];
  }

  addObserver(observer) {
    this.observers.add(observer);
  }
 
  removeObserver(observer) {
    this.observers.remove(observer);
  }

  addActor(actor) {
    this.currentEffects.set(actor, new Set());
  }

  addEvent(change) {
    for (let observer of this.observers) {
      observer.notify(change);
    }
  }

  attack(actor, target) {
    actor.attack.target = target;
    actor.nextAction = actor.attack;
    this.addEvent(new StateChange(actor, target, TARGET_EVENT, 0));
  }

  rest(actor) {
    actor.nextAction = actor.rest;
    this.addEvent(new StateChange(actor, actor, REST_EVENT, 0));
  }

  addEffect(actor, target, effect) {
    if (!this.currentEffects.has(actor)) {
      console.log("actor isn't in current effects.");
      return;
    }
    this.currentEffects.get(actor).add(effect);
    this.addEvent(effect());
  }

  applyEffects(actor) {
    if (this.currentEffects.has(actor)) {
      let effects = this.currentEffects.get(actor);
      for (let effect of effects.values()) {
        if (effect.finished) {
          effects.delete(effect);
        } else {
          this.addEvent(effect());
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
