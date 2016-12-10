"use strict";

class Entity {
  constructor(position, sprite, kind, game) {
    this.position = position;
    this.sprite = sprite;
    this.kind = kind;
    this.game = game;
  }
  render() {
    this.sprite.render(this.pos.x * TILE_SIZE,
                       this.pos.y * TILE_SIZE,
                       this.game.overlayContext);
  }
  get pos() {
    return this.position;
  }
  set pos(pos) {
    this.position = pos;
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
    // equipment, there are 10 types including spells and jewelry.
    let type = Math.random();
    let itemArray = null;
    let itemType = 0;
    if (type < 0.1) {
      itemArray = armours;
    } else if (type < 0.2) {
      itemArray = helmets;
    } else if (type < 0.3) {
      itemArray = shields;
    } else if (type < 0.4) {
      itemArray = swords;
    } else if (type < 0.5) {
      itemArray = axes;
    } else if (type < 0.6) {
      itemArray = staffs;
    } else if (type < 0.7) {
      itemArray = bows;
    } else if (type < 0.8) {
      itemArray = spells;
    } else if (type < 0.9) {
      // jewelry
    } else {
      // ammunition
    }
    if (itemArray === null) {
      return null;
    }
    // TODO more rare items need to become less rare as the game progresses and
    // actually rare at the start!
    return itemArray[getBoundedRandom(itemArray.length, 0)];
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
    this.game.addTextEvent("Received " + item.name);
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
    this.game.entitiesToCreate.push({ type: HERO, subtype: this.subtype, pos: this.position });
    this.game.entitiesToRemove.push(this);
  }

  get isInteractable() {
    return true;
  }
}
