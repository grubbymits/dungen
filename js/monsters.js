"use strict";

class Monster extends Actor {
  constructor(health, energy, subtype, vision, xp, position, game) {
    super(health, energy, vision, position,
          monsterSprites[subtype], monsterDamageSprites[subtype],
          MONSTER, game);
    this.level = this.game.level;
    this.subtype = subtype;
    this.attackRange = 3;
    this.exp = xp * this.level;
    this.findTarget.targets = this.game.heroes;
    this.name = ENEMY_NAMES[subtype];
    this.damageSprite = monsterDamageSprites[subtype];
    this.frozenSprite = frozenMonsterSprites[subtype];
    this.shockedSprite = shockedMonsterSprites[subtype];
    this.poisonedSprite = shockedMonsterSprites[subtype];
    this.burntSprite = burntMonsterSprites[subtype];
    this.currentSprite = monsterSprites[subtype];
  }

  get action() {
    if (this.currentHealth < 1) {
      throw("monster is already dead!");
    }
    this.currentSprite = this.sprite;
    if (this.currentEnergy <= 0) {
      return this.rest;
    } else if (this.nextAction === null) {
      this.nextAction = this.findTarget;
    }
    return this.nextAction;
  }

  get primaryAtkPower() {
    return this.attackPower;
  }

  get primaryAtkEnergy() {
    return this.attackEnergy;
  }

  get primaryAtkType() {
    return this.attackType;
  }

  get primaryAtkMagicPower() {
    return 0.20; //this.attackPower;
  }

  get primaryAtkRange() {
    return this.attackRange;
  }

  get secondaryAtkRange() {
    return 0;
  }

  reduceHealth(enemy, damage) {
    console.log("monster takes damage:", damage);
    this.currentHealth -= damage;
    if (this.currentHealth <= 0) {
      this.engine.addEvent(new OneEntityChange(this, MONSTER_DEATH_EVENT));
      this.game.audio.die();
    } else {
      this.attack.target = enemy;
      this.nextAction = this.attack;
    }
  }
}

// Creatures:
// Level 1: rat, bat, spiders, rabbit, lizard 
class Rat extends Monster {
  constructor(position, game) {
    super(45,     // health
          5,      // energy
          RAT,    // subtype
          4,      // vision
          5,      // xp
          position, game);
    this.attackPower = 1.5;
    this.attackType = NORMAL;
    this.attackEnergy = 2;
    this.physicalDefense = 25;
    this.magicResistance = 20;
    this.agility = 13;
  }
}

class Rabbit extends Monster {
  constructor(position, game) {
    super(50,     // health
          5,      // energy
          RABBIT,    // kind
          4,      // vision
          6,      // xp
          position, game);
    this.attackPower = 1.7;
    this.attackType = NORMAL;
    this.attackEnergy = 2;
    this.physicalDefense = 25;
    this.magicResistance = 20;
    this.agility = 15;
  }
}

class Spiders extends Monster {
  constructor(position, game) {
    super(44,
          5,
          SPIDERS,
          4,
          6,
          position, game);
    this.attackPower = 1.5;
    this.attackType = NORMAL;
    this.attackEnergy = 2;
    this.physicalDefense = 24;
    this.magicResistance = 20;
    this.agility = 15;
  }
}

class Bat extends Monster {
  constructor(position, game) {
    super(40,     // health
          5,      // energy
          BAT,    // kind
          5,      // vision
          7,      // xp
          position, game);
    this.attackPower = 1.5;
    this.attackType = NORMAL;
    this.attackEnergy = 2;
    this.physicalDefense = 22;
    this.magicResistance = 20;
    this.agility = 16;
  }
}

class Lizard extends Monster {
  constructor(position, game) {
    super(60,
          7,
          LIZARD,
          5,
          8,
          position, game);
    this.attackPower = 1.8;
    this.attackType = POISON;
    this.attackEnergy = 3;
    this.physicalDefense = 28;
    this.magicResistance = 25;
    this.agility = 10;
  }
}

// Level 2/3: Mushroom, Spider Champion, Bat Champion
class Mushroom extends Monster {
  constructor(position, game) {
    super(80,             // health
          6,              // energy
          MUSHROOM,       // kind
          4,              // vision
          10,             // xp
          position, game);
    this.attackPower = 1.8;
    this.attackType = POISON;
    this.attackEnergy = 2;
    this.physicalDefense = 29;
    this.magicResistance = 30;
    this.agility = 6;
  }
}

class SpiderChampion extends Monster {
  constructor(position, game) {
    super(70,
          8,
          SPIDER_CHAMPION,
          5,
          11,
          position, game);
    this.attackPower = 2.0;
    this.attackType = POISON;
    this.attackEnergy = 3;
    this.physicalDefense = 39;
    this.magicResistance = 32;
    this.agility = 17;
  }
}

class BatChampion extends Monster {
  constructor(position, game) {
    super(60,             // health
          8,              // energy
          BAT_CHAMPION,   // kind
          6,              // vision
          11,             // xp
          position, game);
    this.attackPower = 2.2;
    this.attackType = NORMAL;
    this.attackEnergy = 2;
    this.physicalDefense = 28;
    this.magicResistance = 26;
    this.agility = 18;
  }
}

// Level 4/5: Toad, Centipede, Snake
class Toad extends Monster {
  constructor(position, game) {
    super(100,          // health
          10,           // energy
          TOAD,         // kind
          5,            // vision
          14,           // xp
          position, game);
    this.attackPower = 2.5;
    this.attackType = NORMAL;
    this.attackEnergy = 2;
    this.physicalDefense = 40;
    this.magicResistance = 46;
    this.agility = 13;
  }
}

class Centipede extends Monster {
  constructor(position, game) {
    super(110,          // health
          12,           // energy
          CENTIPEDE,    // kind
          6,            // vision
          16,           // xp
          position, game);
    this.attackPower = 2.6;
    this.attackType = POISON;
    this.attackEnergy = 5;
    this.physicalDefense = 43;
    this.magicResistance = 48;
    this.agility = 13;
  }
}

class Snake extends Monster {
  constructor(position, game) {
    super(100,          // health
          12,           // energy
          SNAKE,        // kind
          8,            // vision
          18,           // xp
          position, game);
    this.attackPower = 2.6;
    this.attackType = POISON;
    this.attackEnergy = 4;
    this.physicalDefense = 40;
    this.magicResistance = 34;
    this.agility = 20;
  }
}

// Level 5/6: Scarab, Zombie
class Scarab extends Monster {
  constructor(position, game) {
    super(140,          // health
          14,           // energy
          SCARAB,       // kind
          5,            // vision
          20,           // xp
          position, game);
    this.attackPower = 2.7;
    this.attackType = NORMAL;
    this.attackEnergy = 2;
    this.physicalDefense = 45;
    this.magicResistance = 40;
    this.agility = 15;
  }
}

class Zombie extends Monster {
  constructor(position, game) {
    super(160,          // health
          12,           // energy
          ZOMBIE,       // kind
          5,            // vision
          20,           // xp
          position, game);
    this.attackPower = 2.6;
    this.attackType = NORMAL;
    this.attackEnergy = 2;
    this.physicalDefense = 39;
    this.magicResistance = 44;
    this.agility = 14;
  }
}

// Level 6: Scorpion, Undead, Serpent 
class Scorpion extends Monster {
  constructor(position, game) {
    super(140,          // health
          14,           // energy
          SCORPION,     // kind
          5,            // vision
          24,           // xp
          position, game);
    this.attackPower = 2.9;
    this.attackType = POISON;
    this.attackEnergy = 4;
    this.physicalDefense = 60;
    this.magicResistance = 54;
    this.agility = 20;
  }
}

class Undead extends Monster {
  constructor(position, game) {
    super(160,          // health
          12,           // energy
          UNDEAD,       // kind
          5,            // vision
          22,           // xp
          position, game);
    this.attackPower = 2.8;
    this.attackType = NORMAL;
    this.attackEnergy = 3;
    this.physicalDefense = 50;
    this.magicResistance = 44;
    this.agility = 14;
  }
}

class Serpent  extends Monster {
  constructor(position, game) {
    super(160,          // health
          12,           // energy
          SERPENT,      // kind
          6,            // vision
          28,           // xp
          position, game);
    this.attackPower = 3;
    this.attackType = NORMAL;
    this.attackEnergy = 3;
    this.physicalDefense = 37;
    this.magicResistance = 40;
    this.agility = 25;
  }
}

// Level 7: Werewolf, Goblin, Mummy
class Werewolf extends Monster {
  constructor(position, game) {
    super(180,          // health
          16,           // energy
          WEREWOLF,     // kind
          8,            // vision
          28,           // xp
          position, game);
    this.attackPower = 3;
    this.attackType = NORMAL;
    this.attackEnergy = 3;
    this.physicalDefense = 50;
    this.magicResistance = 52;
    this.agility = 25;
  }
}

class Goblin  extends Monster {
  constructor(position, game) {
    super(160,          // health
          14,           // energy
          GOBLIN,       // kind
          6,            // vision
          28,           // xp
          position, game);
    this.attackPower = 3;
    this.attackType = NORMAL;
    this.attackEnergy = 2;
    this.physicalDefense = 48;
    this.magicResistance = 40;
    this.agility = 25;
  }
}

class Mummy extends Monster {
  constructor(position, game) {
    super(160,          // health
          14,           // energy
          MUMMY,        // kind
          6,            // vision
          28,           // xp
          position, game);
    this.attackPower = 3;
    this.attackType = FIRE;
    this.attackRange = 5;
    this.attackEnergy = 5;
    this.physicalDefense = 52;
    this.magicResistance = 55;
    this.agility = 20;
  }
}

// Level 8: Wolf, Slimes, Orc, Vampire
class Wolf extends Monster {
  constructor(position, game) {
    super(160,          // health
          20,           // energy
          WOLF,         // kind
          6,            // vision
          28,           // xp
          position, game);
    this.attackPower = 3;
    this.attackType = NORMAL;
    this.attackEnergy = 3;
    this.physicalDefense = 48;
    this.magicResistance = 43;
    this.agility = 25;
  }
}

class Slimes extends Monster {
  constructor(position, game) {
    super(160,          // health
          14,           // energy
          SLIMES,       // kind
          6,            // vision
          28,           // xp
          position, game);
    this.attackPower = 3;
    this.attackType = NORMAL;
    this.attackEnergy = 3;
    this.physicalDefense = 52;
    this.magicResistance = 55;
    this.agility = 20;
  }
}

class Orc extends Monster {
  constructor(position, game) {
    super(160,          // health
          16,           // energy
          ORC,          // kind
          6,            // vision
          28,           // xp
          position, game);
    this.attackPower = 3.2;
    this.attackType = NORMAL;
    this.attackEnergy = 3;
    this.physicalDefense = 42;
    this.magicResistance = 40;
    this.agility = 25;
  }
}

class Vampire extends Monster {
  constructor(position, game) {
    super(220,          // health
          20,           // energy
          VAMPIRE,      // kind
          8,            // vision
          35,           // xp
          position, game);
    this.attackPower = 3.4;
    this.attackType = ICE;
    this.attackRange = 5;
    this.attackEnergy = 5;
    this.physicalDefense = 64;
    this.magicResistance = 64;
    this.agility = 25;
  }
}

// Level 9: Boar, Slime Champion, Cyclops, Wraith
class SlimeChampion extends Monster {
  constructor(position, game) {
    super(250,          // health
          16,           // energy
          SLIME_CHAMPION,       // kind
          6,            // vision
          35,           // xp
          position, game);
    this.attackPower = 3.4;
    this.attackType = NORMAL;
    this.attackEnergy = 3;
    this.physicalDefense = 63;
    this.magicResistance = 66;
    this.agility = 22;
  }
}

class Boar extends Monster {
  constructor(position, game) {
    super(270,          // health
          20,           // energy
          BOAR,       // kind
          6,            // vision
          36,           // xp
          position, game);
    this.attackPower = 3.6;
    this.attackType = NORMAL;
    this.attackEnergy = 3;
    this.physicalDefense = 50;
    this.magicResistance = 58;
    this.agility = 22;
  }
}

class Cyclops extends Monster {
  constructor(position, game) {
    super(270,          // health
          20,           // energy
          CYCLOPS,      // kind
          6,            // vision
          38,           // xp
          position, game);
    this.attackPower = 3.8;
    this.attackType = NORMAL;
    this.attackEnergy = 3;
    this.physicalDefense = 65;
    this.magicResistance = 60;
    this.agility = 22;
  }
}

class Wraith extends Monster {
  constructor(position, game) {
    super(270,          // health
          20,           // energy
          WRAITH,       // kind
          7,            // vision
          40,           // xp
          position, game);
    this.attackPower = 4.4;
    this.attackType = ELECTRIC;
    this.attackRange = 6;
    this.attackEnergy = 5;
    this.physicalDefense = 60;
    this.magicResistance = 65;
    this.agility = 25;
  }
}

// Level 10: Bear, Kraken, Golem, Carabia, Demon
class Bear extends Monster {
  constructor(position, game) {
    super(300,          // health
          25,           // energy
          BEAR,         // kind
          8,            // vision
          42,           // xp
          position, game);
    this.attackPower = 5;
    this.attackType = NORMAL;
    this.attackEnergy = 3;
    this.attackRange = 3;
    this.physicalDefense = 68;
    this.magicResistance = 62;
    this.agility = 25;
  }
}

class Kraken extends Monster {
  constructor(position, game) {
    super(350,          // health
          25,           // energy
          KRAKEN,       // kind
          7,            // vision
          44,           // xp
          position, game);
    this.attackPower = 4.4;
    this.attackType = ICE;
    this.attackRange = 5;
    this.attackEnergy = 5;
    this.physicalDefense = 70;
    this.magicResistance = 70;
    this.agility = 23;
  }
}

class Golem extends Monster {
  constructor(position, game) {
    super(400,          // health
          25,           // energy
          GOLEM,        // kind
          7,            // vision
          46,           // xp
          position, game);
    this.attackPower = 4.6;
    this.attackType = NORMAL;
    this.attackEnergy = 4;
    this.attackRange = 3;
    this.physicalDefense = 80;
    this.magicResistance = 70;
    this.agility = 20;
  }
}

class Carabia extends Monster {
  constructor(position, game) {
    super(380,          // health
          20,           // energy
          CARABIA,      // kind
          7,            // vision
          48,           // xp
          position, game);
    this.attackPower = 4.5;
    this.attackType = ELECTRIC;
    this.attackRange = 6;
    this.attackEnergy = 5;
    this.physicalDefense = 68;
    this.magicResistance = 72;
    this.agility = 25;
  }
}

class Demon extends Monster {
  constructor(position, game) {
    super(420,          // health
          25,           // energy
          DEMON,        // kind
          8,            // vision
          50,           // xp
          position, game);
    this.attackPower = 5;
    this.attackType = FIRE;
    this.attackRange = 6;
    this.attackEnergy = 5;
    this.physicalDefense = 80;
    this.magicResistance = 80;
    this.agility = 25;
  }
}
