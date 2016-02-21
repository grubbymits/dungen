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

// https://en.wikipedia.org/wiki/List_of_mythological_objects
// mimung - wudga inherits from his son Wayland the Smith
// skofnung - sword of Hrolf Kraki
// gram - sigurd used to slay Fafnir
// hrunting - sword lent to beowulf
// naegling - beowulfs sword
// Tyrfing - cursed sword of Odin's grandson
// Ridill - possessed by a dwarf named Regin
// Kusanagi - amaterasu sword
