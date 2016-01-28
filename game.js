"use strict";

class Game {
  constructor(context, width, height) {
    console.log("Game.constructor");
    this.actors = [];
    this.context = context;
    this.isRunning = false;
    this.skipTicks = 1000 / 60;
    this.nextGameTick = (new Date()).getTime();
    this.theMap = new GameMap(width, height);
    this.theMap.generate();
    console.log("isRunning = ", this.isRunning);
    //this.prevTime = (new Date()).getTime();
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
  
  get map() {
    return this.theMap;
  }

  update() {
    for (let actor of this.actors) {
      let action = actor.nextAction;
      // this will only work if each non-player character always selects
      // a move (ie, restAction)
      if (action === null) {
        return false;
      }
      while(action !== null) {
        action = action.perform();
      }
    }
    return true;
  }
}
