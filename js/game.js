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
    this.width = width;
    this.height = height;
    this.audio = new Audio(this);
  }

  get isLoading() {
    return this.loading;
  }

  init(playerType, mapType) {
    this.loading = true;
    if (mapType == OLD_CITY) {
      this.mapGenerator = new OldCityGenerator(this.width, this.height);
    } else if (mapType == SEWER) {
      this.mapGenerator = new SewerGenerator(this.width, this.height);
    } else if (mapType == DUNGEON) {
      this.mapGenerator = new DungeonGenerator(this.width, this.height);
    } else if (mapType == CATACOMBS) {
      this.mapGenerator = new CatacombsGenerator(this.width, this.height);
    } else {
      this.mapGenerator = new SorcerersLairGenerator(this.width, this.height);
    }
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
    //this.play();
    this.loading = false;
  }

  setupMap() {
    this.mapGenerator.generate(this.level, MAP_WIDTH_PIXELS, MAP_HEIGHT_PIXELS);
    this.theMap = this.mapGenerator.map;
    this.createStair(this.mapGenerator.exitStairLoc, true);
    this.createStair(this.mapGenerator.entryStairLoc, false);

    this.mapGenerator.placeChests();
    console.log("placing chests:", this.mapGenerator.chestLocs.length);
    for (let loc of this.mapGenerator.chestLocs) {
      this.createChest(loc);
    }

    console.log("placing skulls:", this.mapGenerator.skullLocs.length);
    for (let loc of this.mapGenerator.skullLocs) {
      this.createSkull(loc);
    }

    console.log("placing tombstones:", this.mapGenerator.tombstoneLocs.length);
    for (let loc of this.mapGenerator.tombstoneLocs) {
      this.createTombstone(loc);
    }

    console.log("placing signs:", this.mapGenerator.signLocs.length);
    for (let loc of this.mapGenerator.signLocs) {
      this.createSign(loc);
    }

    for (let loc of this.mapGenerator.magicalObjectLocs) {
      this.createMagicalObject(loc);
    }

    this.mapGenerator.placeMonsters(this.level, 32);
    for (let monster of this.mapGenerator.monsterPlacements) {
      this.createMonster(monster.vec, monster.type);
    }

    ++this.level;
  }
  
  renderMap() {
    // draw everything
    //this.overlayContext.clearRect(0, 0,
      //                            this.theMap.width * TILE_SIZE * UPSCALE_FACTOR,
        //                          this.theMap.height * TILE_SIZE * UPSCALE_FACTOR);
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0,
                          this.theMap.width * TILE_SIZE * UPSCALE_FACTOR,
                          this.theMap.height * TILE_SIZE * UPSCALE_FACTOR);
    for (var x = 0; x < this.theMap.width; x++) {
      for (var y = 0; y < this.theMap.height; y++) {
        let type = this.theMap.getLocationType(x,y);
        if (type != CEILING) {
          let spriteIdx = this.theMap.getLocationSprite(x, y);
          tileSprites[spriteIdx].render(x * TILE_SIZE, y * TILE_SIZE , this.context);
        }
      }
    }
    for (let loc of this.mapGenerator.symbolLocs) {
      let spriteIdx = 0;
      if (Math.random() < 0.16) {
        spriteIdx = 0;
      } else if (Math.random() < 0.33) {
        spriteIdx = 1;
      } else if (Math.random() < 0.5) {
        spriteIdx = 2;
      } else if (Math.random() < 0.66) {
        spriteIdx = 3;
      } else if (Math.random() < 0.73) {
        spriteIdx = 4;
      } else if (Math.random() < 0.73) {
        spriteIdx = 5;
      }
      let sprite = symbolSprites[spriteIdx];
      sprite.render(loc.vec.x * TILE_SIZE, loc.vec.y * TILE_SIZE, this.context);
    }
  }

  clearOverlay() {
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
    this.player.UI.addEvent(new TextEvent(string));
  }

  addGraphicEvent(sprite, pos) {
    this.player.UI.addEvent(new GraphicEvent(this.overlayContext, pos, sprite));
  }

  addPathEvent(path) {
    this.player.UI.addEvent(new PathEvent(this.overlayContext, path));
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
    console.log("create", ENEMY_NAMES[type]);
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
      default:
        throw("unhandled monster type!");
    }
    this.actors.push(monster);
    this.monsters.push(monster);
    this.theMap.placeEntity(pos, monster);
    this.currentEffects.set(monster, []);
    ++this.totalMonsters;
    this.map.getLocation(pos.x, pos.y).blocked = false;
    return monster;
  }

  createChest(loc) {
    let chest = new Chest(loc.vec, this);
    this.objects.push(chest);
    this.theMap.placeEntity(loc.vec, chest);
    ++this.totalChests;
    loc.blocked = false;
  }

  createStair(loc, isExit) {
    let stair = new Stair(loc.vec, isExit, this);
    this.objects.push(stair);
    this.theMap.placeEntity(loc.vec, stair);
    loc.blocked = false;
  }

  createSkull(loc) {
    let skull = new Skull(loc.vec, this);
    this.objects.push(skull);
    this.theMap.placeEntity(loc.vec, skull);
    loc.blocked = false;
  }

  createTombstone(loc) {
    let tombstone = new Tombstone(loc.vec, this);
    this.objects.push(tombstone);
    this.theMap.placeEntity(loc.vec, tombstone);
    loc.blocked = false;
  }

  createSign(loc) {
    let sign = new Sign(loc.vec, this);
    this.objects.push(sign);
    this.theMap.placeEntity(loc.vec, sign);
    loc.blocked = false;
  }

  createMagicalObject(loc) {
    let object = new MagicalObject(loc.vec, this);
    this.objects.push(object);
    this.theMap.placeEntity(loc.vec, object);
    loc.blocked = false;
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
