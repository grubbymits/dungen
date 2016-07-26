"use strict";

class Game {
  constructor(context, width, height) {
    console.log("Game.constructor");
    this.actors = [];
    this.heroes = [];
    this.currentEffects = new Map();
    this.objects = [];
    this.context = context;
    this.level = 0;
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
    this.addPlayer(player);
    let UI = new Interface(this.player);
    UI.centreCamera();
    this.loading = false;
    return UI;
  }

  setupMap() {
    this.loading = true;
    this.pause();

    // reset stuff
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.width, this.height);
    this.actors = [];
    this.objects = [];
    this.currentEffects.clear();

    // re-add the heroes
    for (let hero of this.heroes) {
      this.actors.push(hero);
    }

    ++this.level;
    let startPos = this.theMap.generate(this.level);
    this.player.currentHero.pos = startPos;
    this.play();
    this.loading = false;
  }

  renderMap() {
    // draw everything
    for (var x = 0; x < this.theMap.width; x++) {
      for (var y = 0; y < this.theMap.height; y++) {
        let loc = this.theMap.getLocation(x,y);
        if (loc.dirty && loc.type != CEILING) {
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

  addPlayer(player) {
    this.player = player;
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
    return hero;
  }

  createMonster(pos, type) {
    let monster = null;
    if (type == RAT) {
      monster = new Rat(pos, this);
    }
    else if (type == SPIDERS) {
      monster = new Spiders(pos, this);
    }
    else if (type == LIZARD) {
      monster = new Lizard(pos, this);
    }
    else if (type == SPIDER_CHAMPION) {
      monster = new SpiderChampion(pos, this);
    }
    this.actors.push(monster);
    this.currentEffects.set(monster, []);
    this.theMap.placeEntity(pos, monster);
    return monster;
  }

  placeMonsters(number) {
    console.log("placing", number, "monsters");
    var monsters = 0;
    while (monsters < number) {
      let x = getBoundedRandom(1, this.theMap.xMax);
      let y = getBoundedRandom(1, this.theMap.yMax);
      let loc = this.theMap.getLocation(x, y);
      if (!loc.isBlocked && !loc.isOccupied) {
        let type = getBoundedRandom(RAT, TOAD);
        this.createMonster(loc.vec, type);
        monsters++;
      }
    }
  }

  createChest(loc) {
    if (!loc.isBlocked && !loc.isOccupied) {
      this.objects.push(new Chest(loc.vec, this));
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

  renderEntities() {
    for (let actor of this.actors) {
      actor.render();
    }
    for (let object of this.objects) {
      object.render();
    }
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
