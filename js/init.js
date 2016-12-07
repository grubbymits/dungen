"use strict";

$(document).ready(function() {
  $(".button-collapse").sideNav({
    menuWidth : 5.5 * TILE_SIZE
  });
});

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

  var searchString = window.location.search.substring(1);

  var variableArray = searchString.split('&');
  var playerString = variableArray[0].split('=')[1];
  var playerType = KNIGHT;
  if (playerString == 'mage') {
    playerType = MAGE;
  } else if (playerString == 'rogue') {
    playerType = ROGUE;
  } else if (playerString == 'archer') {
    playerType = ARCHER;
  } else if (playerString == 'warlock') {
    playerType = WARLOCK;
  }

  var mapString = variableArray[1].split('=')[1];
  var mapType;
  if (mapString == 'oldcity') {
    mapType = OLD_CITY;
  } else if (mapString == 'sewer') {
    mapType = SEWER;
  } else if (mapString == 'dungeon') {
    mapType = DUNGEON;
  } else if (mapString == 'catacombs') {
    mapType = CATACOMBS;
  } else {
    mapType = LAIR;
  }

  console.log("init map for", playerString, mapString);

  var UI = theGame.init(playerType, mapType);

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
      //if (new Date().getTime() >= theGame.nextGameTick) {
        //theGame.nextGameTick = new Date().getTime() + theGame.skipTicks;
        updater.next();
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
