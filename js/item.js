"use strict";

class Item {
  constructor(name, sprite) {
    this.name = name;
    this.sprite = sprite;
  }
}

class Weapon extends Item {
  constructor(name, sprite, power, range, energy, type) {
    super(name, sprite);
    this.power = power;
    this.range = range;
    this.type = type;
    this.energy = energy;
  }
}

class Armour extends Item {
  constructor(name, sprite, defense, type) {
    super(name, sprite);
    this.defense = defense;
    this.type = type;
  }
}

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

var crystalBall = new Item("crystal ball", crystalBallSprite);

var swords = [ new Weapon("first sword",    swordSprites[0], 2, 3, 1, NORMAL),
               new Weapon("second sword",   swordSprites[1], 4, 3, 2, NORMAL),
               new Weapon("third sword",    swordSprites[2], 6, 3, 2, NORMAL),
               new Weapon("fourth sword",   swordSprites[3], 10, 3, 3, NORMAL),
               new Weapon("fifth sword",    swordSprites[4], 15, 3, 3, NORMAL),
               new Weapon("sixth sword",    swordSprites[5], 20, 3, 4, NORMAL),
               new Weapon("seventh sword",  swordSprites[6], 24, 3, 4, NORMAL),
               new Weapon("eigth sword",    swordSprites[6], 30, 3, 5, NORMAL),
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

class Chest extends Entity {
  constructor(position, game) {
    super(position, true, chestSprites[0], OBJECT, game);
  }
  pickTreasure() {
    // treasure, there are 4 types
    type = Math.random();
    if (type < 0.5) {

    } else if (type < 0.75) {

    } else if (type < 0.88) {

    } else {

    }
  }
  pickPotion() {
    // potion, there are 8 types.
  }
  pickEquipment() {
    // equipment, there are 10 types including spells and jewelry.
    type = Math.random();
    if (type < 0.1) {

    } else if (type < 0.2) {

    } else if (type < 0.3) {

    } else if (type < 0.4) {

    } else if (type < 0.5) {

    } else if (type < 0.6) {

    } else if (type < 0.7) {

    } else if (type < 0.8) {

    } else if (type < 0.9) {

    } else {

    }
  }
  interact(actor) {
    this.sprite = chestSprites[1];
    // randomly choose contained item, its normally going to be a potion or
    // treasure and for weapons and armour it is more likely to be a lesser
    // item rather than the best of its class.
    let type = Math.random();
    let item = null;
    if (type < 0.333) {
      item = this.pickTreasure();
    } else if (type < 0.667) {
      item = this.pickPotion();
    } else {
      item = this.pickEquipment();
    }
  }
}
