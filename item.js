class Item {
  constructor(name, sprite) {
    this.name = name;
    this.sprite = sprite;
  }
}

class Weapon extends Item {
  constructor(name, sprite, power, range, type) {
    super(name, sprite);
    this.power = power;
    this.range = range;
    this.type = type;
  }
}

class Armour extends Item {
  
}

// https://en.wikipedia.org/wiki/List_of_mythological_objects
// mimung - wudga inherits from his son Wayland the Smith
// skofnung - sword of Hrolf Kraki
// gram - sigurd used to slay Fafnir
// hrunting - sword lent to beowulf
// naegling - beowulfs sword
// Tyrfing - cursed sword of Odin's grandson
// Ridill - possessed by a dwarf named Regin
// Kusanagi - amaterasu sword

