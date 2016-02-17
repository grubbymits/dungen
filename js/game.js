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
        let loc = this.map.getLocation(x,y);
        if (loc.dirty) {
          this.context.fillStyle = '#000000';
          this.context.fillRect(x * TILE_SIZE, y *TILE_SIZE, TILE_SIZE, TILE_SIZE);
          var type = loc.type;
          tileSprites[type].render(x * TILE_SIZE, y * TILE_SIZE , this.context);
          loc.dirty = false;
        }
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
