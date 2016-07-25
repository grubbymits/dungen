"use strict";

class Entity {
  constructor(position, blocking, sprite, kind, game) {
    this.position = position;
    this.blocking = blocking;
    this.sprite = sprite;
    this.kind = kind;
    this.game = game;
    this.game.map.placeEntity(this.position, this);
  }
  render() {
    this.sprite.render(this.pos.x * TILE_SIZE, this.pos.y * TILE_SIZE, this.game.context);
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

class Chest extends Entity {
  constructor(position, game) {
    super(position, true, chestSprites[0], OBJECT, game);
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
      return potions[ENERGY_POTION];
    } else if (type < 0.55) {
      return potions[HEALTH_POTION];
    } else if (type < 0.65) {
      return potions[DEFENSE_POTION];
    } else if (type < 0.75) {
      return potions[AGILITY_POTION];
    } else if (type < 0.85) {
      return potions[STRENGTH_POTION];
    } else if (type < 0.95) {
      return potions[WISDOM_POTION];
    } else {
      return potions[BIG_HEALTH_POTION];
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
      itemArray = scrolls;
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
    // randomly choose contained item, its normally going to be a potion or
    // treasure and for weapons and armour it is more likely to be a lesser
    // item rather than the best of its class.
    let type = Math.random();
    let item = null;
    if (type < 0.4) {
      item = this.pickTreasure();
    } else if (type < 0.8) {
      item = this.pickPotion();
    } else {
      item = this.pickEquipment();
    }
    if (item === null) {
      console.log("item is null");
      return;
    }
    this.game.addTextEvent(item.name, this.position);
    this.game.player.addItem(item);
  }
}

class Stair extends Entity {
  constructor(position, isExit, game) {
    super(position, true, null, OBJECT, game);
    if (isExit) {
      this.sprite = exitStairSprite;
    }
    else {
      this.sprite = entryStairSprite;
    }
  }
  interact(actor) {
    return null;
  }
  get isInteractable() {
    return true;
  }
}

class Actor extends Entity {
  constructor(health, energy,
              position, sprite, damageSprite, kind, game) {
    super(position, true, sprite, kind, game);
    this.damageSprite = damageSprite;
    this.currentSprite = this.sprite;
    this.currentHealth = health;
    this.maxHealth = health;
    this.currentEnergy = energy;
    this.maxEnergy = energy;
    //this.meleeAttackRange = 3;
    this.level = 1;
    this.id = 0;


    this.walk = new WalkAction(this);
    this.rest = new RestAction(this);
    this.attack = new Attack(this);
    this.findTarget = new FindTarget(this);
    this.primaryAttack = new PrimaryAttack(this);
    this.secondaryAttack = null;
    this.interact = new Interact(this);
    this.nextAction = null;
    this.destination = null;
    this.currentPath = [];
    this.rangeAttack = null;
  }
  get action() {
    // needs to be implemented differently for heros and monsters atm
    return null;
  }
  render() {
    this.currentSprite.render(this.pos.x * TILE_SIZE, this.pos.y * TILE_SIZE, this.game.context);
  }
  get path() {
    return this.currentPath;
  }
  incrementEnergy() {
    if (this.currentEnergy < this.maxEnergy - 1) {
      this.currentEnergy = this.currentEnergy + 2;
    } else if (this.currentEnergy < this.maxEnergy) {
      this.currentEnergy++;
    } else if (this.nextAction == this.rest) {
      this.nextAction = null;
    }
  }
  useEnergy(required) {
    this.currentEnergy = this.currentEnergy - required;
  }
  set energy(energy) {
    this.currentEnergy = energy;
  }
  get health() {
    return this.currentHealth;
  }
  get nextStep() {
    return this.currentPath[0];
  }
  shiftNextStep() {
    this.currentPath.shift();
  }
  setDestination(x, y) {
    let target = this.game.map.getEntity(x, y);
    if (target) {
      if (target.kind == OBJECT) {
        if (target.isInteractable) {
          this.interact.target = target;
          this.nextAction = this.interact;
          return;
        }
      } else if (target.kind != this.kind) {
        this.attack.target = target;
        this.nextAction = this.attack;
        return;
      }
    } else if (!this.game.map.isBlocked(x, y)) {
      console.log("destination set to: ", x, y);
      this.walk.dest = this.game.map.getLocation(x, y).vec;
      this.nextAction = this.walk;
    }
  }
  setRest() {
    this.nextAction = this.rest;
  }
  setAttack(target) {
    this.attack.target = target;
    this.nextAction = this.attack;
  }
  applyEffect(effect) {
    this.game.addEffect(this, effect);
  }
}
