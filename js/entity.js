"use strict";

class Entity {
  constructor(position, sprite, kind, game) {
    this.position = position;
    this.drawX = position.x * TILE_SIZE;
    this.drawY = position.y * TILE_SIZE;
    this.sprite = sprite;
    this.kind = kind;
    this.game = game;
    this.isStatic = true;
  }

  get pos() {
    return this.position;
  }

  set pos(pos) {
    this.position = pos;
    this.drawX = pos.x * TILE_SIZE;
    this.drawY = pos.y * TILE_SIZE;
  }

  interact(actor) {
    return null;
  }

  get isInteractable() {
    return false;
  }
}

class Skull extends Entity {
  constructor(position, game) {
    super(position, null, OBJECT, game);
    let spriteIdx = Math.random();
    if (spriteIdx < 0.333) {
      this.sprite = skullSprites[0];
    } else if (spriteIdx < 0.666) {
      this.sprite = skullSprites[1];
    } else {
      this.sprite = skullSprites[2];
    }
  }
}

class Tombstone extends Entity {
  constructor(position, game) {
    super(position, tombstoneSprite, OBJECT, game);
  }
}

class MagicalObject extends Entity {
  constructor(position, game) {
    super(position, null, OBJECT, game);
    if (Math.random() < 0.5) {
      this.sprite = magicalObjectSprites[0];
    } else {
      this.sprite = magicalObjectSprites[1];
    }
  }
}

class Sign extends Entity {
  constructor(position, game) {
    super(position, null, OBJECT, game);
    if (Math.random() < 0.5) {
      this.sprite = signSprites[0];
    } else {
      this.sprite = signSprites[1];
    }
  }
}

class Door extends Entity {
  constructor(position, game) {
    super(position, tileSprites[TILE_ROUND_DOOR], OBJECT, game);
    this.open = false;
  }
  
  get isInteractable() {
    return !this.open;
  }
  
  interact(actor) {
    if (!this.game.player.hasKey) {
      console.log("you don't have the key");
      return;
    }
    this.open = true;
    this.game.audio.chest();
    this.game.entitiesToRemove.add(this);
    this.game.player.hasKey = false;
  }
}

class Key extends Entity {
  constructor(position, game) {
    super(position, keySprites[0], OBJECT, game);
  }
  
  get isInteractable() {
    return true;
  }
  
  interact(actor) {
    this.game.addGraphicEvent(this.sprite,
                              new Vec(actor.pos.x, actor.pos.y - 1));
    this.game.audio.chest();
    this.game.player.hasKey = true;
    this.game.entitiesToRemove.add(this);
  }
}

class Chest extends Entity {
  constructor(position, game) {
    super(position, chestSprites[0], OBJECT, game);
    this.open = false;
  }
  pickTreasure() {
    console.log("pickTreasure");
    // treasure, there are 4 types
    let type = Math.random();
    let index = TREASURE0;
    if (type < 0.25) {
      index = TREASURE0;
    } else if (type < 0.4) {
      index = TREASURE1;
    } else if (type < 0.54) {
      index = TREASURE2;
    } else if (type < 0.66) {
      index = TREASURE3;
    } else if (type < 0.77) {
      index = TREASURE4;
    } else if (type < 0.87) {
      index = TREASURE5;
    } else if (type < 0.96) {
      index = TREASURE6;
    } else {
      index = TREASURE7;
    }
    return treasures[index];
  }
  pickPotion() {
    console.log("pickPotion");
    // potion, there are 8 types.
    let type = Math.random();
    if (type < 0.25) {
      return potions[BASIC_HEALTH_POTION];
    } else if (type < 0.4) {
      return potions[BASIC_ENERGY_POTION];
    } else if (type < 0.55) {
      return potions[HEALTH_POTION];
    } else if (type < 0.65) {
      return potions[ENERGY_POTION];
    } else if (type < 0.75) {
      return potions[BIG_HEALTH_POTION];
    } else if (type < 0.85) {
      return potions[BIG_ENERGY_POTION];
    } else if (type < 0.95) {
      return potions[REGENERATION_POTION];
    } else {
      return potions[ENERGISE_POTION];
    }
  }
  pickEquipment() {
    console.log("pickEquipment");
    let type = Math.random();
    let itemArray = null;

    if (type < 0.25) {
      itemArray = armours;
    } else if (type < 0.5) {
      itemArray = helmets;
    } else if (type < 0.65) {
      itemArray = swords;
    } else if (type < 0.7) {
      itemArray = shields;
    } else if (type < 0.75) {
      itemArray = axes;
    } else if (type < 0.8) {
      itemArray = staffs;
    } else if (type < 0.85) {
      itemArray = bows;
    } else if (type < 0.9) {
      itemArray = spells;
    } else if (type < 0.95) {
      itemArray = arrows;
    } else {
      itemArray = throwing;
    }
    if (itemArray === null) {
      return null;
    }

    let max = itemArray.length < this.game.level ? itemArray.length : this.game.level;
    return itemArray[getBoundedRandom(max, 0)];
  }

  get isInteractable() {
    return !this.open;
  }

  interact(actor) {
    this.sprite = chestSprites[1];
    this.open = true;
    this.game.audio.chest();
    this.game.openChest();
    // randomly choose contained item, its normally going to be a potion or
    // treasure and for weapons and armour it is more likely to be a lesser
    // item rather than the best of its class.
    let type = Math.random();
    let item = null;
    if (type < 0.33) {
      item = this.pickTreasure();
    } else if (type < 0.66) {
      item = this.pickPotion();
    } else {
      item = this.pickEquipment();
    }
    if (item === null) {
      console.log("item is null");
      return;
    } else {
      console.log("received:", item.name);
    }
    //this.game.addTextEvent("Received " + item.name);
    this.game.addGraphicEvent(item.sprite,
                              new Vec(this.pos.x, this.pos.y - 1));
    this.game.player.addItem(item);
  }
}

class Stair extends Entity {
  constructor(position, isExit, game) {
    super(position, null, OBJECT, game);
    if (isExit) {
      this.sprite = exitStairSprite;
    }
    else {
      this.sprite = entryStairSprite;
    }
    this.isExit = isExit;
  }

  interact(actor) {
    if (!this.isExit)
      return null;
    this.game.loadNextMap();
  }

  get isInteractable() {
    if (this.isExit)
      return true;
    else
      return false;
  }
}

class Ally extends Entity {
  constructor(position, subtype, game) {
    super(position, heroSprites[subtype], OBJECT, game);
    console.log("adding ally at", position);
    this.subtype = subtype;
  }

  interact(actor) {
    this.game.entitiesToCreate.add({ type: HERO,
                                     subtype: this.subtype,
                                     pos: this.position });
    this.game.entitiesToRemove.add(this);
  }

  get isInteractable() {
    return true;
  }
}
