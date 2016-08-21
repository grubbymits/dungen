"use strict";

class Game {
  constructor(context, width, height) {
    console.log("Game.constructor");
    this.actors = [];
    this.heroes = [];
    this.monsters = [];
    this.currentEffects = new Map();
    this.objects = [];
    this.totalChests = 0;
    this.openChests = 0;
    this.totalMonsters = 0;
    this.monstersKilled = 0;
    this.expGained = 0;
    this.context = context;
    this.level = 1;
    this.isRunning = false;
    this.loading = false;
    this.skipTicks = 1000 / 100;
    this.nextGameTick = (new Date()).getTime();
    this.theMap = new GameMap(width, height, this);
    this.audio = new Audio(this);
  }

  get isLoading() {
    return this.loading;
  }

  init(playerType) {
    this.loading = true;
    let startPos = this.theMap.generate(this.level);
    let character = this.createHero(startPos, playerType);
    let player = new Player(character);
    player.addItem(armours[1]);
    player.addItem(helmets[1]);
    player.addItem(swords[1]);
    player.addItem(staffs[1]);
    this.player = player;
    let UI = new Interface(this.player);
    UI.centreCamera();
    this.loading = false;
    this.renderMap();
    return UI;
  }

  setupMap() {
    this.loading = true;
    this.pause();

    // reset stuff
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.theMap.width * TILE_SIZE, this.theMap.height * TILE_SIZE);
    this.actors = [];
    this.monsters = [];
    this.objects = [];
    this.totalChests = 0;
    this.openChests = 0;
    this.totalMonsters = 0;
    this.monstersKilled = 0;
    this.expGained = 0;
    this.currentEffects.clear();

    // re-add the heroes
    for (let hero of this.heroes) {
      this.actors.push(hero);
    }

    ++this.level;
    let startPos = this.theMap.generate(this.level);
    this.player.currentHero.pos = startPos;
    UI.centreCamera();
    this.play();
    this.loading = false;
  }
  
  renderMap() {
    // draw everything
    for (let hero of this.heroes) {
      this.theMap.addVisibleTiles(hero.pos, hero.vision);
    }
    for (var x = 0; x < this.theMap.width; x++) {
      for (var y = 0; y < this.theMap.height; y++) {
        let loc = this.theMap.getLocation(x,y);
        if (loc.dirty && loc.type != CEILING && loc.isVisible) {
          this.context.fillStyle = '#000000';
          this.context.fillRect(x * TILE_SIZE * UPSCALE_FACTOR,
                                y * TILE_SIZE * UPSCALE_FACTOR,
                                TILE_SIZE * UPSCALE_FACTOR,
                                TILE_SIZE * UPSCALE_FACTOR);
          var type = loc.type;
          tileSprites[type].render(x * TILE_SIZE, y * TILE_SIZE , this.context);
          loc.dirty = false;
        }
      }
    }
  }
  
  renderEntities() {
    for (let actor of this.actors) {
      let loc = this.theMap.getLocation(actor.pos.x, actor.pos.y);
      if (loc.isVisible) {
        actor.render();
      }
    }
    for (let object of this.objects) {
      let loc = this.theMap.getLocation(object.pos.x, object.pos.y);
      if (loc.isVisible) {
        object.render();
      }
    }
  }

  addTextEvent(string, pos) {
    this.player.UI.addEvent(new TextEvent(this.context, new Date().getTime(),
                                          pos, string));
  }

  addGraphicEvent(sprite, pos) {
    this.player.UI.addEvent(new GraphicEvent(this.context, new Date().getTime(),
                                             pos, sprite));
  }

  createHero(pos, type) {
    var hero;
    if (type == KNIGHT) {
      hero = new Knight(pos, this);
      console.log("adding knight");
    } else if (type == MAGE) {
      hero = new Mage(pos, this);
      console.log("adding mage");
    } else if (type == ROGUE) {
      hero = new Rogue(pos, this);
      console.log("adding rogue");
    } else if (type == ARCHER) {
      hero = new Archer(pos, this);
      console.log("adding archer");
    } else if (type == WARLOCK) {
      hero = new Warlock(pos, this);
      console.log("adding warlock");
    } else {
      throw("Hero type unrecognised!");
    }
    this.actors.push(hero);
    this.heroes.push(hero);
    this.currentEffects.set(hero, []);
    this.theMap.placeEntity(pos, hero);
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
      case SPIDER_CHAMPION:
        monster = new SpiderChampion(pos, this);
        break;
      default:
        throw("unhandled monster type!");
    }
    this.actors.push(monster);
    this.monsters.push(monster);
    this.currentEffects.set(monster, []);
    this.theMap.placeEntity(pos, monster);
    ++this.totalMonsters;
    return monster;
  }

  createChest(loc) {
    if (!loc.isBlocked && !loc.isOccupied) {
      this.objects.push(new Chest(loc.vec, this));
      ++this.totalChests;
    }
  }

  createStair(room, isExit) {
    console.log("create stair at", room);
    let x = room.centre.x;
    let y = room.centre.y;
    let loc = this.theMap.getLocation(x, y);
    while ((loc.isBlocked || loc.isOccupied)) {
      x = getBoundedRandom(room.pos.x, room.pos.x + room.width);
      y = getBoundedRandom(room.pos.y, room.pos.y + room.height);
      loc = this.theMap.getLocation(x, y);
    }
    this.objects.push(new Stair(loc.vec, isExit, this));
    return loc;
  }

  killActor(actor) {
    if (actor.kind == MONSTER) {
      ++this.monstersKilled;
      this.expGained += actor.exp;
    }
    for (let index in this.actors) {
      if (this.actors[index] == actor) {
        console.log("killing actor, index:", index);
        this.theMap.removeEntity(this.actors[index].position);
        delete this.actors[index];
        this.actors.splice(index, 1);
      }
    }
  }

  getAction(actor) {
    return this.actors[actor].action;
  }

  addEffect(actor, effect) {
    console.log("addEffect:", effect);
    this.currentEffects.get(actor).push(effect);
  }

  applyEffects(index) {
    let actor = this.actors[index];
    let effects = this.currentEffects.get(actor);
    for (let i in effects) {
      let expired = effects[i].cause(actor);
      if (expired) {
        delete this.currentEffects.get(actor)[i];
        this.currentEffects.get(actor).splice(i, 1);
      }
    }
  }
  
  openChest() {
    ++this.openChests;
  }
  
  get map() {
    return this.theMap;
  }

  pause() {
    this.isRunning = false;
    this.audio.pauseMusic();
  }

  play() {
    this.isRunning = true;
    this.audio.playMusic();
  }
}
