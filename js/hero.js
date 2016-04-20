"use strict";

class Hero extends Actor {
  constructor(health, energy,
              strength, agility, wisdom, will, endurance,
              position, subtype, game) {
    super(health, energy, position,
          heroSprites[subtype], damageHeroSprites[subtype],
          HERO, game);
    this.equipPrimary = null;
    this.equipSecondary = null;
    this.equipArmour = null;
    this.equipHelmet = null;
    

    this.strength = strength;
    this.agility = agility;
    this.wisdom = wisdom;
    this.will = will;
    this.endurance = endurance;
    this.subtype = subtype;

    this.isFollowing = false;
    this.leader = null;
    this.nextAction = null;
    this.level = 1;
    this.currentExp = 0;
    this.expToNextLvl = 15;
    this.id = 1;
  }
  get armour() {
    return this.equipArmour;
  }
  get helmet() {
    return this.equipHelmet;
  }
  get ring() {
    return this.equipRing;
  }
  get primary() {
    return this.equipPrimary;
  }
  get secondary() {
    return this.equipSecondary;
  }
  get primaryAtkPower() {
    return Math.round(this.equipPrimary.power * this.strength / MAX_STRENGTH);
  }
  get primaryAtkEnergy() {
    return Math.round(this.equipPrimary.energy * MAX_AGILITY / this.agility);
  }
  get primaryAtkType() {
    return this.equipPrimary.type;
  }
  get primaryAtkRange() {
    return this.equipPrimary.range;
  }
  get physicalDefense() {
    var total = 0;
    if (this.equipArmour) {
      total += this.equipArmour.defense;
    }
    if (this.equipHelmet) {
      total += this.equipHelmet.defense;
    }
    if (this.equipSecondary.type == SHIELD) {
      total += this.equipSecondary.defense;
    }
    return total;
  }
  get action() {
    this.currentSprite = this.sprite;
    if (this.isFollowing) {
      if (this.leader.nextAction == this.leader.attack) {
        this.attack.target = this.leader.attack.target;
        this.nextAction = this.attack;
      } else if (this.position.getCost(this.leader.position) > 3) {
        this.walk.dest = this.leader.position;
        this.nextAction = this.walk;
      } else {
        this.nextAction = this.findTarget;
      }
    }
    return this.nextAction;
  }
  
  reduceHealth(enemy, damage) {
    this.currentHealth -= damage;
    this.game.map.setDirty(this.position);
    this.currentSprite = this.damageSprite;
    if (this.isFollowing) {
      this.setAttack(enemy);
      this.nextAction = this.attack;
    }
  }
  
  increaseHealth(amount) {
    console.log("increase health by:", amount);
    this.currentHealth += amount;
    if (this.currentHealth > this.maxHealth) {
      this.currentHealth = this.maxHealth;
    }
  }
  
  increaseExp(exp) {
    let nextExpLevel = this.currentExp + Math.round(this.currentExp * 1.5);
    this.currentExp += exp;
    if (this.currentExp >= this.expToNextLvl) {
      this.level++;
      this.expToNextLvl = nextExpLevel;
      this.maxHealth += 3;
      this.currentHealth = this.maxHealth;
      this.maxEnergy++;
      this.currentEnergy = this.maxEnergy;
      console.log("level up");
      return true;
    }
  }

  follow(leader) {
    this.leader = leader;
    this.isFollowing = true;
    this.walk.dest = this.leader.position;
    this.nextAction = this.walk;
  }
  equipItem(item) {
    switch(item.type) {
      case ARMOUR:
      return this.equipArmour = item;
      break;
      case HELMET:
      return this.equipHelmet = item;
      break;
      case SHIELD:
      case ARROWS:
      case THROWING:
      case SCROLL:
      return this.equipSecondary = item;
      break;
      case SWORD:
      case AXE:
      case BOW:
      case STAFF:
      return this.equipPrimary = item;
      break;
    }
  }
}

class Knight extends Hero {
  constructor(position, game) {
    super(60, 15,
          22, 14, 7, 10, 17,     // 70
          position, KNIGHT, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipPrimary = swords[SWORD0];
    this.equipSecondary = shields[SHIELD0];
  }
}

class Mage extends Hero {
  constructor(position, game) {
    super(60, 15,
          9, 13, 22, 17, 9,
          position, MAGE, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipPrimary = staffs[STAFF0];
    this.equipSecondary = spells[SPELL0];
    //this.equipRing = basicRing;
  }
  get primaryAtkPower() {
    return Math.round(this.equipPrimary.power * this.wisdom / MAX_WISDOM);
  }
  get primaryAtkEnergy() {
    return Math.round(this.equipPrimary.energy * MAX_WILL / this.will);
  }
}

class Rogue extends Hero {
  constructor(position, game) {
    super(60, 15,
          15, 20, 10, 14, 11,
          position, ROGUE, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipPrimary = swords[SWORD0];
    this.equipSecondary = throwing[THROWING0];
    this.secondaryAttack = new SecondaryAttack(this);
  }
  get secondaryAtkPower() {
    return Math.round(this.equipSecondary.power * this.strength / MAX_STRENGTH);
  }
  get secondaryAtkEnergy() {
    return Math.round(this.equipSecondary.energy * MAX_AGILITY / this.agility);
  }
  get secondaryAtkType() {
    return this.equipSecondary.type;
  }
  get secondaryAtkRange() {
    return this.equipSecondary.range;
  }
}

class Archer extends Hero {
  constructor(position, game) {
    super(60, 15,
          13, 22, 9, 11, 15,
          position, ARCHER, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipPrimary = bows[BOW0];
    this.equipSecondary = arrows[ARROWS0];
  }
  get primaryAtkPower() {
    return Math.round((this.equipPrimary.power + this.equipSecondary.power) *
                      this.strength / MAX_STRENGTH);
  }
  get primaryAtkEnergy() {
    return Math.round((this.equipPrimary.energy + this.equipSecondary.energy) *
                      MAX_AGILITY / this.agility);
  }
}

class Warlock extends Hero {
  constructor(position, game) {
    super(60, 15,
          18, 9, 13, 15, 15,
          position, WARLOCK, game);
    this.equipPrimary = axes[AXE0];
    this.equipSecondary = spells[SPELL0];
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
  }
}

class Player {
  constructor(hero) {
    this.currentHero = hero;
    this.game = hero.game;
    this.heroes = [];
    this.shields = new Map();
    this.helmets = new Map();
    this.armours = new Map();
    this.swords = new Map();
    this.staffs = new Map();
    this.axes = new Map();
    this.bows = new Map();
    this.arrows = new Map();
    this.throwing = new Map();
    this.spells = new Map();
    this.potions = new Map();
    this.treasure = new Map();
    this.addHero(hero);
  }
  increaseExp(exp) {
    for (let hero of this.heroes) {
      if (hero.increaseExp(exp)) {
        this.UI.addEvent(new TextEvent(this.game.context, new Date().getTime(),
                                       hero.pos, "lvl up!"));
        this.UI.levelUp(hero);
      }
    }
  }
  addUI(UI) {
    this.UI = UI;
  }
  addHero(hero) {
    this.heroes.push(hero);
    this.addItem(hero.primary);
    this.addItem(hero.secondary);
    if (hero.armour) {
      this.addItem(hero.armour);
    }
    if (hero.helmet) {
      this.addItem(hero.helmet);
    }
    if (hero.ring) {
      this.addItem(hero.ring);
    }
  }
  addItem(item) {
    let number = 1;
    let items;
    switch(item.type) {
      default:
      console.error("unhandled item type in Player.addItem");
      break;
      case ARMOUR:
      items = this.armours;
      break;
      case HELMET:
      items = this.helmets;
      break;
      case SHIELD:
      items = this.shields;
      break;
      case SWORD:
      items = this.swords;
      break;
      case STAFF:
      items = this.staffs;
      break;
      case AXE:
      items = this.axes;
      break;
      case ARROWS:
      items = this.arrows;
      break;
      case THROWING:
      items = this.throwing;
      break;
      case BOW:
      items = this.bows;
      break;
      case SPELL:
      items = this.spells;
      break;
      case POTION:
      items = this.potions;
      break;
      case TREASURE:
      items = this.treasure;
      break;
    }
    if (items.has(item)) {
      number += items.get(item);
    }
    items.set(item, number);
  }
  setDestination(x, y) {
    this.currentHero.setDestination(x, y);
  }
  setRest() {
    for (let hero of this.heroes) {
      hero.setRest();
    }
  }
  healHero() {
    console.log("heal hero:", this.currentHero);
    // This function is called from a click event on the heal button.
    // This is a quick shortcut to healing, instead of using the menu,
    // So we need to choose the smallest potion that is going to heal
    // the current hero.
    let potion = potions[0];
    this.game.addEffect(this.currentHero, potion.effect);
  }
}
