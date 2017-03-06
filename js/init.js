"use strict";

$(document).ready(function() {
  $(".button-collapse").sideNav({
    menuWidth : 5.5 * TILE_SIZE
  });
});

function getPlayerType(playerString) {
  if (playerString == 'mage') {
    return MAGE;
  } else if (playerString == 'rogue') {
    return ROGUE;
  } else if (playerString == 'archer') {
    return ARCHER;
  } else if (playerString == 'warlock') {
    return WARLOCK;
  }
  return KNIGHT;
}

function getMapType(mapString) {
  if (mapString == 'oldcity') {
    return OLD_CITY;
  } else if (mapString == 'sewer') {
    return SEWER;
  } else if (mapString == 'dungeon') {
    return DUNGEON;
  } else if (mapString == 'catacombs') {
    return CATACOMBS;
  } else {
    return  LAIR;
  }
}

window.onload = function begin() {
  // Initialise canvas
  var mapCanvas = document.getElementById("mapCanvas");
  mapCanvas.width = MAP_WIDTH_PIXELS * UPSCALE_FACTOR;
  mapCanvas.height = MAP_HEIGHT_PIXELS * UPSCALE_FACTOR;
  var mapContext = mapCanvas.getContext("2d");
  mapContext.fillStyle = '#000000';
  mapContext.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
  console.log("canvas resolution set to: ", mapCanvas.width, "x",
              mapCanvas.height);

  var overlayCanvas = document.getElementById("overlayCanvas");
  overlayCanvas.width = MAP_WIDTH_PIXELS * UPSCALE_FACTOR;
  overlayCanvas.height = MAP_HEIGHT_PIXELS * UPSCALE_FACTOR;
  var overlayContext = overlayCanvas.getContext("2d");
  overlayContext.fillStyle = '#000000';
  overlayContext.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  var theGame = new Game(mapContext, overlayContext, mapCanvas.width,
                         mapCanvas.height);
  var UI = new Interface(theGame);
  var player = new Player(theGame, UI);
  UI.init(player);

  var searchString = window.location.search.substring(1);
  var variableArray = searchString.split('&');
  var playerString = variableArray[0].split('=')[1];

  if (playerString == 'continue') {
    theGame.loadGame(player);
  } else {
    let playerType = getPlayerType(playerString);
    let mapString = variableArray[1].split('=')[1];
    let mapType = getMapType(mapString);
    console.log("init map for", playerString, mapString);
    theGame.init(player, playerType, mapType);
  }

  UI.centreCamera();

  function *generator() {
    let actorIdx = 0;
    while(true) {
      let updateActor = false;
      let action = theGame.getAction(actorIdx);

      let actor = theGame.actors[actorIdx];
      if (actor.kind == HERO && !actor.isFollowing) {
        player.currentHero = actor;
      }
      
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
      //if (new Date().getTime() >= theGame.nextGameTick) {
        //theGame.nextGameTick = new Date().getTime() + theGame.skipTicks;
        updater.next();
        theGame.update();
        theGame.renderChanges();
        theGame.renderEntities();
        UI.renderInfo();
      //}
    }
    //window.requestAnimationFrame(run);
  };
  $('#load_bar').hide();
  theGame.renderMap();
  window.setInterval(run, 33);
};
