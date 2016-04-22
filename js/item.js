"use strict";

class Item {
  constructor(type, subtype) {
    this.type = type;
    this.subtype = subtype;
  }
  get name() {
    switch(this.type) {
      default:
        console.log("unhandled item type in Item.name");
        return null;
      case POTION:
        return POTION_NAMES[this.subtype];
      case SWORD:
        return SWORD_NAMES[this.subtype];
      case HELMET:
        return HELMET_NAMES[this.subtype];
      case ARMOUR:
        return ARMOUR_NAMES[this.subtype];
      case SHIELD:
        return SHIELD_NAMES[this.subtype];
      case STAFF:
        return STAFF_NAMES[this.subtype];
      case AXE:
        return AXE_NAMES[this.subtype];
      case THROWING:
        return THROWING_NAMES[this.subtype];
      case BOW:
        return BOW_NAMES[this.subtype];
      case ARROWS:
        return ARROW_NAMES[this.subtype];
      case SPELL:
        return SPELL_NAMES[this.subtype];
      case TREASURE:
        return TREASURE_NAMES[this.subtype];
    }
  }
  get sound() {
    switch(this.type) {
      default:
        console.log("unhandled item type in Item.sound");
        return null;
      case SWORD:
      case AXE:
        return slashAttackSound;
      case STAFF:
        if (type == ELECTRIC) {
          return electricMagicSound;
        } else if (type == FIRE) {
          return fireMagicSound;
        } else if (type == ICE) {
          return iceMagicSound;
        } else {
          return normalMagicSound;
        }
    }
  }
  get sprite() {
    switch(this.type) {
      default:
        console.log("unhandled item type in Item.sprite");
        return null;
      case POTION:
        return potionSprites[this.subtype];
      case SWORD:
        return swordSprites[this.subtype];
      case HELMET:
        return helmetSprites[this.subtype];
      case ARMOUR:
        return armourSprites[this.subtype];
      case SHIELD:
        return shieldSprites[this.subtype];
      case STAFF:
        return staffSprites[this.subtype];
      case AXE:
        return axeSprites[this.subtype];
      case THROWING:
        return throwingSprites[this.subtype];
      case BOW:
        return bowSprites[this.subtype];
      case ARROWS:
        return arrowSprites[this.subtype];
      case SPELL:
        return spellSprites[this.subtype];
      case TREASURE:
        return treasureSprites[this.subtype];
    }
  }
}

class Weapon extends Item {
  constructor(type, subtype, power, range, energy, elemType) {
    super(type, subtype);
    this.power = power;
    this.range = range;
    this.elemType = elemType;
    this.energy = energy;
  }
}

class Armour extends Item {
  constructor(type, subtype, defense, elemType) {
    super(type, subtype);
    this.defense = defense;
    this.elemType = elemType;
  }
}

class Potion extends Item {
  constructor(kind, strength, duration) {
    super(POTION, kind);
    this.strength = strength;
    this.duration = duration;
  }
}

class HealthPotion extends Potion {
  constructor(kind, strength, duration) {
    super(kind, strength, duration);
  }
  
  get effect() {
    return new HealEffect(this.strength, this.duration);
  }
}

class EnergyPotion extends Potion {
  constructor(kind, strength, duration) {
    super(kind, strength, duration);
  }
  
  get effect() {
    return new RestoreEnergyEffect(this.strength, this.duration);
  }
}

class Treasure extends Item {
  constructor(kind, value) {
    super(TREASURE, kind);
    this.value = value;
  }
}

class Spell extends Item {
  constructor(kind) {
    super(SPELL, kind);
  }
  use(actor) {
    
  }
}
var potions = [ new HealthPotion(BASIC_HEALTH_POTION, 30, 1),
                new EnergyPotion(BASIC_ENERGY_POTION, 8, 1),
                new HealthPotion(HEALTH_POTION, 30, 2),
                new EnergyPotion(ENERGY_POTION, 16, 1),
                new HealthPotion(BIG_HEALTH_POTION, 75, 1),
                new EnergyPotion(BIG_ENERGY_POTION, 32, 1),
                new HealthPotion(REGENERATION_POTION, 20, 6),
                new EnergyPotion(ENERGISE_POTION, 8, 6)
              ];

var armours = [ new Armour(ARMOUR, ARMOUR0, 8, NORMAL),
                new Armour(ARMOUR, ARMOUR1, 10, NORMAL),
                new Armour(ARMOUR, ARMOUR2, 12, NORMAL),
                new Armour(ARMOUR, ARMOUR3, 14, FIRE),
                new Armour(ARMOUR, ARMOUR4, 16, NORMAL),
                new Armour(ARMOUR, ARMOUR5, 18, ICE),
                new Armour(ARMOUR, ARMOUR6, 20, NORMAL),
                new Armour(ARMOUR, ARMOUR7, 22, ELECTRIC),
              ];
var helmets = [ new Armour(HELMET, HELMET0, 7, NORMAL),
                new Armour(HELMET, HELMET1, 9, NORMAL),
                new Armour(HELMET, HELMET2, 11, NORMAL),
                new Armour(HELMET, HELMET3, 13, FIRE),
                new Armour(HELMET, HELMET4, 15, NORMAL),
                new Armour(HELMET, HELMET5, 17, ICE),
                new Armour(HELMET, HELMET6, 19, NORMAL),
                new Armour(HELMET, HELMET7, 21, ELECTRIC),
              ];
var shields = [ new Armour(SHIELD, SHIELD0, 2, NORMAL),
                new Armour(SHIELD, SHIELD1, 4, NORMAL),
                new Armour(SHIELD, SHIELD2, 6, NORMAL),
                new Armour(SHIELD, SHIELD3, 8, FIRE),
                new Armour(SHIELD, SHIELD4, 10, NORMAL),
                new Armour(SHIELD, SHIELD5, 12, ICE),
                new Armour(SHIELD, SHIELD6, 14, NORMAL),
                new Armour(SHIELD, SHIELD7, 16, ELECTRIC),
              ];
var staffs = [ new Weapon(STAFF, STAFF0, 10, 6, 1, FIRE),
               new Weapon(STAFF, STAFF1, 20, 3, 2, ICE),
               new Weapon(STAFF, STAFF2, 30, 3, 2, ELECTRIC),
               new Weapon(STAFF, STAFF3, 50, 3, 3, FIRE),
               new Weapon(STAFF, STAFF4, 75, 3, 3, ICE),
               new Weapon(STAFF, STAFF5, 100, 3, 4, ELECTRIC),
               new Weapon(STAFF, STAFF6, 120, 3, 4, FIRE),
               new Weapon(STAFF, STAFF7, 150, 3, 5, ICE),
             ];

var swords = [ new Weapon(SWORD, SWORD0, 20, 3, 1, NORMAL),
               new Weapon(SWORD, SWORD1, 30, 3, 2, NORMAL),
               new Weapon(SWORD, SWORD2, 40, 3, 2, NORMAL),
               new Weapon(SWORD, SWORD3, 50, 3, 3, NORMAL),
               new Weapon(SWORD, SWORD4, 75, 3, 3, NORMAL),
               new Weapon(SWORD, SWORD5, 100, 3, 4, NORMAL),
               new Weapon(SWORD, SWORD6, 120, 3, 4, NORMAL),
               new Weapon(SWORD, SWORD7, 150, 3, 5, NORMAL),
             ];

var axes = [ new Weapon(AXE, AXE0, 30, 3, 2, NORMAL),
               new Weapon(AXE, AXE1, 45, 3, 3, NORMAL),
               new Weapon(AXE, AXE2, 52, 3, 3, NORMAL),
               new Weapon(AXE, AXE3, 65, 3, 4, NORMAL),
               new Weapon(AXE, AXE4, 100, 3, 4, NORMAL),
               new Weapon(AXE, AXE5, 120, 3, 5, NORMAL),
               new Weapon(AXE, AXE6, 145, 3, 5, NORMAL),
               new Weapon(AXE, AXE7, 175, 3, 6, NORMAL),
             ];
             
var bows = [ new Weapon(BOW, BOW0, 20, 9, 1, NORMAL),
             new Weapon(BOW, BOW1, 30, 8, 2, NORMAL),
             new Weapon(BOW, BOW2, 40, 9, 2, NORMAL),
             new Weapon(BOW, BOW3, 50, 8, 3, NORMAL),
             new Weapon(BOW, BOW4, 75, 9, 3, NORMAL)
           ];

var arrows = [ new Weapon(ARROWS, ARROWS0, 10, 8, 1, NORMAL),
               new Weapon(ARROWS, ARROWS1, 16, 7, 1, NORMAL),
               new Weapon(ARROWS, ARROWS2, 22, 8, 1, NORMAL)
             ];
             
var throwing = [ new Weapon(THROWING, THROWING0, 10, 8, 1, NORMAL),
                 new Weapon(THROWING, THROWING1, 16, 8, 2, NORMAL),
                 new Weapon(THROWING, THROWING2, 22, 8, 2, NORMAL)
               ];

// https://en.wikipedia.org/wiki/List_of_mythological_objects
// mimung - wudga inherits from his son Wayland the Smith
// skofnung - sword of Hrolf Kraki
// gram - sigurd used to slay Fafnir
// hrunting - sword lent to beowulf
// naegling - beowulfs sword
// Tyrfing - cursed sword of Odin's grandson
// Ridill - possessed by a dwarf named Regin
// Kusanagi - amaterasu sword


var treasures = [ new Treasure(TREASURE0, 50),
                  new Treasure(TREASURE1, 75),
                  new Treasure(TREASURE2, 100),
                  new Treasure(TREASURE3, 125),
                  new Treasure(TREASURE4, 150),
                  new Treasure(TREASURE5, 175),
                  new Treasure(TREASURE6, 200),
                  new Treasure(TREASURE7, 225)
                ];

var spells = [ new Spell(SPELL0),
                new Spell(SPELL1),
                new Spell(SPELL2),
                new Spell(SPELL3),
                new Spell(SPELL4),
                new Spell(SPELL5),
                new Spell(SPELL6),
                new Spell(SPELL7)
              ];