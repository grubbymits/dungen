"use strict"

class OldCityGenerator extends MapGenerator {
  constructor(width, height) {
    super(width, height, DIRT, PATH);
    // add rat, spiders, bat, rabbit
    // add mushroom
    // add spider champion,
    // add bat champion
    // add snake
    // add scarab
    // add serpent
    // add wolf
    // add boar
    // add bear
    var monsterGroup0 = [ RAT, SPIDERS, BAT, RABBIT];

    var monsterGroup1 = monsterGroup0.slice();
    monsterGroup1.push(MUSHROOM);

    var monsterGroup2 = monsterGroup1.slice();
    monsterGroup2.push(SPIDER_CHAMPION);
    
    var monsterGroup3 = monsterGroup2.slice();
    monsterGroup3.push(BAT_CHAMPION);
    
    var monsterGroup4 = monsterGroup3.slice();
    monsterGroup4.push(SNAKE);

    var monsterGroup5 = monsterGroup4.slice();
    monsterGroup5.push(SCARAB);
    
    var monsterGroup6 = monsterGroup5.slice();
    monsterGroup6.push(SERPENT);

    var monsterGroup7 = monsterGroup6.slice();
    monsterGroup7.push(WOLF);
    
    var monsterGroup8 = monsterGroup7.slice();
    monsterGroup8.push(BOAR);

    var monsterGroup9 = monsterGroup8.slice();
    monsterGroup9.push(BEAR);
    

    this.monsterGroups = [ monsterGroup0,
                           monsterGroup1,
                           monsterGroup2,
                           monsterGroup3,
                           monsterGroup4,
                           monsterGroup5,
                           monsterGroup6,
                           monsterGroup7,
                           monsterGroup8,
                           monsterGroup9
                         ];
  }

  decorate() {
    // use a variety of walls: both brick types and the pillars
    // add door tiles
    for (let x = 0; x < this.map.width; ++x) {
      for (let y = 1; y < this.map.height - 1; ++y) {
        let loc = this.map.getLocation(x, y);
        let locBelow = this.map.getLocation(x, y + 1)

        if (loc.type == WALL) {
          loc.tileSprite = TILE_THIN_BRICK;
          if (x > 0 && x < this.map.width - 1 && y > 2) {
            if (this.map.getLocationType(x - 1, y) == WALL &&
                this.map.getLocationType(x + 1, y) == WALL &&
                this.map.getLocationType(x, y - 2) == CEILING) {
              let random = Math.random();
              if (random < 0.1) {
                loc.tileSprite = TILE_ROUND_DOOR;
              } else if (random < 0.2) {
                loc.tileSprite = TILE_SQUARE_DOOR;
              } else if (random < 0.3) {
                loc.tileSprite = TILE_NARROW_DOOR;
              }
            }
          }
        } else if (loc.type == DIRT) {
          loc.tileSprite = TILE_DIRT;
        } else {
          loc.tileSprite = TILE_LARGE_SQUARE;
        }
      }
    }
    // add some signs
    for (let room of this.rooms) {
      if (Math.random() < 0.33) {
        this.placeSign(room);
      }
    }
  }
}

class SewerGenerator extends MapGenerator {
  constructor(width, height) {
    // Select room floor and path tiles
    super(width, height, WATER, PATH);

    // add rat, spiders, lizard, bat
    // add spider champion,
    // add bat champion
    // add toad
    // add centipede
    // add snake
    // add serpent
    // add slimes
    // add slime champion
    // add kraken
    var monsterGroup0 = [ RAT, SPIDERS, BAT, LIZARD];

    var monsterGroup1 = monsterGroup0.slice();
    monsterGroup1.push(SPIDER_CHAMPION);

    var monsterGroup2 = monsterGroup1.slice();
    monsterGroup2.push(BAT_CHAMPION);
    
    var monsterGroup3 = monsterGroup2.slice();
    monsterGroup3.push(TOAD);
    
    var monsterGroup4 = monsterGroup3.slice();
    monsterGroup4.push(CENTIPEDE);

    var monsterGroup5 = monsterGroup4.slice();
    monsterGroup5.push(SNAKE);
    
    var monsterGroup6 = monsterGroup5.slice();
    monsterGroup6.push(SERPENT);

    var monsterGroup7 = monsterGroup6.slice();
    monsterGroup7.push(SLIMES);
    
    var monsterGroup8 = monsterGroup7.slice();
    monsterGroup8.push(SLIME_CHAMPION);

    var monsterGroup9 = monsterGroup8.slice();
    monsterGroup9.push(KRAKEN);
    

    this.monsterGroups = [ monsterGroup0,
                           monsterGroup1,
                           monsterGroup2,
                           monsterGroup3,
                           monsterGroup4,
                           monsterGroup5,
                           monsterGroup6,
                           monsterGroup7,
                           monsterGroup8,
                           monsterGroup9
                         ];
  }

  decorate() {
    // add grates to some walls that are adjacent to water
    for (let x = 0; x < this.map.width; ++x) {
      for (let y = 1; y < this.map.height - 1; ++y) {
        let loc = this.map.getLocation(x, y);
        let locBelow = this.map.getLocation(x, y + 1)

        if (loc.type == WALL) {
          loc.tileSprite = TILE_THICK_BRICK;
        }

        if (loc.type == WALL && locBelow.type == WATER) {
          let random = Math.random();
          if (random < 0.2) {
            loc.tileSprite = TILE_GRATE;
          } else {
            loc.tileSprite = TILE_THICK_BRICK;
          }
        } else if (loc.type == PATH) {
          loc.tileSprite = TILE_LARGE_CROSS;
        } else if (loc.type == WATER) {
          loc.tileSprite = TILE_WATER;
        }
      }
    }
  }
}

class DungeonGenerator extends MapGenerator {
  constructor(width, height) {
    super(width, height, PATH, PATH);

    // add rat, spiders, bat
    // add spider champion,
    // add bat champion
    // add centipede
    // add scarab
    // add scorpion
    // add goblin
    // add orc
    // add cyclops
    // add golem
    var monsterGroup0 = [ RAT, SPIDERS, BAT];

    var monsterGroup1 = monsterGroup0.slice();
    monsterGroup1.push(SPIDER_CHAMPION);

    var monsterGroup2 = monsterGroup1.slice();
    monsterGroup2.push(BAT_CHAMPION);
    
    var monsterGroup3 = monsterGroup2.slice();
    monsterGroup3.push(CENTIPEDE);
    
    var monsterGroup4 = monsterGroup3.slice();
    monsterGroup4.push(SCARAB);

    var monsterGroup5 = monsterGroup4.slice();
    monsterGroup5.push(SCORPION);
    
    var monsterGroup6 = monsterGroup5.slice();
    monsterGroup6.push(GOBLIN);

    var monsterGroup7 = monsterGroup6.slice();
    monsterGroup7.push(ORC);
    
    var monsterGroup8 = monsterGroup7.slice();
    monsterGroup8.push(CYCLOPS);

    var monsterGroup9 = monsterGroup8.slice();
    monsterGroup9.push(GOLEM);
    

    this.monsterGroups = [ monsterGroup0,
                           monsterGroup1,
                           monsterGroup2,
                           monsterGroup3,
                           monsterGroup4,
                           monsterGroup5,
                           monsterGroup6,
                           monsterGroup7,
                           monsterGroup8,
                           monsterGroup9
                         ];
  }

  decorate() {
    // add locked doors and damaged wall tiles
    // add grate wall tiles
    // add skeletons
    for (let x = 0; x < this.map.width; ++x) {
      for (let y = 0; y < this.map.height - 1; ++y) {
        let loc = this.map.getLocation(x, y);

        if (loc.type == WALL) {
          loc.tileSprite = TILE_DARK_SOLID;
          let random = Math.random();
          if (random < 0.15) {
            loc.tileSprite = TILE_GRATE;
          } else if (random < 0.3) {
            loc.tileSprite = TILE_DARK_CRACKED;
          }
          if (x > 0 && x < this.map.width - 1 && y > 2) {
            if (this.map.getLocationType(x - 1, y) == WALL &&
                this.map.getLocationType(x + 1, y) == WALL &&
                this.map.getLocationType(x, y - 2) == CEILING) {
              let random = Math.random();
              if (random < 0.2) {
                loc.tileSprite = TILE_DARK_DOOR;
              }
            }
          }
        } else if (loc.type == PATH) {
          loc.tileSprite = TILE_SPARSE_CROSS;
        }
      }
    }
    for (let room of this.rooms) {
      // 1/3 rooms can have skulls
      if (Math.random() < 0.33) {
        let loc = this.getRandomLocation(room);
        if (!loc.isBlocked) {
          this.skullLocs.push(loc);
          loc.blocked = true;
        }
      }
    }
  }
}

class CatacombsGenerator extends MapGenerator {
  constructor(width, height) {
    super(width, height, DIRT, PATH);

    // add rat, spiders, bat
    // add spider champion,
    // add bat champion
    // add scorpion
    // add zombie
    // add undead
    // add mummy
    // add vampire
    // add wraith
    // add Carabia
    var monsterGroup0 = [ RAT, SPIDERS, BAT];

    var monsterGroup1 = monsterGroup0.slice();
    monsterGroup1.push(SPIDER_CHAMPION);

    var monsterGroup2 = monsterGroup1.slice();
    monsterGroup2.push(BAT_CHAMPION);
    
    var monsterGroup3 = monsterGroup2.slice();
    monsterGroup3.push(SCORPION);
    
    var monsterGroup4 = monsterGroup3.slice();
    monsterGroup4.push(ZOMBIE);

    var monsterGroup5 = monsterGroup4.slice();
    monsterGroup5.push(UNDEAD);
    
    var monsterGroup6 = monsterGroup5.slice();
    monsterGroup6.push(MUMMY);

    var monsterGroup7 = monsterGroup6.slice();
    monsterGroup7.push(VAMPIRE);
    
    var monsterGroup8 = monsterGroup7.slice();
    monsterGroup8.push(WRAITH);

    var monsterGroup9 = monsterGroup8.slice();
    monsterGroup9.push(CARABIA);
    

    this.monsterGroups = [ monsterGroup0,
                           monsterGroup1,
                           monsterGroup2,
                           monsterGroup3,
                           monsterGroup4,
                           monsterGroup5,
                           monsterGroup6,
                           monsterGroup7,
                           monsterGroup8,
                           monsterGroup9
                         ];
  }

  decorate() {
    // add skulls, tombstones, etc..
    for (let room of this.rooms) {
      // 1/2 rooms can have skulls
      if (Math.random() < 0.5) {
        this.placeSkull(room);
      }
      if (Math.random() < 0.5) {
        let loc = this.getRandomLocation(room);
        if (!loc.isBlocked) {
          this.tombstoneLocs.push(loc);
          loc.blocked = true;
        }
      }
    }
    // add pillar door tiles
    for (let x = 0; x < this.map.width; ++x) {
      for (let y = 0; y < this.map.height - 1; ++y) {
        let loc = this.map.getLocation(x, y);
        if (loc.type == WALL) {
          loc.tileSprite = TILE_PILLARS;
          if (x > 0 && x < this.map.width - 1 && y > 2) {
            if (this.map.getLocationType(x - 1, y) == WALL &&
                this.map.getLocationType(x + 1, y) == WALL &&
                this.map.getLocationType(x, y - 2) == CEILING) {
              let random = Math.random();
              if (random < 0.2) {
                loc.tileSprite = TILE_PILLAR_DOOR;
              }
            }
          }
        } else if (loc.type == DIRT) {
          loc.tileSprite = TILE_DIRT;
        } else if (loc.type == PATH) {
          loc.tileSprite = TILE_LARGE_CROSS;
        }
      }
    }
  }
}

class SorcerersLairGenerator extends MapGenerator {
  constructor(width, height) {
    super(width, height, PATH, PATH);
    // add goblin, orc, slimes, slime champion
    // add zombie
    // add undead
    // add vampire
    // add wraith
    // add werewolf
    // add carabia
    // add cyclops
    // add golem
    // add demon
    var monsterGroup0 = [ GOBLIN, ORC, SLIMES, SLIME_CHAMPION];

    var monsterGroup1 = monsterGroup0.slice();
    monsterGroup1.push(ZOMBIE);

    var monsterGroup2 = monsterGroup1.slice();
    monsterGroup2.push(UNDEAD);
    
    var monsterGroup3 = monsterGroup2.slice();
    monsterGroup3.push(VAMPIRE);
    
    var monsterGroup4 = monsterGroup3.slice();
    monsterGroup4.push(WRAITH);

    var monsterGroup5 = monsterGroup4.slice();
    monsterGroup5.push(WEREWOLF);
    
    var monsterGroup6 = monsterGroup5.slice();
    monsterGroup6.push(CARABIA);

    var monsterGroup7 = monsterGroup6.slice();
    monsterGroup7.push(CYCLOPS);
    
    var monsterGroup8 = monsterGroup7.slice();
    monsterGroup8.push(GOLEM);

    var monsterGroup9 = monsterGroup8.slice();
    monsterGroup9.push(DEMON);
    

    this.monsterGroups = [ monsterGroup0,
                           monsterGroup1,
                           monsterGroup2,
                           monsterGroup3,
                           monsterGroup4,
                           monsterGroup5,
                           monsterGroup6,
                           monsterGroup7,
                           monsterGroup8,
                           monsterGroup9
                         ];
  }

  decorate() {
    // add grates and doors on walls
    for (let x = 0; x < this.map.width; ++x) {
      for (let y = 1; y < this.map.height - 1; ++y) {
        let loc = this.map.getLocation(x, y);
        let locBelow = this.map.getLocation(x, y + 1)

        if (loc.type == WALL) {
          loc.tileSprite = TILE_THIN_BRICK;
          if (x > 0 && x < this.map.width - 1 && y > 2) {
            if (this.map.getLocationType(x - 1, y) == WALL &&
                this.map.getLocationType(x + 1, y) == WALL &&
                this.map.getLocationType(x, y - 2) == CEILING) {
              let random = Math.random();
              if (random < 0.1) {
                loc.tileSprite = TILE_ROUND_DOOR;
              } else if (random < 0.2) {
                loc.tileSprite = TILE_SQUARE_DOOR;
              } else if (random < 0.3) {
                loc.tileSprite = TILE_GRATE;
              }
            }
          }
        } else if (loc.type == PATH) {
          loc.tileSprite = TILE_LARGE_CROSS;
        }
      }
    }
    // add table, fountain, skulls, magical symbols
    for (let room of this.rooms) {
      if (Math.random() < 0.3) {
        this.placeSkull(room);
      }
      if (Math.random() < 0.2) {
        let loc = this.getRandomLocation(room);
        this.magicalObjectLocs.push(loc);
        loc.blocked = true;
      }
      if (Math.random() < 0.25) {
        let loc = this.getRandomLocation(room);
        this.symbolLocs.push(loc);
      }
    }
  }
}
