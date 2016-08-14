"use strict";

$(document).ready(function() {
  $(".button-collapse").sideNav({
    menuWidth : 5.5 * TILE_SIZE
  });
});

window.onload = function begin() {
  // Initialise canvas
  var gameCanvas = document.getElementById("gameCanvas");
  //gameCanvas.setAttribute("id", "gameCanvas");
  //document.body.appendChild(gameCanvas);
  gameCanvas.width = MAP_WIDTH_PIXELS * UPSCALE_FACTOR;
  gameCanvas.height = MAP_HEIGHT_PIXELS * UPSCALE_FACTOR;
  //gameCanvas.style.position = 'absolute';
  //gameCanvas.style.zIndex = '-1';
  //gameCanvas.style.left = '0px';
  //gameCanvas.style.top = '0px';
  var gameContext = gameCanvas.getContext("2d");
  gameContext.fillStyle = '#000000';
  gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  console.log("canvas resolution set to: ", gameCanvas.width, "x",
              gameCanvas.height);

  var theGame = new Game(gameContext, gameCanvas.width, gameCanvas.height);

  var searchString = window.location.search.substring(1);
  var variableArray = searchString.split('&');
  var type = variableArray[0].split('=')[1];
  var playerType = KNIGHT;
  if (type == 'mage') {
    playerType = MAGE;
  } else if (type == 'rogue') {
    playerType = ROGUE;
  } else if (type == 'archer') {
    playerType = ARCHER;
  } else if (type == 'warlock') {
    playerType = WARLOCK;
  }

  var UI = theGame.init(playerType);

  function *generator() {
    let actorIdx = 0;
    while(true) {
      let updateActor = false;
      let action = theGame.getAction(actorIdx);
        
      if (action) {
        theGame.applyEffects(actorIdx);
      }
        
      while(action) {
        action = action.perform();
        yield true;
        updateActor = true;
      }
      if (updateActor) {
        actorIdx = (actorIdx + 1) % theGame.actors.length;
      }
      yield;
    }
  }

  // Generator object to control the flow and order of play
  var updater = generator();

  var run = function() {
    if (!document.hasFocus() || theGame.isLoading) {
      if (theGame.isRunning) {
        theGame.pause();
      }
    } else {
      if (!theGame.isRunning) {
        theGame.play();
      }
      // set a maximum game rate
      if (new Date().getTime() >= theGame.nextGameTick) {
        theGame.nextGameTick = new Date().getTime() + theGame.skipTicks;
        updater.next();
        theGame.renderMap();
        theGame.renderEntities();
        UI.renderInfo();
      }
    }
    window.requestAnimationFrame(run);
  };
  run();
};
