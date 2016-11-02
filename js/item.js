"use strict";

class Item {
  constructor(type, subtype) {
    this.type = type;
    this.subtype = subtype;
  }
  
  get name() {
    return this.names[this.subtype];
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
    return this.sprites[this.subtype];
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

class Sword extends Weapon {
  constructor(subtype, power, range, energy, elemType) {
    super(SWORD, subtype, power, range, energy, elemType);
    this.sprites = swordSprites;
    this.names = SWORD_NAMES;
  }
}

class Staff extends Weapon {
  constructor(subtype, power, range, energy, elemType) {
    super(STAFF, subtype, power, range, energy, elemType);
    this.sprites = staffSprites;
    this.names = STAFF_NAMES;
  }
}

class Axe extends Weapon {
  constructor(subtype, power, range, energy, elemType) {
    super(AXE, subtype, power, range, energy, elemType);
    this.sprites = axeSprites;
    this.names = AXE_NAMES;
  }
}

class Bow extends Weapon {
  constructor(subtype, power, range, energy, elemType) {
    super(BOW, subtype, power, range, energy, elemType);
    this.sprites = bowSprites;
    this.names = BOW_NAMES;
  }
}

class Arrows extends Weapon {
  constructor(subtype, power, range, energy, elemType) {
    super(ARROWS, subtype, power, range, energy, elemType);
    this.sprites = arrowSprites;
    this.names = ARROW_NAMES;
  }
}

class Throwing extends Weapon {
  constructor(subtype, power, range, energy, elemType) {
    super(THROWING, subtype, power, range, energy, elemType);
    this.sprites = throwingSprites;
    this.names = THROWING_NAMES;
  }
}

class Armour extends Item {
  constructor(type, subtype, defense, elemType) {
    super(type, subtype);
    this.defense = defense;
    this.elemType = elemType;
  }
}

class Helmet extends Armour {
  constructor(subtype, defense, elemType) {
    super(HELMET, subtype);
    this.defense = defense;
    this.elemType = elemType;
    this.sprites = helmetSprites;
    this.names = HELMET_NAMES;
  }
}

class BodyArmour extends Armour {
  constructor(subtype, defense, elemType) {
    super(ARMOUR, subtype);
    this.defense = defense;
    this.elemType = elemType;
    this.sprites = armourSprites;
    this.names = ARMOUR_NAMES;
  }
}

class Shield extends Armour {
  constructor(subtype, defense, elemType) {
    super(SHIELD, subtype);
    this.defense = defense;
    this.elemType = elemType;
    this.sprites = shieldSprites;
    this.names = SHIELD_NAMES;
  }
}

class Potion extends Item {
  constructor(kind, strength, duration) {
    super(POTION, kind);
    this.strength = strength;
    this.duration = duration;
    this.sprites = potionSprites;
    this.names = POTION_NAMES;
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
    this.names = TREASURE_NAMES;
  }
}

class Spell extends Item {
  constructor(kind) {
    super(SPELL, kind);
    this.names = SPELL_NAMES;
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

var armours = [ new BodyArmour(ARMOUR0, 8, NORMAL),
                new BodyArmour(ARMOUR1, 10, NORMAL),
                new BodyArmour(ARMOUR2, 12, NORMAL),
                new BodyArmour(ARMOUR3, 14, FIRE),
                new BodyArmour(ARMOUR4, 16, NORMAL),
                new BodyArmour(ARMOUR5, 18, ICE),
                new BodyArmour(ARMOUR6, 20, NORMAL),
                new BodyArmour(ARMOUR7, 22, ELECTRIC)
              ];
              
var helmets = [ new Helmet(HELMET0, 7, NORMAL),
                new Helmet(HELMET1, 9, NORMAL),
                new Helmet(HELMET2, 11, NORMAL),
                new Helmet(HELMET3, 13, FIRE),
                new Helmet(HELMET4, 15, NORMAL),
                new Helmet(HELMET5, 17, ICE),
                new Helmet(HELMET6, 19, NORMAL),
                new Helmet(HELMET7, 21, ELECTRIC)
              ];
              
var shields = [ new Shield(SHIELD0, 2, NORMAL),
                new Shield(SHIELD1, 4, NORMAL),
                new Shield(SHIELD2, 6, NORMAL),
                new Shield(SHIELD3, 8, FIRE),
                new Shield(SHIELD4, 10, NORMAL),
                new Shield(SHIELD5, 12, ICE),
                new Shield(SHIELD6, 14, NORMAL),
                new Shield(SHIELD7, 16, ELECTRIC)
              ];
              
var staffs = [ new Staff(STAFF0, 10, 8, 1, FIRE),
               new Staff(STAFF1, 20, 8, 2, ICE),
               new Staff(STAFF2, 30, 8, 2, ELECTRIC),
               new Staff(STAFF3, 50, 9, 3, FIRE),
               new Staff(STAFF4, 75, 9, 3, ICE),
               new Staff(STAFF5, 100, 9, 4, ELECTRIC),
               new Staff(STAFF6, 120, 10, 4, FIRE),
               new Staff(STAFF7, 150, 10, 5, ICE)
             ];

var swords = [ new Sword(SWORD0, 20, 3, 1, NORMAL),
               new Sword(SWORD1, 30, 3, 2, NORMAL),
               new Sword(SWORD2, 40, 3, 2, NORMAL),
               new Sword(SWORD3, 50, 3, 3, NORMAL),
               new Sword(SWORD4, 75, 3, 3, NORMAL),
               new Sword(SWORD5, 100, 3, 4, NORMAL),
               new Sword(SWORD6, 120, 3, 4, NORMAL),
               new Sword(SWORD7, 150, 3, 5, NORMAL)
             ];

var axes = [ new Axe(AXE0, 30, 3, 2, NORMAL),
             new Axe(AXE1, 45, 3, 3, NORMAL),
             new Axe(AXE2, 52, 3, 3, NORMAL),
             new Axe(AXE3, 65, 3, 4, NORMAL),
             new Axe(AXE4, 100, 3, 4, NORMAL),
             new Axe(AXE5, 120, 3, 5, NORMAL),
             new Axe(AXE6, 145, 3, 5, NORMAL),
             new Axe(AXE7, 175, 3, 6, NORMAL)
            ];
             
var bows = [ new Bow(BOW0, 20, 9, 1, NORMAL),
             new Bow(BOW1, 30, 8, 2, NORMAL),
             new Bow(BOW2, 40, 9, 2, NORMAL),
             new Bow(BOW3, 50, 8, 3, NORMAL),
             new Bow(BOW4, 75, 9, 3, NORMAL)
           ];

var arrows = [ new Arrows(ARROWS0, 10, 8, 1, NORMAL),
               new Arrows(ARROWS1, 16, 7, 1, NORMAL),
               new Arrows(ARROWS2, 22, 8, 1, NORMAL)
             ];
             
var throwing = [ new Throwing(THROWING0, 10, 8, 1, NORMAL),
                 new Throwing(THROWING1, 16, 8, 2, NORMAL),
                 new Throwing(THROWING2, 22, 8, 2, NORMAL)
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