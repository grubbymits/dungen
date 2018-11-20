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
  var background = mapCanvas.getContext("2d");
  background.fillStyle = '#000000';
  background.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
  console.log("canvas resolution set to: ", mapCanvas.width, "x",
              mapCanvas.height);

  var foregroundCanvas = document.getElementById("foregroundCanvas");
  foregroundCanvas.width = MAP_WIDTH_PIXELS * UPSCALE_FACTOR;
  foregroundCanvas.height = MAP_HEIGHT_PIXELS * UPSCALE_FACTOR;
  var foreground = foregroundCanvas.getContext("2d");
  foreground.fillStyle = '#000000';
  foreground.fillRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);
  console.log("canvas resolution set to: ", foregroundCanvas.width, "x",
              foregroundCanvas.height);

  var overlayCanvas = document.getElementById("overlayCanvas");
  overlayCanvas.width = MAP_WIDTH_PIXELS * UPSCALE_FACTOR;
  overlayCanvas.height = MAP_HEIGHT_PIXELS * UPSCALE_FACTOR;
  var overlay = overlayCanvas.getContext("2d");
  overlay.fillStyle = '#000000';
  overlay.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  var theGame = new Game(background, foreground, overlay, mapCanvas.width,
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

      if (actorIdx >= theGame.numActors) {
        actorIdx = actorIdx % theGame.numActors;
      }

      let actor = theGame.actors[actorIdx];

      if (actor.kind == HERO && !actor.isFollowing) {
        player.currentHero = actor;
      }

      let action = theGame.getAction(actorIdx);
      if (action) {
        theGame.updateActor(actor);
      }
        
      while(action && (Date.now() >= actor.nextUpdate)) {
        if (actor.currentHealth < 1) {
          updateActor = true;
          break;
        }
        action = action.perform();
        yield true;
        updateActor = true;
      }

      if (updateActor) {
        actor.lastPerformed = Date.now();
        actorIdx = (actorIdx + 1) % theGame.numActors;
      }

      yield;
    }
  }

  // Generator object to control the flow and order of play
  var updater = generator();

  var run = function() {
    if (theGame.isLoading) {
      // do nothing
    } else if (!document.hasFocus()) {
      theGame.pause();
    } else if (document.hasFocus() && theGame.isPaused) {
      theGame.play();
    } else if (theGame.isRunning) {
      theGame.render();
      UI.renderInfo();
      updater.next();
      theGame.update();
    } else {
      // Game over.
      theGame.render();
      UI.renderInfo();
    }
    window.requestAnimationFrame(run);
  };
  $('#load_bar').hide();
  window.requestAnimationFrame(run);
};
