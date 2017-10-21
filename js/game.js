"use strict";

const PAUSED = 0;
const RUNNING = 1;
const LOADING = 2;
const OVER = 3;

class Game {
  constructor(context, overlayContext, width, height) {
    this.actors = [];
    this.heroes = new Set();
    this.monsters = new Set();
    this.currentEffects = new Map();
    this.objects = new Set();
    this.entitiesToRemove = new Set();
    this.entitiesToCreate = new Set();
    this.totalChests = 0;
    this.openChests = 0;
    this.totalMonsters = 0;
    this.monstersKilled = 0;
    this.context = context;
    this.overlayContext = overlayContext;
    this.level = 1;
    this.status = PAUSED;
    this.skipTicks = 1000/ 30;
    this.nextGameTick = Date.now();
    this.theMap = null;
    this.width = width;
    this.height = height;
    this.audio = new Audio(this);
  }

  saveItems(itemMap, name) {
    let itemArray = [];
    for (let [key, value] of itemMap) {
      itemArray.push({ subtype: key.subtype, amount: value });
    }
    localStorage.setItem(name, JSON.stringify(itemArray));
  }

  saveGame() {
    console.log("save game");
    localStorage.setItem("mapType", this.mapGenerator.type);
    localStorage.setItem("level", this.level);

    this.saveItems(this.player.helmets, "helmets");
    this.saveItems(this.player.armours, "armours");
    this.saveItems(this.player.swords, "swords");
    this.saveItems(this.player.staffs, "staffs");
    this.saveItems(this.player.bows, "bows");
    this.saveItems(this.player.axes, "axes");
    this.saveItems(this.player.throwing, "throwing");
    this.saveItems(this.player.arrows, "arrows");
    this.saveItems(this.player.shields, "shields");
    this.saveItems(this.player.spells, "spells");

    console.log("number of heroes to save:", this.heroes.size);
    localStorage.setItem("numHeroes", this.heroes.size);
    let i = 0;
    for (let hero of this.heroes.values()) {
      console.log("saving hero.");
      //let hero = this.heroes[i];
      localStorage.setItem("hero" + i, JSON.stringify({
        subtype : hero.subtype,
        level : hero.level,
        exp : hero.currentExp,
        expToNext : hero.expToNextLvl,
        health : hero.maxHealth,
        energy : hero.maxEnergy,
        strength : hero.strength,
        agility : hero.agility,
        wisdom : hero.wisdom,
        will : hero.will,
        endurance : hero.endurance,
        vision : hero.vision,
        primaryType : hero.primary.type,
        primarySubtype : hero.primary.subtype,
        secondaryType : hero.secondary.type,
        secondarySubtype : hero.secondary.subtype,
        armourType : hero.equipArmour.type,
        armourSubtype : hero.equipArmour.subtype,
        helmetType : hero.equipHelmet.type,
        helmetSubtype : hero.equipHelmet.subtype }));  
    }
  }

  loadItems(itemMap, name, itemArray) {
    let items = JSON.parse(localStorage.getItem(name));
    for (let item of items) {
      let newItem = itemArray[item.subtype];
      itemMap.set(newItem, item.amount);
    }
  }

  loadGame(player) {
    this.status = LOADING;
    this.player = player;
    this.level = localStorage.getItem("level");
    let mapType = localStorage.getItem("mapType");
    let numHeroes = localStorage.getItem("numHeroes");
    this.mapGenerator = createGenerator(mapType, this.width, this.height);
    this.setupMap(numHeroes);
    if (this.mapGenerator.entryVecs.length === 0) {
      throw("entryVecs not populated");
    }

    this.loadItems(this.player.armours, "armours", armours);
    this.loadItems(this.player.helmets, "helmets", helmets);
    this.loadItems(this.player.swords, "swords", swords);
    this.loadItems(this.player.staffs, "staffs", staffs);
    this.loadItems(this.player.bows, "bows", bows);
    this.loadItems(this.player.axes, "axes", axes);
    this.loadItems(this.player.throwing, "throwing", throwing);
    this.loadItems(this.player.arrows, "arrows", arrows);
    this.loadItems(this.player.shields, "shields", shields);
    this.loadItems(this.player.spells, "spells", spells);

    for (let i = 0; i < numHeroes; ++i) {
      let stats = JSON.parse(localStorage.getItem("hero" + i));
      let pos = this.mapGenerator.entryVecs[i];
      let isFollowing = i == 0 ? false : true;
      let hero = this.createHero(pos, stats.subtype, isFollowing);

      hero.level = stats.level;
      hero.currentExp = stats.exp;
      hero.expToNextLevel = stats.expToNext;
      hero.maxHealth = stats.health;
      hero.maxEnergy = stats.energy;
      hero.strength = stats.strength;
      hero.agility = stats.agility;
      hero.wisdom = stats.wisdom;
      hero.will = stats.will;
      hero.endurance = stats.endurance;
      hero.vision = stats.vision;

      if (stats.primaryType == SWORD) {
        hero.equipPrimary = swords[stats.primarySubtype];
      } else if (stats.primaryType == BOW) {
        hero.equipPrimary = bows[stats.primarySubtype];
      } else if (stats.primaryType == STAFF) {
        hero.equipPrimary = staffs[stats.primarySubtype];
      } else {
        throw("unhandled primary type");
      }
      if (stats.secondaryType == SHIELD) {
        hero.equipSecondary = shields[stats.secondarySubtype];
      } else if (stats.secondaryType == ARROWS) {
        hero.equipSecondary = arrows[stats.secondarySubtype];
      } else if (stats.secondaryType == THROWING) {
        hero.equipSecondary = throwing[stats.secondarySubtype];
      } else if (stats.secondaryType == SPELL) {
        hero.equipSecondary = spells[stats.secondarySubtype];
      } else {
        throw("unhandled secondary type");
      }
      hero.equipArmour = armours[stats.armourSubtype];
      hero.equipHelmet = helmets[stats.helmetSubtype];
      if (i == 0) {
        this.player.init(hero);
      }
    }
    this.status = PAUSED;
    this.renderBegin();
  }

  init(player, playerType, mapType) {
    this.status = LOADING;
    this.player = player;
    this.mapGenerator = createGenerator(mapType, this.width, this.height);
    this.setupMap(1);

    if (this.mapGenerator.entryVecs.length == 0) {
      throw("entryVecs not populated");
    }
    let character = this.createHero(this.mapGenerator.entryVecs[0], playerType, false);
    this.player.init(character);
    this.status = PAUSED;
    this.renderBegin();
  }

  loadNextMap() {
    console.log("load next map");
    this.saveGame();
    this.status = LOADING;
    this.pause();

    // reset stuff
    this.actors = [];
    this.objects.clear();
    this.monsters.clear();
    this.entitiesToRemove.clear();
    this.entitiesToCreate.clear();
    this.totalChests = 0;
    this.openChests = 0;
    this.totalMonsters = 0;
    this.monstersKilled = 0;
    this.currentEffects.clear();


    this.setupMap(this.heroes.size);
    // re-add the heroes
    for (let hero of this.heroes.values()) {
      hero.reset();
      hero.pos = this.mapGenerator.entryVecs.pop();
      this.theMap.placeEntity(hero.pos, hero);
      this.actors.push(hero);
      this.currentEffects.set(hero, new Set());
    }
    this.player.UI.centreCamera();

    this.status = PAUSED;
    this.renderBegin();
  }

  setupMap(numHeroes) {
    console.log("setup map for number of heroes:", numHeroes);
    this.mapGenerator.generate(this.level, MAP_WIDTH_PIXELS, MAP_HEIGHT_PIXELS,
                               numHeroes);
    this.theMap = this.mapGenerator.map;

    let stair = new Stair(this.mapGenerator.exitStairLoc.vec, true, this);
    this.addObject(stair, this.mapGenerator.exitStairLoc);
    stair = new Stair(this.mapGenerator.entryStairLoc.vec, false, this);
    this.addObject(stair, this.mapGenerator.entryStairLoc);

    this.mapGenerator.placeChests();

    for (let resEntity of this.mapGenerator.reservedLocs) {
      let loc = resEntity.loc;
      switch(resEntity.type) {
      case CHEST:
        this.createChest(loc);
        break;
      case SKULL:
        let skull = new Skull(loc.vec, this);
        this.addObject(skull, loc);
        break;
      case TOMBSTONE:
        let tombstone = new Tombstone(loc.vec, this);
        this.addObject(tombstone, loc);
        break;
      case SIGN:
        let sign = new Sign(loc.vec, this);
        this.addObject(sign, loc);
        break;
      case MAGICAL_OBJ:
        let object = new MagicalObject(loc.vec, this);
        this.addObject(object, loc);
        break;
      case ALLY:
        let newAllies = new Set([ARCHER, ROGUE, MAGE, KNIGHT]);; 
        for (let hero of this.heroes) {
          newAllies.delete(hero.subtype);
        }
        do {
          var allyType = getBoundedRandom(ROGUE, BLACK_MAGE);
          var found = newAllies.has(allyType);
        } while (!found);

        let ally = new Ally(loc.vec, allyType, this);
        this.addObject(ally, loc);
        break;
      }
    }

    let numMonsters = getBoundedRandom(45, 32);
    this.mapGenerator.placeMonsters(this.level, numMonsters);
    for (let monster of this.mapGenerator.monsterPlacements) {
      this.createMonster(monster.vec, monster.type);
    }

    ++this.level;
  }
  
  createHero(pos, type, isFollowing) {
    var hero;
    if (type == KNIGHT) {
      hero = new Knight(pos, this);
    } else if (type == MAGE) {
      hero = new Mage(pos, this);
    } else if (type == ROGUE) {
      hero = new Rogue(pos, this);
    } else if (type == ARCHER) {
      hero = new Archer(pos, this);
    } else if (type == WARLOCK) {
      hero = new Warlock(pos, this);
    } else {
      throw("Hero type unrecognised!");
    }
    if (isFollowing) {
      hero.follow(this.player.currentHero);
    }
    this.actors.push(hero);
    this.heroes.add(hero);
    this.currentEffects.set(hero, new Set());
    this.theMap.placeEntity(pos, hero);
    this.player.addHero(hero);
    return hero;
  }

  createMonster(pos, type) {
    let monster = null;
    switch(type) {
      case RAT:
        monster = new Rat(pos, this);
        break;
      case SPIDERS:
        monster = new Spiders(pos, this);
        break;
      case RABBIT:
        monster = new Rabbit(pos, this);
        break;
      case BAT:
        monster = new Bat(pos, this);
        break;
      case LIZARD:
        monster = new Lizard(pos, this);
        break;
      case MUSHROOM:
        monster = new Mushroom(pos, this);
        break;
      case SPIDER_CHAMPION:
        monster = new SpiderChampion(pos, this);
        break;
      case BAT_CHAMPION:
        monster = new BatChampion(pos, this);
        break;
      case TOAD:
        monster = new Toad(pos, this);
        break;
      case CENTIPEDE:
        monster = new Centipede(pos, this);
        break;
      case SNAKE:
        monster = new Snake(pos, this);
        break;
      case SERPENT:
        monster = new Serpent(pos, this);
        break;
      case SCARAB:
        monster = new Scarab(pos, this);
        break;
      case ZOMBIE:
        monster = new Zombie(pos, this);
        break;
      case SCORPION:
        monster = new Scorpion(pos, this);
        break;
      case UNDEAD:
        monster = new Undead(pos, this);
        break;
      case WOLF:
        monster = new Wolf(pos, this);
        break;
      case WEREWOLF:
        monster = new Werewolf(pos, this);
        break;
      case SLIMES:
        monster = new Slimes(pos, this);
        break;
      case SLIME_CHAMPION:
        monster = new SlimeChampion(pos, this);
        break;
      case GOBLIN:
        monster = new Goblin(pos, this);
        break;
      case ORC:
        monster = new Orc(pos, this);
        break;
      case VAMPIRE:
        monster = new Vampire(pos, this);
        break;
      case MUMMY:
        monster = new Mummy(pos, this);
        break;
      case CYCLOPS:
        monster = new Cyclops(pos, this);
        break;
      case BOAR:
        monster = new Boar(pos, this);
        break;
      case WRAITH:
        monster = new Wraith(pos, this);
        break;
      case BEAR:
        monster = new Bear(pos, this);
        break;
      case KRAKEN:
        monster = new Kraken(pos, this);
        break;
      case GOLEM:
        monster = new Golem(pos, this);
        break;
      case CARABIA:
        monster = new Carabia(pos, this);
        break;
      case DEMON:
        monster = new Demon(pos, this);
        break;
      default:
        throw("unhandled monster type!");
    }
    this.actors.push(monster);
    this.monsters.add(monster);
    this.theMap.placeEntity(pos, monster);
    this.currentEffects.set(monster, new Set());
    ++this.totalMonsters;
    this.map.getLocation(pos.x, pos.y).blocked = false;
    return monster;
  }


  createChest(loc) {
    let chest = new Chest(loc.vec, this);
    ++this.totalChests;
    this.addObject(chest, loc);
  }

  addObject(object, loc) {
    this.objects.add(object);
    this.theMap.placeEntity(object.pos, object);
    loc.blocked = false;
  }

  removeEntity(entity) {
    // TODO Having a single array for actors is only used because its
    // the way of stepping through actors in the game loop. The hero
    // and monster arrays are generally used but then we have duplicate
    // references. And maybe more useful to use a set for these.
    if (entity.kind == MONSTER) {
      ++this.monstersKilled;
      console.log("deleting monster:", entity);
      this.monsters.delete(entity);
      this.theMap.removeEntity(entity.position);
    } else if (entity.kind == HERO) {
      if (this.heroes.length == 1) {
        console.log("removing only hero");
        this.status = OVER;
        this.player.UI.gameOver();
      }
      console.log("deleting hero:", entity);
      this.heroes.delete(entity);
      this.theMap.removeEntity(entity.position);
    } else if (entity.kind == OBJECT) {
      console.log("deleting object:", entity);
      this.objects.delete(entity);
      this.theMap.removeEntity(entity.position);
      return;
    } else {
      console.log(entity);
      throw("why is this happening?");
    }

    for (let index in this.actors) {
      if (this.actors[index] == entity) {
        delete this.actors[index];
        this.actors.splice(index, 1);
      }
    }
  }

  getAction(actor) {
    return this.actors[actor].action;
  }

  addEffect(actor, effect) {
    if (!this.currentEffects.has(actor)) {
      console.log("actor isn't in current effects.");
      return;
    }
    this.currentEffects.get(actor).add(effect);
  }

  applyEffects(index) {
    let actor = this.actors[index];
    if (this.currentEffects.has(actor)) {
      let effects = this.currentEffects.get(actor);
      for (let effect of effects.values()) {
        let expired = effect.cause(actor);
        if (expired) {
          effects.delete(effect);
        }
      }
    } else {
      console.log("actor isn't in effects.");
    }
    // Each actor receives some EP at the beginning of their turn.
    if (actor.currentEnergy < actor.maxEnergy - 1) {
      actor.currentEnergy = actor.currentEnergy + 2;
    } else if (actor.currentEnergy < actor.maxEnergy) {
      actor.currentEnergy++;
    }
  }

  openChest() {
    ++this.openChests;
  }
  
  get map() {
    return this.theMap;
  }

  update() {
    for (let entity of this.entitiesToRemove.values()) {
      this.removeEntity(entity);
    }
    for (let entity of this.entitiesToCreate.values()) {
      if (entity.type == HERO) {
        this.createHero(entity.pos, entity.subtype, true);
      }
    }
    this.entitiesToRemove.clear();
    this.entitiesToCreate.clear();
  }

  get isRunning() {
    return this.status === RUNNING;
  }

  get isPaused() {
    return this.status === PAUSED;
  }

  get isLoading() {
    return this.status === LOADING;
  }

  pause() {
    if (this.status !== LOADING) {
      this.status = PAUSED;
    }
    this.audio.pauseMusic();
  }

  play() {
    this.status = RUNNING;
    this.audio.playMusic();
  }

  renderBegin() {
    this.renderer = new Renderer(this.context, this.overlayContext, this.map,
                                 this.actors, this.objects);
    this.renderer.renderMap(this.mapGenerator.symbolLocs);
    this.renderer.clearOverlay();
    this.renderer.renderChanges();
    this.renderer.renderEntities(this.player.currentHero);
  }

  render() {
    this.renderer.renderChanges();
    this.renderer.renderEntities(this.player.currentHero);
  }

  addAnimationEvent(actor, pos, dest) {
    this.player.UI.addEvent(new AnimationEvent(actor, pos, dest, this.theMap));
  }

  addSpriteChangeEvent(actor, sprite) {
    this.player.UI.addEvent(new SpriteChangeEvent(actor, sprite));
  }

  addTextEvent(string) {
    this.player.UI.addEvent(new TextEvent(string));
  }

  addGraphicEvent(sprite, pos) {
    this.player.UI.addEvent(new GraphicEvent(this.overlayContext, pos,
                                             sprite));
  }

  addPathEvent(path) {
    this.player.UI.addEvent(new PathEvent(this.overlayContext, path));
  }
}
