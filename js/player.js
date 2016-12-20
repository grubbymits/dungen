class Player {
  constructor(game, UI) {
    this.currentHero = null;
    this.game = game;
    this.UI = UI;
    this.heroes = [];
    this.shields = new Map();
    this.helmets = new Map();
    this.armours = new Map();
    this.swords = new Map();
    this.staffs = new Map();
    this.axes = new Map();
    this.bows = new Map();
    this.arrows = new Map();
    this.throwing = new Map();
    this.spells = new Map();
    this.potions = new Map();
    this.treasure = new Map();
    this.groupControl = true;
  }

  increaseExp(exp) {
    for (let hero of this.heroes) {
      let text = hero.name + " gains " + exp + "xp";
      this.game.addTextEvent(text);
      if (hero.increaseExp(exp)) {
        this.UI.levelUp(hero);
      }
    }
  }

  get hasGroupControl() {
    return this.groupControl;
  }

  set hasGroupControl(control) {
    this.groupControl = control;
    console.log("setting group", control);
    if (!control) {
      for (let hero of this.heroes) {
        hero.unfollow();
      }
    } else {
      for (let hero of this.heroes) {
        if (hero == this.leadHero) {
          continue;
        }
        hero.follow(this.leadHero);
      }
      this.currentHero = this.leadHero;
    }
  }

  init(hero) {
    console.log("init player:", hero);
    this.currentHero = hero;
    this.leadHero = hero;
    this.UI.initNav(hero);
  }

  addHero(hero) {
    this.heroes.push(hero);
    this.addItem(hero.primary);
    this.addItem(hero.secondary);
    if (hero.armour) {
      this.addItem(hero.armour);
    }
    if (hero.helmet) {
      this.addItem(hero.helmet);
    }
    if (hero.ring) {
      this.addItem(hero.ring);
    }
    this.UI.addHero(hero);
  }

  addItem(item) {
    let number = 1;
    let items;
    switch(item.type) {
      default:
      console.error("unhandled item type in Player.addItem");
      break;
      case ARMOUR:
      items = this.armours;
      break;
      case HELMET:
      items = this.helmets;
      break;
      case SHIELD:
      items = this.shields;
      break;
      case SWORD:
      items = this.swords;
      break;
      case STAFF:
      items = this.staffs;
      break;
      case AXE:
      items = this.axes;
      break;
      case ARROWS:
      items = this.arrows;
      break;
      case THROWING:
      items = this.throwing;
      break;
      case BOW:
      items = this.bows;
      break;
      case SPELL:
      items = this.spells;
      break;
      case POTION:
      items = this.potions;
      break;
      case TREASURE:
      items = this.treasure;
      break;
    }
    if (items.has(item)) {
      number += items.get(item);
    }
    items.set(item, number);
    if (item.type != TREASURE && item.type != POTION) {
      // at the beginning, the UI would not have been defined and the equipment
      // list will be populated once it is.
      if (this.currentHero !== null) {
        this.UI.refreshEquipmentLists(this.currentHero);
      }
    }
  }

  setDestination(x, y) {
    let loc = this.game.theMap.getLocation(x, y);
    if (loc.isHidden) {
      return;
    }
    this.currentHero.setDestination(loc.vec);
  }

  setRest() {
    for (let hero of this.heroes) {
      hero.setRest();
    }
  }
  
  comparePotions(a, b) {
    return a.strength - b.strength;
  }
  
  healHero() {
    // This function is called from a click event on the heal button.
    // This is a quick shortcut to healing, instead of using the menu,
    // So we need to choose the smallest potion that is going to heal
    // the current hero.
    let potion = potions[0];
    let healthRequired = this.currentHero.maxHealth - this.currentHero.currentHealth;
    let candidates = [];
    
    for (let potion of this.potions.keys()) {
      console.log("potion:", potion);
      let type = potion.subtype;
      if (type == BASIC_HEALTH_POTION ||
          type == HEALTH_POTION ||
          type == BIG_HEALTH_POTION ||
          type == REGENERATION_POTION) {
        if (potion.strength >= healthRequired && this.potions.get(potion) > 0) {
          candidates.push(potion);
        }
      }
    }
    candidates.sort(this.comparePotions);
    if (!candidates.length) {
      console.log("no available health potions");
      return;
    }
    let chosen = candidates[0];
    let newVal = this.potions.get(chosen) - 1;
    this.potions.set(chosen, newVal);
    this.currentHero.takePotion(candidates[0]);
  }
}
