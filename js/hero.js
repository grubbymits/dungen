"use strict";

class Hero extends Actor {
  constructor(health, energy,
              strength, agility, wisdom, will, endurance,
              vision,
              position, subtype, game) {
    super(health, energy, vision, position,
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
    
    this.maxHealth += Math.floor(this.maxHealth *
                                 (this.endurance / MAX_ENDURANCE));
    this.maxEnergy += Math.floor(this.maxEnergy *
                                 (this.endurance / MAX_ENDURANCE) +
                                 this.maxEnergy * (this.will / MAX_WILL));
    this.currentHealth = this.maxHealth;
    this.currentEnergy = this.maxEnergy;
    

    this.isFollowing = false;
    this.leader = null;
    this.nextAction = null;
    this.healAction = new TakePotion(this);
    this.level = 1;
    this.currentExp = 0;
    this.expToNextLvl = 15;
    this.id = 1;
    this.findTarget.targets = this.game.monsters;
  }

  reset() {
    this.currentHealth = this.maxHealth;
    this.currentEnergy = this.maxEnergy;
    this.walk = new WalkAction(this);
    this.rest = new RestAction(this);
    this.attack = new InitAttack(this);
    this.findTarget = new FindTarget(this);
    this.primaryAttack = new PrimaryAttack(this);
    this.interact = new Interact(this);
    this.findTarget.targets = this.game.monsters;
  }

  get name() {
    return this.className;
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
  
  takePotion(potion) {
    this.healAction.potion = potion;
    this.nextAction = this.healAction;
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
      this.maxHealth += Math.floor(MAX_HEALTH_INC * (this.endurance / MAX_ENDURANCE));
      this.maxEnergy += Math.floor(MAX_ENERGY_INC * (this.endurance / MAX_ENDURANCE) +
                                   MAX_ENERGY_INC * (this.will / MAX_WILL));
      this.currentHealth = this.maxHealth;
      this.currentEnergy = this.maxEnergy;
      return true;
    }
  }

  follow(leader) {
    console.log("follow", this.name, leader.name);
    this.leader = leader;
    this.isFollowing = true;
    this.walk.dest = this.leader.position;
    this.nextAction = this.walk;
  }

  unfollow() {
    console.log("unfollow", this.name);
    this.leader = null;
    this.isFollowing = false;
    this.nextAction = null;
  }
  
  equipItem(item) {
    console.log("equipItem", item);
    switch(item.type) {
      case ARMOUR:
      this.equipArmour = item;
      break;
      case HELMET:
      this.equipHelmet = item;
      break;
      case SHIELD:
      case ARROWS:
      case THROWING:
      case SCROLL:
      this.equipSecondary = item;
      break;
      case SWORD:
      case AXE:
      case BOW:
      case STAFF:
      this.equipPrimary = item;
      break;
    }
  }
}

class Knight extends Hero {
  constructor(position, game) {
    super(50, 15,
          22, 14, 7, 10, 17,     // 70
          5,
          position, KNIGHT, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipPrimary = swords[SWORD0];
    this.equipSecondary = shields[SHIELD0];
    this.className = 'knight';
  }
}

class Mage extends Hero {
  constructor(position, game) {
    super(50, 15,
          9, 13, 22, 17, 9,
          6,
          position, MAGE, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipPrimary = staffs[STAFF0];
    this.equipSecondary = spells[SPELL0];
    //this.equipRing = basicRing;
    this.className = 'mage';
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
    super(50, 15,
          15, 20, 10, 14, 11,
          7,
          position, ROGUE, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipPrimary = swords[SWORD0];
    this.equipSecondary = throwing[THROWING0];
    this.secondaryAttack = new SecondaryAttack(this);
    this.className = 'rogue';
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
    super(50, 15,
          13, 22, 9, 11, 15,
          7,
          position, ARCHER, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipPrimary = bows[BOW0];
    this.equipSecondary = arrows[ARROWS0];
    this.className = 'archer';
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
    super(50, 15,
          18, 9, 13, 15, 15,
          position, WARLOCK, game);
    this.equipPrimary = axes[AXE0];
    this.equipSecondary = spells[SPELL0];
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.className = 'warlock';
  }
}

