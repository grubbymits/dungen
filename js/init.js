"use strict";

function begin() {
  // Initialise canvas
  var gameCanvas = document.createElement("canvas");
  gameCanvas.setAttribute("id", "gameCanvas");
  document.body.appendChild(gameCanvas);
  gameCanvas.width = MAP_WIDTH_PIXELS * UPSCALE_FACTOR;
  gameCanvas.height = MAP_HEIGHT_PIXELS * UPSCALE_FACTOR;
  gameCanvas.style.position = 'absolute';
  gameCanvas.style.zIndex = '-1';
  gameCanvas.style.left = '0px';
  gameCanvas.style.top = '0px';
  var gameContext = gameCanvas.getContext("2d");
  gameContext.fillStyle = '#000000';
  gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

  var theGame = new Game(gameContext, MAP_WIDTH_PIXELS, MAP_HEIGHT_PIXELS);
  var mapGen = new MapGenerator(MAP_WIDTH_PIXELS / TILE_SIZE,
                                MAP_HEIGHT_PIXELS / TILE_SIZE, 0, 0);
  //mapGen.placeRooms(12);
  //mapGen.createGraph();
  //mapGen.drawRooms(gameContext);
  //return;

  var searchString = window.location.search.substring(1);
  var variableArray = searchString.split('&');
  var type = variableArray[0].split('=')[1];
  var playerType = WARLOCK;
  if (type == 'mage') {
    playerType = MAGE;
  } else if (type == 'rogue') {
    playerType = ROGUE;
  } else if (type == 'archer') {
    playerType = ARCHER;
  } else if (type == 'warlock') {
    playerType = WARLOCK;
  }

    var startPos = theGame.map.getLocation(theGame.map.width / 2, theGame.map.height / 2).vec;
    var character = theGame.createHero(startPos, playerType);

    var player = new Player(character);
    var UI = new Interface(player);
    player.addItem(armours[1]);
    player.addItem(helmets[2]);
    player.addItem(swords[3]);
    player.addItem(potions[0]);
    UI.centreCamera(null);
    theGame.addPlayer(player);
    theGame.placeMonsters(10);
    theGame.placeChests(2);

    function *generator() {
      let actor = 0;
      while(true) {
        let updateActor = false;
        let action = theGame.getAction(actor);
        
        if (action) {
          theGame.applyEffects(actor);
        }
        
        while(action) {
          action = action.perform();
          yield true;
          updateActor = true;
        }
        if (updateActor) {
          actor = (actor + 1) % theGame.actors.length;
        }
        yield;
      }
    }

    // Generator object to control the flow and order of play
    var updater = generator();

    var run = function() {
      if (!document.hasFocus()) {
        theGame.pause();
      } else {
        theGame.play();
        // set a maximum game rate
        if (new Date().getTime() >= theGame.nextGameTick) {
          updater.next();
          theGame.nextGameTick = new Date().getTime() + theGame.skipTicks;
          theGame.renderMap();
          theGame.renderEntities();
          UI.renderInfo();
          UI.renderHUD();
        }
      }
      window.requestAnimationFrame(run);
    };
    run();
  }
