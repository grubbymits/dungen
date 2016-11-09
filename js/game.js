"use strict";

class Game {
  constructor(context, overlayContext, width, height) {
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
    this.overlayContext = overlayContext;
    this.level = 1;
    this.isRunning = false;
    this.loading = false;
    this.skipTicks = 1000 / 60;
    this.nextGameTick = (new Date()).getTime();
    this.theMap = null; //new GameMap(width, height, this);
    this.mapGenerator = new MapGenerator(width, height);
    this.audio = new Audio(this);
  }

  get isLoading() {
    return this.loading;
  }

  init(playerType) {
    this.loading = true;
    this.setupMap();

    //let neighbours = this.theMap.getNeighbours(this.mapGenerator.exitStairLoc.vec);
    //let entryVec = neighbours[0];

    let character = this.createHero(this.mapGenerator.entryVec, playerType);
    this.theMap.addVisibleTiles(character.pos, character.vision);

    let player = new Player(character);
    player.addItem(armours[1]);
    player.addItem(helmets[1]);
    player.addItem(swords[1]);
    player.addItem(staffs[1]);
    player.addItem(potions[0]);
    player.addItem(potions[0]);
    this.player = player;
    let UI = new Interface(this.player);
    UI.centreCamera();
    this.loading = false;
    this.renderMap();
    return UI;
  }

  loadNextMap() {
    this.loading = true;
    this.pause();

    // reset stuff
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

    this.setupMap();
    //this.player.currentHero.pos = this.mapGenerator.entryVec;
    this.player.currentHero.reset();
    this.theMap.placeEntity(this.mapGenerator.entryVec, this.player.currentHero);
    this.theMap.addVisibleTiles(this.player.currentHero.pos,
                                this.player.currentHero.vision);
    this.player.UI.centreCamera();

    this.renderMap();
    this.clearOverlay();
    this.renderChanges();
    this.play();
    this.loading = false;
  }

  setupMap() {
    this.mapGenerator.generate(this.level, MAP_WIDTH_PIXELS, MAP_HEIGHT_PIXELS);
    this.theMap = this.mapGenerator.map;
    this.createStair(this.mapGenerator.exitStairLoc, true);
    this.createStair(this.mapGenerator.entryStairLoc, false);

    this.mapGenerator.placeChests();
    for (let loc of this.mapGenerator.chestLocs) {
      this.createChest(loc);
    }

    this.mapGenerator.placeMonsters(this.level, 32);
    for (let monster of this.mapGenerator.monsterPlacements) {
      this.createMonster(monster.vec, monster.type);
    }

    ++this.level;
  }
  
  renderMap() {
    // draw everything
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0,
                          this.theMap.width * TILE_SIZE * UPSCALE_FACTOR,
                          this.theMap.height * TILE_SIZE * UPSCALE_FACTOR);
    for (var x = 0; x < this.theMap.width; x++) {
      for (var y = 0; y < this.theMap.height; y++) {
        let loc = this.theMap.getLocation(x,y);
        if (loc.type != CEILING) {
          //this.context.fillStyle = '#000000';
          //this.context.fillRect(x * TILE_SIZE * UPSCALE_FACTOR,
            //                    y * TILE_SIZE * UPSCALE_FACTOR,
              //                  TILE_SIZE * UPSCALE_FACTOR,
                //                TILE_SIZE * UPSCALE_FACTOR);
          var type = loc.type;
          tileSprites[type].render(x * TILE_SIZE, y * TILE_SIZE , this.context);
          //loc.dirty = false;
        }
      }
    }
  }

  clearOverlay() {
    //this.overlayContext.clearRect(0, 0,
      //                            this.theMap.width * TILE_SIZE * UPSCALE_FACTOR,
        //                          this.theMap.height * TILE_SIZE * UPSCALE_FACTOR);
    this.overlayContext.fillStyle = '#000000';
    this.overlayContext.fillRect(0, 0,
                                 this.theMap.width * TILE_SIZE * UPSCALE_FACTOR,
                                 this.theMap.height * TILE_SIZE * UPSCALE_FACTOR);
  }

  renderChanges() {
    while (this.theMap.newVisible.length > 0) {
      let vec = this.theMap.newVisible.pop();
      this.overlayContext.clearRect(vec.x * TILE_SIZE * UPSCALE_FACTOR,
                                    vec.y * TILE_SIZE * UPSCALE_FACTOR,
                                    TILE_SIZE * UPSCALE_FACTOR,
                                    TILE_SIZE * UPSCALE_FACTOR);
    }

    this.overlayContext.globalAlpha = 0.5;
    this.overlayContext.fillStyle = '#000000';
    while (this.theMap.newPartialVisible.length > 0) {
      let vec = this.theMap.newPartialVisible.pop();
      this.overlayContext.clearRect(vec.x * TILE_SIZE * UPSCALE_FACTOR,
                                    vec.y * TILE_SIZE * UPSCALE_FACTOR,
                                    TILE_SIZE * UPSCALE_FACTOR,
                                    TILE_SIZE * UPSCALE_FACTOR);
      this.overlayContext.fillRect(vec.x * TILE_SIZE * UPSCALE_FACTOR,
                                   vec.y * TILE_SIZE * UPSCALE_FACTOR,
                                   TILE_SIZE * UPSCALE_FACTOR,
                                   TILE_SIZE * UPSCALE_FACTOR);
    }
    this.overlayContext.globalAlpha = 1.0;

    while (this.theMap.newDirty.length > 0) {
      let vec = this.theMap.newDirty.pop();
      this.overlayContext.clearRect(vec.x * TILE_SIZE * UPSCALE_FACTOR,
                                    vec.y * TILE_SIZE * UPSCALE_FACTOR,
                                    TILE_SIZE * UPSCALE_FACTOR,
                                    TILE_SIZE * UPSCALE_FACTOR);
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

  addTextEvent(string) {
    this.player.UI.addEvent(new TextEvent(string, new Date().getTime()));
  }

  addGraphicEvent(sprite, pos) {
    this.player.UI.addEvent(new GraphicEvent(this.overlayContext, new Date().getTime(),
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
    this.theMap.placeEntity(pos, monster);
    this.currentEffects.set(monster, []);
    ++this.totalMonsters;
    return monster;
  }

  createChest(loc) {
    let chest = new Chest(loc.vec, this);
    this.objects.push(chest);
    this.theMap.placeEntity(loc.vec, chest);
    ++this.totalChests;
  }

  createStair(loc, isExit) {
    let stair = new Stair(loc.vec, isExit, this);
    this.objects.push(stair);
    this.theMap.placeEntity(loc.vec, stair);
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
