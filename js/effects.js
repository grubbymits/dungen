"use strict";

class EmptyChange {
  constructor() {
    this.type = NOTHING;
  }
}

class OneEntityChange {
  constructor(actor, type) {
    this.actor = actor;
    this.type = type;
  }
}

class ItemUse {
  constructor(actor, item, type) {
    this.actor = actor;
    this.item = item;
    this.type = type;
  }
}

class TwoEntityChange {
  constructor(actor, target, type, amount) {
    this.actor = actor;
    this.target = target;
    this.type = type;
    this.amount = amount;
  }
}

function DamageHP(actor, target, duration, strength, elemType) {
  var finished = false;
  function cause() {
    if (target.currentHealth < 1) {
      finished = true;
      return new EmptyChange();
    }
    target.reduceHealth(actor, strength);
    --duration;
    if (duration === 0) {
      finished = true;
    }
    return new TwoEntityChange(actor, target, elemType, -strength);
  };
  return cause;
}

function DamageAP(target, duration, strength, elemType) {
  var finished = false;
  function cause() {
    if (target.currentHealth < 1) {
      finished = true;
      return new StateChange(actor, target, NOTHING, 0);
    }
    target.reduceEnergy(target, strength);
    --duration;
    if (duration === 0) {
      finished = true;
    }
    return new TwoEntityChange(actor, target, elemType, -strength);
  };
  return cause;
}

function DamageHPAP(target, duration, strength, elemType) {
  var finished = false;
  function cause() {
    if (target.currentHealth < 1) {
      finished = true;
      return new StateChange(actor, target, NOTHING, 0);
    }
    target.reduceHealth(target, strength);
    target.reduceEnergy(target, strength);
    --duration;
    if (duration === 0) {
      finished = true;
    }
    return new TwoEntityChange(actor, target, elemType, -strength);
  };
  return cause;
}

function HealHP(target, strength, duration) {
  var finished = false;
  function cause() {
    target.increaseHealth(strength);
    --duration;
    if (duration === 0) {
      finished = true;
    }
    return new OneEntityChange(target, HP_EVENT, strength);
  }
  return cause;
}

function HealAP(target, strength, duration) {
  var finished = false;
  function cause() {
    target.increaseEnergy(strength);
    --duration;
    if (duration === 0) {
      finished = true;
    }
    return new OneEntityChange(target, AP_EVENT, strength);
  }
  return cause;
}
