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
    // add some signs
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

        if (loc.type == WALL && locBelow.type == WATER) {
          let random = Math.random();
          if (random < 0.1) {
            loc.tileSprite = tileSprites[GRATE];
          }
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
          let random = Math.random();
          if (random < 0.85) {
            loc.tileSprite = tileSprite[DARK_SOLID];
          } else if (random < 0.9) {
            loc.tileSprite = tileSprite[GRATE];
          } else if (random < 0.95) {
            loc.tileSprite = tileSprite[DARK_CRACKED];
          } else {
            loc.tileSprite = tileSprite[DARK_DOOR];
          }
        }
      }
    }
  }
}

class CatacombsGenerator extends MapGenerator {
  constructor() {
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
    // add pillar door tiles
  }
}

class WizardsLairGenerator extends MapGenerator {
  constructor() {
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
    // add magic symbols
    // add table, fountain
    // add grates and doors on walls
  }
}
