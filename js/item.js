"use strict";

class Item {
  constructor(type, subtype) {
    this.type = type;
    this.subtype = subtype;
  }
  get name() {
    switch(this.type) {
      default:
        console.log("unhandled item type");
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
    }
  }
  get sprite() {
    switch(this.type) {
      default:
        console.log("unhandled item type");
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
/*
var basicSword = new Weapon("basic sword", swordSprites[0],
                            2, 3, 1, NORMAL);
var basicStaff = new Weapon("basic staff", staffSprites[0],
                            2, 15, 2, NORMAL);
var basicShield = new Armour("basic shield", shieldSprites[0],
                             2, NORMAL);
var basicHelmet = new Armour("basic helmet", helmetSprites[0],
                             2, NORMAL);
var basicArmour = new Armour("basic armour", armourSprites[0],
                             3, NORMAL);
*/

var crystalBall = new Item("crystal ball", crystalBallSprite);

var armours = [ new Armour(ARMOUR, ARMOUR0, 3, NORMAL),
                new Armour(ARMOUR, ARMOUR1, 5, NORMAL),
                new Armour(ARMOUR, ARMOUR2, 7, NORMAL),
                new Armour(ARMOUR, ARMOUR3, 9, FIRE),
                new Armour(ARMOUR, ARMOUR4, 11, NORMAL),
                new Armour(ARMOUR, ARMOUR5, 13, ICE),
                new Armour(ARMOUR, ARMOUR6, 15, NORMAL),
                new Armour(ARMOUR, ARMOUR7, 17, ELECTRIC),
              ];
var helmets = [ new Armour(HELMET, HELMET0, 2, NORMAL),
                new Armour(HELMET, HELMET1, 4, NORMAL),
                new Armour(HELMET, HELMET2, 6, NORMAL),
                new Armour(HELMET, HELMET3, 8, FIRE),
                new Armour(HELMET, HELMET4, 10, NORMAL),
                new Armour(HELMET, HELMET5, 12, ICE),
                new Armour(HELMET, HELMET6, 14, NORMAL),
                new Armour(HELMET, HELMET7, 16, ELECTRIC),
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
var staffs = [ new Weapon(STAFF, STAFF0, 10, 3, 1, FIRE),
               new Weapon(STAFF, STAFF1, 20, 3, 2, ICE),
               new Weapon(STAFF, STAFF2, 30, 3, 2, ELECTRIC),
               new Weapon(STAFF, STAFF3, 50, 3, 3, FIRE),
               new Weapon(STAFF, STAFF4, 75, 3, 3, ICE),
               new Weapon(STAFF, STAFF5, 100, 3, 4, ELECTRIC),
               new Weapon(STAFF, STAFF6, 120, 3, 4, FIRE),
               new Weapon(STAFF, STAFF7, 150, 3, 5, ICE),
             ];

var swords = [ new Weapon(SWORD, SWORD0, 10, 3, 1, NORMAL),
               new Weapon(SWORD, SWORD1, 20, 3, 2, NORMAL),
               new Weapon(SWORD, SWORD2, 30, 3, 2, NORMAL),
               new Weapon(SWORD, SWORD3, 50, 3, 3, NORMAL),
               new Weapon(SWORD, SWORD4, 75, 3, 3, NORMAL),
               new Weapon(SWORD, SWORD5, 100, 3, 4, NORMAL),
               new Weapon(SWORD, SWORD6, 120, 3, 4, NORMAL),
               new Weapon(SWORD, SWORD7, 159, 3, 5, NORMAL),
             ];

var axes = [ new Weapon(AXE, AXE0, 3, 3, 2, NORMAL),
               new Weapon(AXE, AXE1, 5, 3, 3, NORMAL),
               new Weapon(AXE, AXE2, 7, 3, 3, NORMAL),
               new Weapon(AXE, AXE3, 12, 3, 4, NORMAL),
               new Weapon(AXE, AXE4, 17, 3, 4, NORMAL),
               new Weapon(AXE, AXE5, 22, 3, 5, NORMAL),
               new Weapon(AXE, AXE6, 28, 3, 5, NORMAL),
               new Weapon(AXE, AXE7, 34, 3, 6, NORMAL),
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

class Potion extends Item {
  constructor(kind) {
    super(POTION, kind);
  }
}

var potions = [ new Potion(BASIC_HEALTH_POTION),
                new Potion(ENERGY_POTION),
                new Potion(DEFENSE_POTION),
                new Potion(BIG_HEALTH_POTION),
                new Potion(AGILITY_POTION),
                new Potion(STRENGTH_POTION),
                new Potion(WISDOM_POTION),
                new Potion(INVINCIBILITY_POTION),
              ];
