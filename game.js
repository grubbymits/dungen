"use strict";

class Game {
  constructor(context, width, height) {
    console.log("Game.constructor");
    this.actors = [];
    this.context = context;
    this.level = 1;
    this.isRunning = false;
    this.skipTicks = 1000 / 1;
    this.nextGameTick = (new Date()).getTime();
    this.theMap = new GameMap(width, height);
    this.theMap.generate();
    console.log("isRunning = ", this.isRunning);
  }

  renderMap() {
    // draw everything
    for (var x = 0; x < this.theMap.xMax; x++) {
      for (var y = 0; y < this.theMap.yMax; y++) {
        var type = this.map.getLocation(x,y).type;
        tileSprites[type].render(x * TILE_SIZE, y * TILE_SIZE , this.context);
      }
    }
  }

  createHero(pos, type) {
    if (type == KNIGHT) {
      this.hero = new Hero(30, 6, pos, knightSprite, this);
    }
    this.actors.push(this.hero);
    return this.hero;
  }

  createMonster(pos, type) {
    if (type == RAT) {
      this.actors.push(new Rat(pos, this));
    }
  }

  placeMonsters(number) {
  }

  renderActors() {
    for (let actor of this.actors) {
      actor.render();
    }
  }

  get map() {
    return this.theMap;
  }

  update() {
    for (let actor of this.actors) {
      let action = actor.action;
      // this will only work if each non-player character always selects
      // a move (ie, restAction)
      if (!action) {
        return false;
      }
      while(action) {
        action = action.perform();
      }
    }
    return true;
  }
}
